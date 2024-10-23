import { Dialog } from '@radix-ui/themes';
import createDebug from 'debug';
import { useCallback } from 'react';
import { DialogContent, IntegrationPage } from '../components';
import { useDisconnectActivation } from '../hooks/useDisconnectActivation';
import { useEmbeddedIntegrationPageQuery } from '../hooks/useEmbeddedIntegrationPageQuery';
import { usePageSelectedState } from '../hooks/usePageSelectedState';
import { ConnectModalContent } from './ConnectModalContent';

const debug = createDebug('versori:embed:renderer');

export function VersoriEmbeddedRenderer() {
    const {
        isLoading,
        error,
        totalCount,
        integrations,
        hasPreviousPage,
        onPreviousPage,
        hasNextPage,
        onNextPage,
        totalConnected,
        refresh,
    } = useEmbeddedIntegrationPageQuery({});

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

    const activeIntegrationId = selectedState
        ? (integrations.find((int) => int.id === selectedState?.integrationId)?.id ?? '')
        : '';

    return (
        <>
            <IntegrationPage
                totalCount={totalCount}
                totalConnected={totalConnected}
                integrations={integrations}
                hasPreviousPage={hasPreviousPage}
                onPreviousPage={onPreviousPage}
                hasNextPage={hasNextPage}
                onNextPage={onNextPage}
                onConnectClick={onConnectClick}
                onManageClick={onManageClick}
                onDisconnectClick={onDisconnectClick}
                isConnectingId={activeIntegrationId}
            />
            <Dialog.Root open={!!selectedState && !!activeIntegrationId} onOpenChange={onOpenChange}>
                <DialogContent title="Connect" description="Activate this integration by connecting your account">
                    {selectedState?.method === 'connect' ? (
                        <ConnectModalContent
                            integrationId={activeIntegrationId}
                            onCancel={onCancel}
                            onComplete={onComplete}
                        />
                    ) : null}
                </DialogContent>
            </Dialog.Root>
        </>
    );
}
