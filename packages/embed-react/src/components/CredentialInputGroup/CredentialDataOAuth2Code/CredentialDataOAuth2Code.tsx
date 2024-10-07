import { Label } from '@radix-ui/react-label';
import { Box, Button, Flex, TextField, Tooltip } from '@radix-ui/themes';
import { InitialiseOAuth2ConnectionResponse } from '@versori/sdk/connect';
import createDebug from 'debug';
import invariant from 'invariant';
import { startTransition, SyntheticEvent, useCallback, useEffect, useId, useState } from 'react';
import InfoCircledIcon from '../../../assets/info-circled.svg';
import { useVersoriEmbeddedContext } from '../../../provider/useVersoriEmbeddedContext';
import { CredentialDataProps } from '../types';
import { OAuth2Error, OAuth2WindowManager } from './OAuth2WindowManager';

const debug = createDebug('embed:credentials:CredentialDataOAuth2Code');

const CODE_HELP = 'Code is automatically populated once the user completes the Authorization flow';

export function CredentialDataOAuth2Code({
    connectorId,
    authSchemeConfig,
    data,
    onDataChange,
}: CredentialDataProps<'oauth2-code'>) {
    const { client } = useVersoriEmbeddedContext();
    const channelId = useId();
    const [isConnecting, setIsConnecting] = useState(false);

    invariant(authSchemeConfig.schemeType === 'oauth2', 'Expected scheme type to be oauth2');
    invariant(
        authSchemeConfig.grant.grantType === 'authorization_code',
        'Expected grant type to be authorization_code'
    );

    const {
        additionalAuthorizeParams,
        authorizeUrl,
        defaultScopes,
        grant: { credentialId, organisationId: credentialOrganisationId, clientId },
    } = authSchemeConfig;

    invariant(credentialId, 'Expected credentialId to be defined');
    invariant(credentialOrganisationId, 'Expected credentialOrganisationId to be defined');
    invariant(clientId, 'Expected clientId to be defined');

    const [isLoading, setIsLoading] = useState(true);
    const [initialiseResponse, setInitialiseResponse] = useState<InitialiseOAuth2ConnectionResponse | undefined>();

    useEffect(() => {
        client
            .initialiseOAuth2Connection(connectorId, {
                credential: {
                    id: credentialId,
                    organisationId: credentialOrganisationId,
                },
                clientId,
                additionalParams: additionalAuthorizeParams,
                authorizeUrl,
                disableOfflineAccess: !authSchemeConfig.scopes.some((scope) => scope.name === 'offline_access'),
                prompt: 'consent',
                scopes: defaultScopes,
            })
            .then(setInitialiseResponse)
            .catch((...args) => debug(`ERROR: failed to retrieve /authorize URL`, ...args))
            .finally(() => setIsLoading(false));
    }, []);

    const onAuthorize = useCallback((e: SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setIsConnecting(true);
    }, []);

    const onSuccess = useCallback(
        (code: string, state: string) => {
            startTransition(() => {
                setIsConnecting(false);
                onDataChange({
                    code,
                    state,
                });
            });
        },
        [onDataChange]
    );

    const onError = useCallback((info: OAuth2Error) => {
        debug('OAuth2 error', info);
        setIsConnecting(false);
    }, []);
    const onCancel = useCallback(() => setIsConnecting(false), []);

    return (
        <Flex align="end" gap="2">
            <Button variant="solid" disabled={isLoading || isConnecting} onClick={onAuthorize}>
                Authorize
            </Button>
            <Flex flexGrow="1">
                <Box width="100%" asChild>
                    <Label>
                        <Flex align="center" gap="1">
                            Code
                            <Tooltip content={CODE_HELP}>
                                <Flex>
                                    <InfoCircledIcon />
                                </Flex>
                            </Tooltip>
                        </Flex>
                        <TextField.Root disabled value={data.code ?? ''} />
                    </Label>
                </Box>
            </Flex>
            <OAuth2WindowManager
                open={isConnecting}
                channelId={channelId}
                url={initialiseResponse?.url ?? ''}
                onSuccess={onSuccess}
                onError={onError}
                onCancel={onCancel}
            />
        </Flex>
    );
}
