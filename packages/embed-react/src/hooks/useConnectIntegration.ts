import { CredentialSource } from '@versori/embed';
import { ApiError } from '@versori/sdk';
import { Activation, ActivationCreate, ConnectionTemplate, Project } from '@versori/sdk/platform';
import { useCallback, useEffect, useState } from 'react';
import { useVersoriEmbeddedContext } from '../provider/useVersoriEmbeddedContext';
import { useEmbeddedProjectQuery } from './useEmbeddedProjectQuery';

export type UseConnectIntegrationParams = {
    projectId: string;
    onComplete: (activation: Activation) => void;
};

export type UseConnectIntegrationHook = {
    isLoading: boolean;
    onConnect: (payload: ActivationCreate) => Promise<void>;

    project?: Project;
    connectionTemplates?: ConnectionTemplate[];
    primaryCredentialSource?: CredentialSource;
    error?: ApiError;
};

export function useConnectIntegration({
    projectId,
    onComplete,
}: UseConnectIntegrationParams): UseConnectIntegrationHook {
    const { client } = useVersoriEmbeddedContext();

    const { isLoading: isLoadingProject, error, project, connectionTemplates } = useEmbeddedProjectQuery({ projectId });

    // isLoading defaults to true if there is no endUser
    const [isLoadingEndUser, setIsLoadingEndUser] = useState(!client.endUser);
    const [primaryCredentialSource, setPrimaryCredentialSource] = useState<CredentialSource | undefined>();

    const onConnect = useCallback(
        (payload: ActivationCreate) => client.activateEndUser(payload).then(onComplete).catch(console.error),
        [client]
    );

    const doCreateEndUser = useCallback(async () => {
        await client.tryCreateEndUser();
    }, [client, project]);

    useEffect(() => {
        if (client.endUser) {
            setIsLoadingEndUser(false);

            return;
        }

        if (!project) {
            return;
        }

        doCreateEndUser()
            .then(() => setPrimaryCredentialSource(undefined))
            .catch(() => setPrimaryCredentialSource(client.primaryCredentialSource))
            .finally(() => setIsLoadingEndUser(false));
    }, [client, project, doCreateEndUser]);

    return {
        isLoading: isLoadingEndUser || isLoadingProject,
        onConnect,
        project,
        connectionTemplates,
        primaryCredentialSource,
        error,
    };
}
