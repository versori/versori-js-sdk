import { ApiError } from '@versori/sdk';
import { EmbeddedIntegrationPage, EmbeddedIntegrationSummary } from '@versori/sdk/embedded';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useVersoriEmbeddedContext } from '../provider/useVersoriEmbeddedContext';

export type UseEmbeddedIntegrationPageQueryParams = {
    /**
     * Deployed allowing filtering integrations to only return either deployed (`true`) or not deployed (`false`)
     * integrations.
     *
     * If not set, all integrations are returned.
     */
    deployed?: boolean;
};

export type UseEmbeddedIntegrationPageQueryHookLoading = Record<string, unknown> & {
    isLoading: true;
    error?: null;
    refresh: () => void;
};

export type UseEmbeddedIntegrationPageQueryHookError = Record<string, unknown> & {
    isLoading: false;
    error: ApiError;
    refresh: () => void;
};

type UseEmbeddedIntegrationPageQueryHookSuccess = {
    isLoading: false;
    error?: null;

    integrations: EmbeddedIntegrationSummary[];

    totalConnected: number;
    totalCount: number;

    hasPreviousPage: boolean;
    onPreviousPage: (e: SyntheticEvent<HTMLButtonElement>) => void;

    hasNextPage: boolean;
    onNextPage: (e: SyntheticEvent<HTMLButtonElement>) => void;

    refresh: () => void;
};

export type UseEmbeddedIntegrationPageQueryHook =
    | UseEmbeddedIntegrationPageQueryHookLoading
    | UseEmbeddedIntegrationPageQueryHookError
    | UseEmbeddedIntegrationPageQueryHookSuccess;

export function useEmbeddedIntegrationPageQuery({
    deployed,
}: UseEmbeddedIntegrationPageQueryParams): UseEmbeddedIntegrationPageQueryHook {
    const { client } = useVersoriEmbeddedContext();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);

    const [{ integrations, totalCount, totalConnected = 0, next, prev }, setPage] = useState<EmbeddedIntegrationPage>({
        integrations: [],
        totalCount: 0,
        totalConnected: 0,
    });

    const fetchPage = useCallback(() => {
        setIsLoading(true);

        client
            .getIntegrations({
                deployed,
            })
            .then(setPage)
            .catch(setError)
            .finally(() => setIsLoading(false));
    }, [client, deployed]);

    useEffect(() => {
        fetchPage();
    }, [client]);

    if (isLoading) {
        return { isLoading: true, refresh: fetchPage };
    }

    if (error) {
        return { isLoading: false, error, refresh: fetchPage };
    }

    return {
        isLoading,
        integrations,
        totalConnected,
        totalCount,
        hasPreviousPage: !!prev,
        onPreviousPage: () => {},
        hasNextPage: !!next,
        onNextPage: () => {},
        refresh: fetchPage,
    };
}
