import { useCallback } from 'react';
import { useVersoriEmbeddedContext } from '../provider/useVersoriEmbeddedContext';

export type UseDisconnectActivationHook = {
    onDisconnectIntegration: (integrationId: string) => Promise<void>;
};

export function useDisconnectActivation(): UseDisconnectActivationHook {
    const { client } = useVersoriEmbeddedContext();
    const onDisconnectIntegration = useCallback(
        async (projectId: string) => {
            const project = await client.getProject(projectId);
            const envId = project.environments[0].id;

            if (!envId) {
                throw new Error('No environment found');
            }

            const activations = await client.getActivations({ environment_id: envId });
            
            if (activations.length === 0) {
                throw new Error('No activations found');
            }

            if (activations.length > 1) {
                throw new Error('Cannot disconnect when there are multiple activations');
            }

            const [activation] = activations;

            return client.deactivateEndUser(envId, activation.id);
        },
        [client]
    );

    return {
        onDisconnectIntegration,
    };
}
