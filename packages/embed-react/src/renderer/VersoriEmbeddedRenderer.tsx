import { Dialog } from '@radix-ui/themes';
import createDebug from 'debug';
import { useCallback } from 'react';
import { DialogContent, IntegrationPage } from '../components';
import { useDisconnectActivation } from '../hooks/useDisconnectActivation';
import { usePageSelectedState } from '../hooks/usePageSelectedState';
import { ConnectModalContent } from './ConnectModalContent';
import { useEmbeddedProjectPageQuery } from '../hooks/useEmbeddedIntegrationPageQuery';

const debug = createDebug('versori:embed:renderer');

export function VersoriEmbeddedRenderer() {
    const {
        isLoading,
        error,
        projects,
        refresh,
    } = useEmbeddedProjectPageQuery({});

    const { onDisconnectIntegration } = useDisconnectActivation();

    const { state: selectedState, onOpenChange, onConnectClick, onManageClick } = usePageSelectedState();

    const onCancel = useCallback(() => onOpenChange(false), [onOpenChange]);

    const onComplete = useCallback(() => {
        if (isLoading || error) {
            debug('WARN: onComplete called while loading or errored');

            return;
        }

        onOpenChange(false);
        refresh();
    }, [isLoading, error, refresh]);

    const onDisconnectClick = useCallback(
        (integrationId: string) => {
            onDisconnectIntegration(integrationId).then(refresh);
        },
        [onDisconnectIntegration, refresh]
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const activeProjectId = selectedState
        ? (projects.find((p) => p.id === selectedState?.projectId)?.id ?? '')
        : '';

    return (
        <>
            <IntegrationPage
                projects={projects}
                onConnectClick={onConnectClick}
                onManageClick={onManageClick}
                onDisconnectClick={onDisconnectClick}
                isConnectingId={activeProjectId}
            />
            <Dialog.Root open={!!selectedState && !!activeProjectId} onOpenChange={onOpenChange}>
                <DialogContent title="Connect" description="Activate this integration by connecting your account">
                    {selectedState?.method === 'connect' ? (
                        <ConnectModalContent
                            projectId={activeProjectId}
                            onCancel={onCancel}
                            onComplete={onComplete}
                        />
                    ) : null}
                </DialogContent>
            </Dialog.Root>
        </>
    );
}
