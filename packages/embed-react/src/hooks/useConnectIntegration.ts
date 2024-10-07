import { Activation, ActivationCreate } from '@versori/sdk/embedded';
import { useCallback } from 'react';
import { useVersoriEmbeddedContext } from '../provider/useVersoriEmbeddedContext';

export type UseConnectIntegrationParams = {
    onComplete: (activation: Activation) => void;
};

export type UseConnectIntegrationHook = {
    onConnect: (payload: ActivationCreate) => Promise<void>;
};

export function useConnectIntegration({ onComplete }: UseConnectIntegrationParams): UseConnectIntegrationHook {
    const { client } = useVersoriEmbeddedContext();

    const onConnect = useCallback(
        (payload: ActivationCreate) => client.activateIntegration(payload).then(onComplete).catch(console.error),
        [client]
    );

    return {
        onConnect,
    };
}
