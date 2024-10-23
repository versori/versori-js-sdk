import { CredentialSource } from '@versori/embed';
import { ApiError } from '@versori/sdk';
import { Activation, ActivationCreate, EmbeddedIntegration, Integration } from '@versori/sdk/embedded';
import { useCallback, useEffect, useState } from 'react';
import { useVersoriEmbeddedContext } from '../provider/useVersoriEmbeddedContext';
import { useEmbeddedIntegrationQuery } from './useEmbeddedIntegrationQuery';

export type UseConnectIntegrationParams = {
    integrationId: string;
    onComplete: (activation: Activation) => void;
};

export type UseConnectIntegrationHook = {
    isLoading: boolean;
    onConnect: (payload: ActivationCreate) => Promise<void>;

    integration?: EmbeddedIntegration;
    primaryCredentialSource?: CredentialSource;
    error?: ApiError;
};

export function useConnectIntegration({
    integrationId,
    onComplete,
}: UseConnectIntegrationParams): UseConnectIntegrationHook {
    const { client } = useVersoriEmbeddedContext();

    const { isLoading: isLoadingIntegration, error, integration } = useEmbeddedIntegrationQuery({ integrationId });

    // isLoading defaults to true if there is no endUser
    const [isLoadingEndUser, setIsLoadingEndUser] = useState(!client.endUser);
    const [primaryCredentialSource, setPrimaryCredentialSource] = useState<CredentialSource | undefined>();

    const onConnect = useCallback(
        (payload: ActivationCreate) => client.activateIntegration(payload).then(onComplete).catch(console.error),
        [client]
    );

    const doCreateEndUser = useCallback(async () => {
        const hub = await client.getHub();

        await client.tryCreateEndUser(hub.primaryConnector.authSchemeConfig);
    }, [client, integration]);

    useEffect(() => {
        if (client.endUser) {
            setIsLoadingEndUser(false);

            return;
        }

        if (!integration) {
            return;
        }

        doCreateEndUser()
            .then(() => setPrimaryCredentialSource(undefined))
            .catch(() => setPrimaryCredentialSource(client.primaryCredentialSource))
            .finally(() => setIsLoadingEndUser(false));
    }, [client, integration, doCreateEndUser]);

    return {
        isLoading: isLoadingEndUser || isLoadingIntegration,
        onConnect,
        integration,
        primaryCredentialSource,
        error,
    };
}
