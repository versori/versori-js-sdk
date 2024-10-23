import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { EmbedClient } from '@versori/embed';
import { DEFAULTS, VersoriEmbeddedContext } from '../../../provider';
import { IntegrationPage } from '../IntegrationPage';
import { embeddedApi } from '@versori/sdk/embedded';

const meta = {
    title: 'IntegrationPage',
    component: IntegrationPage,
    args: {
        onPreviousPage: fn(),
        onNextPage: fn(),
        onConnectClick: fn(),
        onManageClick: fn(),
        onDisconnectClick: fn(),
    },
    decorators: [
        (Story) => (
            <VersoriEmbeddedContext.Provider
                value={{
                    client: new EmbedClient(embeddedApi.client, 'hubId', 'userId', { type: 'manual' }),
                    defaults: DEFAULTS,
                }}
            >
                <Story />
            </VersoriEmbeddedContext.Provider>
        ),
    ],
} satisfies Meta<typeof IntegrationPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        hasNextPage: false,
        hasPreviousPage: false,
        integrations: [
            {
                id: '123',
                name: 'Integrate Dis',
                imageUrl: '',
                description: 'Integrate Dis is a great integration',
                isActivated: false,
                isDeployed: true,
            },
            {
                id: '456',
                name: 'Integrate Dis',
                imageUrl: 'https://via.placeholder.com/150x100',
                description: 'Integrate Dis is a great integration',
                isActivated: false,
                isDeployed: true,
            },
            {
                id: '789',
                name: 'Integrate Dis',
                imageUrl: 'https://via.placeholder.com/100x150',
                description: 'Integrate Dis is a great integration',
                isActivated: true,
                isDeployed: true,
            },
            {
                id: '321',
                name: 'Integrate Dis',
                imageUrl: '',
                description: 'Integrate Dis is a great integration',
                isActivated: false,
                isDeployed: true,
            },
            {
                id: '654',
                name: 'Integrate Dis',
                imageUrl: '',
                description: 'Integrate Dis is a great integration',
                isActivated: false,
                isDeployed: true,
            },
        ],
        totalCount: 5,
        totalConnected: 1,
    },
};
