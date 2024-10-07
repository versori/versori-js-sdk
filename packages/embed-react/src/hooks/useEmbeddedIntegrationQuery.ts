import { ApiError } from '@versori/sdk';
import { EmbeddedIntegration } from '@versori/sdk/embedded';
import invariant from 'invariant';
import { useEffect, useState } from 'react';
import { useVersoriEmbeddedContext } from '../provider/useVersoriEmbeddedContext';

export type UseEmbeddedIntegrationQueryParams = {
    integrationId: string;
};

export type UseEmbeddedIntegrationQueryHookLoading = Record<string, unknown> & {
    isLoading: true;
    error?: null;
};

export type UseEmbeddedIntegrationQueryHookError = Record<string, unknown> & {
    isLoading: false;
    error: ApiError;
};

type UseEmbeddedIntegrationQueryHookSuccess = {
    isLoading: false;
    error?: null;

    integration: EmbeddedIntegration;
};

export type UseEmbeddedIntegrationQueryHook =
    | UseEmbeddedIntegrationQueryHookLoading
    | UseEmbeddedIntegrationQueryHookError
    | UseEmbeddedIntegrationQueryHookSuccess;

export function useEmbeddedIntegrationQuery({
    integrationId,
}: UseEmbeddedIntegrationQueryParams): UseEmbeddedIntegrationQueryHook {
    const { client } = useVersoriEmbeddedContext();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);

    const [integration, setIntegration] = useState<EmbeddedIntegration | undefined>(undefined);

    useEffect(() => {
        if (!client) {
            return;
        }

        client
            .getIntegration(integrationId)
            .then(setIntegration)
            .catch(setError)
            .finally(() => setIsLoading(false));
    }, [client, integrationId]);

    if (isLoading) {
        return { isLoading: true };
    }

    if (error) {
        return { isLoading: false, error };
    }

    invariant(integration, 'integration should be defined');

    return {
        isLoading: false,
        integration: integration,
    };
}
