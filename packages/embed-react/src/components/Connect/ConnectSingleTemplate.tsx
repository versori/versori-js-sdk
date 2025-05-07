import { Button, Flex, Heading, Spinner } from '@radix-ui/themes';
import { SyntheticEvent, useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { ulid } from 'ulid';
import * as yup from 'yup';
import { useIsMounted } from '../../internal/hooks/useIsMounted';
import { CredentialInputGroup } from '../CredentialInputGroup/CredentialInputGroup';
import { newCredentialCreate } from '../CredentialInputGroup/helpers/newCredential';
import { validateConnectionCredentialCreate } from './helpers/validation';
import { ConnectProps } from './types';
import { ConnectionCredential, ConnectionTemplate, Credential } from '../../../../sdk/src/platform';

export type ConnectSingleTemplateProps = ConnectProps & {
    template: ConnectionTemplate;
};

/**
 * Connect to an integration which only has a single connection template (excluding the primary template).
 */
export function ConnectSingleTemplate({
    userId,
    orgId,
    project,
    template,
    onConnect,
    onCancel,
    ...commonProps
}: ConnectSingleTemplateProps) {
    const { id: projectId, name } = project;

    const environmentId = useMemo(() => project.environments[0].id, [project]);

    const { authSchemeConfigs, id: templateId } = template;
    const [credentialId] = useState(ulid());
    const [credential, setCredential] = useState(newCredentialCreate(authSchemeConfigs[0], orgId));
    const [errors, setErrors] = useState<yup.ValidationError[]>([]);
    const isMounted = useIsMounted();
    const formRef = useRef<HTMLFormElement>(null);

    const [isLoading, setIsLoading] = useState(false);

    const onChange = useCallback((_: string, credential: Credential) => setCredential(credential), []);

    const onSubmit = useCallback(
        (e: SyntheticEvent<HTMLFormElement>) => {
            e.preventDefault();

            const connectionCredentialCreate: ConnectionCredential = {
                id: credentialId,
                credential,
                authSchemeConfig: authSchemeConfigs[0],
            };

            const errors = validateConnectionCredentialCreate(connectionCredentialCreate);
            if (errors.length > 0) {
                setErrors(errors);

                return;
            }

            setIsLoading(true);

            onConnect({
                userId,
                environmentId,
                connections: [
                    {
                        connectionTemplateId: templateId,
                        connection: {
                            name,
                            credentials: [connectionCredentialCreate],
                            variables: []
                        }
                    },
                ],
            }).then(() => {
                if (isMounted.current) {
                    setIsLoading(false);
                }
            });
        },
        [onConnect, environmentId, templateId, name, credential, authSchemeConfigs]
    );

    const onReset = useCallback(() => setCredential(newCredentialCreate(authSchemeConfigs[0], orgId)), [authSchemeConfigs]);

    useEffect(() => {
        const connectionCredentialCreate: ConnectionCredential = {
            id: credentialId,
            credential,
            authSchemeConfig: authSchemeConfigs[0],
        };

        setErrors(validateConnectionCredentialCreate(connectionCredentialCreate));
    }, [credential, authSchemeConfigs]);

    useEffect(() => {
        if (errors.length > 0) {
            return;
        }

        if (authSchemeConfigs[0].type !== 'oauth2') {
            return;
        }

        if (authSchemeConfigs[0].oauth2?.grant.type !== 'authorizationCode') {
            return;
        }

        formRef.current?.requestSubmit();
    }, [errors, authSchemeConfigs]);

    return (
        <Flex direction="column" gap="4" {...commonProps}>
            <Heading as="h2">Connect to {name}</Heading>
            <Flex direction="column" gap="4" asChild>
                <form ref={formRef} onSubmit={onSubmit} onReset={onReset}>
                    <CredentialInputGroup
                        id={credentialId}
                        systemId={template.id} // this is the system id its confusing af tho
                        name="credential"
                        authSchemeConfig={authSchemeConfigs[0]}
                        credential={credential}
                        onChange={onChange}
                        errors={errors}
                    />
                    <Flex justify="end" gap="2">
                        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button variant="solid" type="submit" disabled={errors.length > 0} loading={isLoading}>
                            Connect
                        </Button>
                    </Flex>
                </form>
            </Flex>
        </Flex>
    );
}
