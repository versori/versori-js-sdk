import {Flex, Grid } from '@radix-ui/themes';
import cx from 'classnames';
import { useCallback } from 'react';
import { CommonComponentProps } from '../../types/CommonComponentProps';
import { IntegrationTile } from '../IntegrationTile/IntegrationTile';
import { ProjectSummary } from '@versori/sdk/platform';
import { UserProjectSummary } from '@versori/embed';

export type IntegrationPageProps = {projects: UserProjectSummary[]} &
    CommonComponentProps & {
        // hasPreviousPage: boolean;
        // onPreviousPage: (e: SyntheticEvent<HTMLButtonElement>) => void;

        // hasNextPage: boolean;
        // onNextPage: (e: SyntheticEvent<HTMLButtonElement>) => void;

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
    projects,
    onConnectClick,
    onManageClick,
    onDisconnectClick,
    isConnectingId,
}: IntegrationPageProps) {
    const isDeployed = useCallback((project: ProjectSummary) => {
        return project.environments[0].status === 'running';
    }, []);

    return (
        <Flex id={id} className={cx(className, 'vi-IntegrationPage')} direction="column">
            <Grid
                className="vi-IntegrationPage__Integrations"
                gap="4"
                columns="repeat(auto-fill, minmax(200px, 1fr))"
                m="2"
            >
                {projects.map((project) => (
                    <IntegrationTile
                        key={project.id}
                        projectId={project.id}
                        name={project.name}
                        description="" // TODO
                        isActivated={project.isActivated}
                        isDeployed={isDeployed(project)}
                        // imageUrl={project.imageUrl} // TODO
                        onConnectClick={onConnectClick}
                        onManageClick={onManageClick}
                        onDisconnectClick={onDisconnectClick}
                        isConnecting={isConnectingId === project.id}
                    />
                ))}
            </Grid>
        </Flex>
    );
}

// This goes in before the grid above when we have the totalCount and totalConnected stats
//<Flex className="vi-IntegrationPage__Header" justify="end" m="2">
//                <Flex className="vi-IntegrationPage__Stats" gap="4">
//                    <Flex
//                        id="integration-page__total-connected"
//                        className="vi-IntegrationPage__Stat"
//                        align="center"
//                        gap="1"
//                    >
//                        <span className="vi-IntegrationPage__StatLabel">Connected</span>
//                        {/* <Badge className="vi-IntegrationPage__StatValue">{totalConnected ?? 0}</Badge> */}
//                    </Flex>
//                    <Flex
//                        id="integration-page__total-integrations"
//                        className="vi-IntegrationPage__Stat"
//                        align="center"
//                        gap="1"
//                    >
//                        <span className="vi-IntegrationPage__StatLabel">Total</span>
//                        {/* <Badge className="vi-IntegrationPage__StatValue">{totalCount}</Badge> */}
//                    </Flex>
//                </Flex>
//            </Flex>