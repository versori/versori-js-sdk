import { ApiError } from '@versori/sdk';
import { useCallback, useEffect, useState } from 'react';
import { useVersoriEmbeddedContext } from '../provider/useVersoriEmbeddedContext';
import { UserProjectSummary } from '../../../embed/src/PlatformClient';

export type UseEmbeddedProjectPageQueryParams = {
    /**
     * Deployed allowing filtering integrations to only return either deployed (`true`) or not deployed (`false`)
     * integrations.
     *
     * If not set, all integrations are returned.
     */
    deployed?: boolean;
};

export type UseEmbeddedProjectPageQueryHookLoading = Record<string, unknown> & {
    isLoading: true;
    error?: null;
    projects: UserProjectSummary[];
    refresh: () => void;
};

export type UseEmbeddedProjectPageQueryHookError = Record<string, unknown> & {
    isLoading: false;
    error: ApiError;
    projects: UserProjectSummary[];
    refresh: () => void;
};

type UseEmbeddedProjectPageQueryHookSuccess = {
    isLoading: false;
    error?: null;

    projects: UserProjectSummary[];
    refresh: () => void;
};

export type UseEmbeddedProjectPageQueryHook =
    | UseEmbeddedProjectPageQueryHookLoading
    | UseEmbeddedProjectPageQueryHookError
    | UseEmbeddedProjectPageQueryHookSuccess;

export function useEmbeddedProjectPageQuery({
    deployed,
}: UseEmbeddedProjectPageQueryParams): UseEmbeddedProjectPageQueryHook {
    const { client } = useVersoriEmbeddedContext();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);

    const [projectSummaries, setProjectSummaries] = useState<UserProjectSummary[]>([]);

    const fetchPage = useCallback(() => {
        setIsLoading(true);

        client
            .getUserProjects(deployed)
            .then(setProjectSummaries)
            .catch(setError)
            .finally(() => setIsLoading(false));
    }, [client, deployed]);

    useEffect(() => {
        fetchPage();
    }, [client]);

    if (isLoading) {
        return { isLoading: true, refresh: fetchPage, projects: [] };
    }

    if (error) {
        return { isLoading: false, error, refresh: fetchPage, projects: [] };
    }

    return {
        isLoading,
        projects: projectSummaries,
        refresh: fetchPage,
    };
}
