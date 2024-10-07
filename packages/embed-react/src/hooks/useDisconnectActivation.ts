import { useCallback } from 'react';
import { useVersoriEmbeddedContext } from '../provider/useVersoriEmbeddedContext';

export type UseDisconnectActivationHook = {
    onDisconnectIntegration: (integrationId: string) => Promise<void>;
};

export function useDisconnectActivation(): UseDisconnectActivationHook {
    const { client } = useVersoriEmbeddedContext();
    const onDisconnectIntegration = useCallback(
        async (integrationId: string) => {
            const page = await client.getActivations({ integration_id: integrationId });
            if (page.activations.length === 0) {
                throw new Error('No activations found');
            }

            if (page.activations.length > 1) {
                throw new Error('Cannot disconnect when there are multiple activations');
            }

            const [activation] = page.activations;

            return client.deactivateIntegration(activation.id);
        },
        [client]
    );

    return {
        onDisconnectIntegration,
    };
}
