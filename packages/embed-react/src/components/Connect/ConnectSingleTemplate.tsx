import { Button, Flex, Heading, Spinner } from '@radix-ui/themes';
import { ConnectionCredentialCreate, CredentialCreate, HubConnectionTemplate } from '@versori/sdk/embedded';
import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { ulid } from 'ulid';
import * as yup from 'yup';
import { useIsMounted } from '../../internal/hooks/useIsMounted';
import { CredentialInputGroup } from '../CredentialInputGroup/CredentialInputGroup';
import { newCredentialCreate } from '../CredentialInputGroup/helpers/newCredential';
import { validateConnectionCredentialCreate } from './helpers/validation';
import { ConnectProps } from './types';

export type ConnectSingleTemplateProps = ConnectProps & {
    template: HubConnectionTemplate;
};

/**
 * Connect to an integration which only has a single connection template (excluding the primary template).
 */
export function ConnectSingleTemplate({
    userId,
    integration,
    template,
    onConnect,
    onCancel,
    ...commonProps
}: ConnectSingleTemplateProps) {
    const { id: integrationId, name } = integration;

    const { connectorId, authSchemeConfig, id: templateId } = template;
    const [credentialId] = useState(ulid());
    const [credential, setCredential] = useState(newCredentialCreate(authSchemeConfig));
    const [errors, setErrors] = useState<yup.ValidationError[]>([]);
    const isMounted = useIsMounted();
    const formRef = useRef<HTMLFormElement>(null);

    const [isLoading, setIsLoading] = useState(false);

    const onChange = useCallback((_: string, credential: CredentialCreate) => setCredential(credential), []);

    const onSubmit = useCallback(
        (e: SyntheticEvent<HTMLFormElement>) => {
            e.preventDefault();

            const connectionCredentialCreate: ConnectionCredentialCreate = {
                credential,
                authSchemeConfig,
            };

            const errors = validateConnectionCredentialCreate(connectionCredentialCreate);
            if (errors.length > 0) {
                setErrors(errors);

                return;
            }

            setIsLoading(true);

            onConnect({
                userId,
                integrationId,
                variables: [],
                connections: [
                    {
                        templateId,
                        name,
                        variables: [],
                        credentials: {
                            action: [connectionCredentialCreate],
                        },
                    },
                ],
            }).then(() => {
                if (isMounted.current) {
                    setIsLoading(false);
                }
            });
        },
        [onConnect, integrationId, templateId, name, credential, authSchemeConfig]
    );

    const onReset = useCallback(() => setCredential(newCredentialCreate(authSchemeConfig)), [authSchemeConfig]);

    useEffect(() => {
        const connectionCredentialCreate: ConnectionCredentialCreate = {
            credential,
            authSchemeConfig,
        };

        setErrors(validateConnectionCredentialCreate(connectionCredentialCreate))
    }, [credential, authSchemeConfig]);

    useEffect(() => {
        if (errors.length > 0) {
            return;
        }

        if (authSchemeConfig.schemeType !== 'oauth2') {
            return;
        }

        if (authSchemeConfig.grant.grantType !== 'authorization_code') {
            return;
        }

        formRef.current?.requestSubmit();
    }, [errors, authSchemeConfig]);

    return (
        <Flex direction="column" gap="4" {...commonProps}>
            <Heading as="h2">Connect to {name}</Heading>
            <Flex direction="column" gap="4" asChild>
                <form ref={formRef} onSubmit={onSubmit} onReset={onReset}>
                    <CredentialInputGroup
                        id={credentialId}
                        connectorId={connectorId}
                        name="credential"
                        authSchemeConfig={authSchemeConfig}
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
