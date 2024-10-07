import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { EmbedClient } from '@versori/embed';
import { embeddedApi } from '@versori/sdk/embedded';
import { DEFAULTS, VersoriEmbeddedContext } from '../../../provider';
// import '../IntegrationTile.scss';
import { IntegrationTile } from '../IntegrationTile';

const meta = {
    title: 'IntegrationTile',
    component: IntegrationTile,
    args: { onConnectClick: fn(), onManageClick: fn(), onDisconnectClick: fn() },
    decorators: [
        (Story) => (
            <VersoriEmbeddedContext.Provider
                value={{
                    client: new EmbedClient(embeddedApi.client, 'hubId', 'userId'),
                    defaults: DEFAULTS,
                }}
            >
                <Story />
            </VersoriEmbeddedContext.Provider>
        ),
    ],
} satisfies Meta<typeof IntegrationTile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        integrationId: '123',
        name: 'Integrate Dis',
        description: 'Integrate Dis is a great integration',
        isActivated: false,
        isDeployed: true,
    },
};

export const Connected: Story = {
    args: {
        integrationId: '123',
        name: 'Integrate Dis',
        description: 'Integrate Dis is a great integration',
        isActivated: true,
        isDeployed: true,
    },
};

export const ComingSoon: Story = {
    args: {
        integrationId: '123',
        name: 'Integrate Dis',
        description: 'Integrate Dis is a great integration',
        isActivated: false,
        isDeployed: false,
    },
};
