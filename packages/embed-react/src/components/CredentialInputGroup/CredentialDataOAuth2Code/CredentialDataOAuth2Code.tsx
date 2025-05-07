import { Button, Flex, Text } from '@radix-ui/themes';
import createDebug from 'debug';
import invariant from 'invariant';
import { startTransition, SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useVersoriEmbeddedContext } from '../../../provider/useVersoriEmbeddedContext';
import { CredentialDataProps } from '../types';
import { OAuth2Error, OAuth2WindowManager } from './OAuth2WindowManager';
import { InitialiseOAuth2ConnectionResponse } from '../../../../../sdk/src/platform';

const debug = createDebug('embed:credentials:CredentialDataOAuth2Code');

export function CredentialDataOAuth2Code({ authSchemeConfig, systemId, data, onDataChange }: CredentialDataProps<'oauth2-code'>) {
    const { client } = useVersoriEmbeddedContext();
    const [isConnecting, setIsConnecting] = useState(true);

    invariant(authSchemeConfig.type === 'oauth2', 'Expected scheme type to be oauth2');
    invariant(
        authSchemeConfig.oauth2?.grant.type === 'authorizationCode',
        'Expected grant type to be authorization_code'
    );

    const { oauth2 } = authSchemeConfig;

    const {
        additionalAuthorizeParams,
        authorizeUrl,
        defaultScopes,
    } = oauth2;
    
    if (!oauth2.grant.authorizationCode) {
        throw new Error('Expected grant type to be authorization_code');
    }

    if (authorizeUrl === undefined) {
        throw new Error('Expected authorizeUrl to be defined');
    }

    const { credentialId, organisationId: credentialOrganisationId, clientId } = oauth2.grant.authorizationCode;

    invariant(credentialId, 'Expected credentialId to be defined');
    invariant(credentialOrganisationId, 'Expected credentialOrganisationId to be defined');
    invariant(clientId, 'Expected clientId to be defined');

    const [isLoading, setIsLoading] = useState(true);
    const [initialiseResponse, setInitialiseResponse] = useState<InitialiseOAuth2ConnectionResponse | undefined>();

    const disableOfflineAccess =  useMemo(() => {
        if (!authSchemeConfig.oauth2) {
            return false;
        }

        return authSchemeConfig.oauth2?.scopes.some((scope) => scope.name === 'offline_access')
    }, [authSchemeConfig.oauth2] );

    useEffect(() => {
        client
            .initialiseOAuth2Connection(systemId!, {
                credential: {
                    id: credentialId,
                    organisationId: credentialOrganisationId,
                },
                clientId,
                additionalParams: additionalAuthorizeParams,
                authorizeUrl,
                disableOfflineAccess,
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
                    oauth2Code: {
                        code,
                        state,
                    },
                });
            });
        },
        [onDataChange]
    );

    const onError = useCallback(
        (info: OAuth2Error) => {
            debug('OAuth2 error', info);
            onDataChange({ oauth2Code: { code: '', state: '' } });
            setIsConnecting(false);
        },
        [onDataChange]
    );

    const onCancel = useCallback(() => setIsConnecting(false), []);

    return (
        <Flex align="center" justify="end" gap="2">
            <Text>{data.oauth2Code.code ? 'Connected' : 'Not Connected'}</Text>
            <Button variant="outline" disabled={isLoading || isConnecting} onClick={onAuthorize}>
                Reauthorize
            </Button>
            <OAuth2WindowManager
                open={!isLoading && isConnecting}
                url={initialiseResponse?.url ?? ''}
                onSuccess={onSuccess}
                onError={onError}
                onCancel={onCancel}
                callbackOrigin={client.oauth2CallbackOrigin}
            />
        </Flex>
    );
}
