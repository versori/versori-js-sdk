import { Card, DropdownMenu, Flex, Heading, IconButton } from '@radix-ui/themes';
import cx from 'classnames';
import { SyntheticEvent, useCallback } from 'react';
import DotsVertical from '../../assets/dots-vertical.svg';
import { useVersoriEmbeddedContext } from '../../provider/useVersoriEmbeddedContext';
import { CommonComponentProps } from '../../types/CommonComponentProps';
import { ConnectButton } from './ConnectButton';

export type IntegrationTileProps = CommonComponentProps & {
    /**
     * integrationId is the unique identifier for this integration.
     */
    projectId: string;

    /**
     * Name is a short name for the integration, this is typically the name of the Connector being integrated to.
     */
    name: string;

    /**
     * imageURL is a URL to an image/icon that represents the integration. This image is used within the
     * integration tile displayed in the embedded UI.
     */
    imageUrl?: string;

    /**
     * description can be used to provide a longer description of the integration. This can be shown to end users
     * in the embedded integration hub UI.
     */
    description: string;

    /**
     * IsDeployed indicates whether the integration is deployed and available to end users. If not deployed, the
     * integration cannot be activated.
     *
     */
    isDeployed: boolean;

    /**
     * IsActivated indicates whether the integration is activated for the end user. If the integration is not
     * activated, the user can activate it from the embedded integration hub.
     *
     */
    isActivated: boolean;

    onConnectClick: (integrationId: string) => void;
    onManageClick: (integrationId: string) => void;
    onDisconnectClick: (integrationId: string) => void;
    isConnecting?: boolean;
};

export function IntegrationTile({
    id,
    className,
    projectId,
    name,
    imageUrl,
    isActivated,
    isDeployed,
    onConnectClick,
    onManageClick,
    onDisconnectClick,
    isConnecting,
}: IntegrationTileProps) {
    const { defaults } = useVersoriEmbeddedContext();

    const onClick = useCallback(
        (e: SyntheticEvent<HTMLButtonElement>) => {
            e.preventDefault();

            if (isActivated) {
                onManageClick(projectId);

                return;
            }

            onConnectClick(projectId);
        },
        [projectId, onConnectClick, onManageClick, isActivated]
    );

    const onDropdownManageClick = useCallback(() => onManageClick(projectId), [projectId, onManageClick]);

    const onDropdownDisconnectClick = useCallback(
        () => onDisconnectClick(projectId),
        [projectId, onDisconnectClick]
    );

    return (
        <Card id={id} className={cx(className, 'vi-IntegrationTile')}>
            <Flex
                direction="column"
                justify="between"
                align="center"
                height="100%"
                minWidth="160px"
                minHeight="160px"
                gap="3"
            >
                <Heading className="vi-IntegrationTile__Title" as="h2" size="2">
                    {name}
                </Heading>
                <Flex className="vi-IntegrationTile__Image" width="6em" height="6em" justify="center" align="center">
                    <Flex flexShrink="1" asChild>
                        <img
                            style={{ height: 'var(--height)', width: 'var(--width)', objectFit: 'contain' }}
                            // height="var(--height)"
                            // width="var(--width)"
                            className="vi-IntegrationTile__Image__img"
                            src={imageUrl || defaults.tileImageSrc}
                            alt={`Logo for integration, "${name}"`}
                        />
                    </Flex>
                </Flex>
                <Flex className="vi-IntegrationTile__Connect" justify="center" align="center" gap="2" width="100%">
                    <Flex flexGrow="1" asChild>
                        <ConnectButton
                            isActivated={isActivated}
                            isDeployed={isDeployed}
                            onClick={onClick}
                            loading={isConnecting}
                        />
                    </Flex>
                    {isActivated && (
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <IconButton variant="ghost">
                                    <DotsVertical />
                                </IconButton>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content variant="soft">
                                <DropdownMenu.Item onSelect={onDropdownManageClick}>Manage</DropdownMenu.Item>
                                <DropdownMenu.Item onSelect={onDropdownDisconnectClick} color="red">
                                    Disconnect
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    )}
                </Flex>
            </Flex>
        </Card>
    );
}
