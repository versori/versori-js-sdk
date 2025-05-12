import { Activation } from '@versori/sdk/platform';
import { Connect } from '../../components/Connect/Connect';
import { useConnectIntegration } from '../../hooks/useConnectIntegration';
import { useVersoriEmbeddedContext } from '../../provider/useVersoriEmbeddedContext';

export type ConnectModalContentProps = {
    projectId: string;
    onCancel: () => void;
    onComplete: (activation: Activation) => void;
};

export function ConnectModalContent({ projectId, onCancel, onComplete }: ConnectModalContentProps) {
    const { client } = useVersoriEmbeddedContext();
    const { onConnect, isLoading, error, project, connectionTemplates } = useConnectIntegration({
        onComplete,
        projectId,
    });

    if (isLoading) {
        return <div>Loading</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Connect
            userId={client.userExternalId}
            orgId={client.orgId}
            project={project!}
            connectionTemplates={connectionTemplates!}
            onConnect={onConnect}
            onCancel={onCancel}
        />
    );
}
