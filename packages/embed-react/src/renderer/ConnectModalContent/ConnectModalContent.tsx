import { Activation } from '@versori/sdk/embedded';
import { Connect } from '../../components/Connect/Connect';
import { useConnectIntegration } from '../../hooks/useConnectIntegration';
import { useVersoriEmbeddedContext } from '../../provider/useVersoriEmbeddedContext';

export type ConnectModalContentProps = {
    integrationId: string;
    onCancel: () => void;
    onComplete: (activation: Activation) => void;
};

export function ConnectModalContent({ integrationId, onCancel, onComplete }: ConnectModalContentProps) {
    const { client } = useVersoriEmbeddedContext();
    const { onConnect, isLoading, error, integration, primaryCredentialSource } = useConnectIntegration({ onComplete, integrationId });

    if (isLoading) {
        return <div>Loading</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Connect userId={client.userExternalId} integration={integration!} onConnect={onConnect} onCancel={onCancel} />
    );
}
