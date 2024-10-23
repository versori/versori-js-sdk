import { Badge, Flex, Grid } from '@radix-ui/themes';
import { EmbeddedIntegrationPage } from '@versori/sdk/embedded';
import cx from 'classnames';
import { SyntheticEvent } from 'react';
import { CommonComponentProps } from '../../types/CommonComponentProps';
import { IntegrationTile } from '../IntegrationTile/IntegrationTile';

export type IntegrationPageProps = EmbeddedIntegrationPage &
    CommonComponentProps & {
        hasPreviousPage: boolean;
        onPreviousPage: (e: SyntheticEvent<HTMLButtonElement>) => void;

        hasNextPage: boolean;
        onNextPage: (e: SyntheticEvent<HTMLButtonElement>) => void;

        onConnectClick: (integrationId: string) => void;
        onManageClick: (integrationId: string) => void;
        onDisconnectClick: (integrationId: string) => void;

        /**
         * isConnectingId is an optional integration ID which is currently being connected
         */
        isConnectingId?: string;
    };

export function IntegrationPage({
    id,
    className,
    integrations,
    totalConnected,
    totalCount,
    onConnectClick,
    onManageClick,
    onDisconnectClick,
    isConnectingId,
}: IntegrationPageProps) {
    return (
        <Flex id={id} className={cx(className, 'vi-IntegrationPage')} direction="column">
            <Flex className="vi-IntegrationPage__Header" justify="end" m="2">
                <Flex className="vi-IntegrationPage__Stats" gap="4">
                    <Flex
                        id="integration-page__total-connected"
                        className="vi-IntegrationPage__Stat"
                        align="center"
                        gap="1"
                    >
                        <span className="vi-IntegrationPage__StatLabel">Connected</span>
                        <Badge className="vi-IntegrationPage__StatValue">{totalConnected ?? 0}</Badge>
                    </Flex>
                    <Flex
                        id="integration-page__total-integrations"
                        className="vi-IntegrationPage__Stat"
                        align="center"
                        gap="1"
                    >
                        <span className="vi-IntegrationPage__StatLabel">Total</span>
                        <Badge className="vi-IntegrationPage__StatValue">{totalCount}</Badge>
                    </Flex>
                </Flex>
            </Flex>
            <Grid
                className="vi-IntegrationPage__Integrations"
                gap="4"
                columns="repeat(auto-fill, minmax(200px, 1fr))"
                m="2"
            >
                {integrations.map((integration) => (
                    <IntegrationTile
                        key={integration.id}
                        integrationId={integration.id}
                        name={integration.name}
                        description={integration.description}
                        isActivated={integration.isActivated}
                        isDeployed={integration.isDeployed}
                        imageUrl={integration.imageUrl}
                        onConnectClick={onConnectClick}
                        onManageClick={onManageClick}
                        onDisconnectClick={onDisconnectClick}
                        isConnecting={isConnectingId === integration.id}
                    />
                ))}
            </Grid>
        </Flex>
    );
}
