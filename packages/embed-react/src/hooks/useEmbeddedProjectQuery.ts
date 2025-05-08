import { ApiError } from '@versori/sdk';
import invariant from 'invariant';
import { useEffect, useMemo, useState } from 'react';
import { useVersoriEmbeddedContext } from '../provider/useVersoriEmbeddedContext';
import { ConnectionTemplate, Project } from '@versori/sdk/platform';

export type UseEmbeddedProjectQueryParams = {
    projectId: string;
};

export type UseEmbeddedProjectQueryHookLoading = Record<string, unknown> & {
    isLoading: true;
    error?: ApiError;
    project?: Project;
    connectionTemplates?: ConnectionTemplate[];
};

export type UseEmbeddedProjectQueryHookError = Record<string, unknown> & {
    isLoading: false;
    error: ApiError;
    project?: Project;
    connectionTemplates?: ConnectionTemplate[];
};

type UseEmbeddedProjectQueryHookSuccess = {
    isLoading: false;
    error?: ApiError;

    project: Project;
    connectionTemplates: ConnectionTemplate[];
};

export type UseEmbeddedProjectQueryHook =
    | UseEmbeddedProjectQueryHookLoading
    | UseEmbeddedProjectQueryHookError
    | UseEmbeddedProjectQueryHookSuccess;

export function useEmbeddedProjectQuery({ projectId }: UseEmbeddedProjectQueryParams): UseEmbeddedProjectQueryHook {
    const { client } = useVersoriEmbeddedContext();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);

    const [project, setProject] = useState<Project | undefined>(undefined);
    const [connectionTemplates, setConnectionTemplates] = useState<ConnectionTemplate[]>([]);

    const environmentId = useMemo(() => {
        return project?.environments[0].id ?? '';
    }, [project]);

    useEffect(() => {
        if (!client) {
            return;
        }

        client
            .getProject(projectId)
            .then(setProject)
            .catch(setError)
            .finally(() => setIsLoading(false));
    }, [client, projectId]);

    useEffect(() => {
        if (!environmentId) {
            return;
        }

        client
            .getConnectionTemplates(projectId, environmentId)
            .then((templates) => {
                setConnectionTemplates(templates.filter((t) => t.dynamic === true));
            })
            .catch(setError);
    }, [client, projectId, project]);

    if (isLoading) {
        return { isLoading: true };
    }

    if (error) {
        return { isLoading: false, error };
    }

    invariant(project, 'project should be defined');

    return {
        isLoading: false,
        project: project,
        connectionTemplates: connectionTemplates,
    };
}
