import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PlatformClient } from '@versori/embed';
import { DEFAULTS, VersoriEmbeddedContext } from '../../../provider';
import { IntegrationPage } from '../IntegrationPage';
import { platformApi } from '@versori/sdk/platform';

const meta = {
    title: 'IntegrationPage',
    component: IntegrationPage,
    args: {
        onConnectClick: fn(),
        onManageClick: fn(),
        onDisconnectClick: fn(),
    },
    decorators: [
        (Story) => (
            <VersoriEmbeddedContext.Provider
                value={{
                    client: new PlatformClient(platformApi.client, 'orgId', 'userId', { type: 'manual' }),
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
        projects: [
            {
                id: '123',
                name: 'Integrate Dis',
                isActivated: false,
                createdAt: '2023-10-01T00:00:00Z',
                environments: [
                    {
                        id: 'env1',
                        name: 'production',
                        status: 'running',
                        createdAt: '2023-10-01T00:00:00Z',
                        updatedAt: '2023-10-01T00:00:00Z',
                        publicUrl: 'https://example.com',
                    }
                ]
            },
            {
                id: '456',
                name: 'Integrate Dis',
                isActivated: false,
                createdAt: '2023-10-01T00:00:00Z',
                environments: [
                    {
                        id: 'env2',
                        name: 'production',
                        status: 'running',
                        createdAt: '2023-10-01T00:00:00Z',
                        updatedAt: '2023-10-01T00:00:00Z',
                        publicUrl: 'https://example.com',
                    }
                ]
            },
            {
                id: '789',
                name: 'Integrate Dis',
                isActivated: true,
                createdAt: '2023-10-01T00:00:00Z',
                environments: [
                    {
                        id: 'env3',
                        name: 'production',
                        status: 'running',
                        createdAt: '2023-10-01T00:00:00Z',
                        updatedAt: '2023-10-01T00:00:00Z',
                        publicUrl: 'https://example.com',
                    }
                ]
            },
            {
                id: '321',
                name: 'Integrate Dis',
                isActivated: false,
                createdAt: '2023-10-01T00:00:00Z',
                environments: [
                    {
                        id: 'env4',
                        name: 'production',
                        status: 'running',
                        createdAt: '2023-10-01T00:00:00Z',
                        updatedAt: '2023-10-01T00:00:00Z',
                        publicUrl: 'https://example.com',
                    }
                ]
            },
            {
                id: '654',
                name: 'Integrate Dis',
                isActivated: false,
                createdAt: '2023-10-01T00:00:00Z',
                environments: [
                    {
                        id: 'env5',
                        name: 'production',
                        status: 'running',
                        createdAt: '2023-10-01T00:00:00Z',
                        updatedAt: '2023-10-01T00:00:00Z',
                        publicUrl: 'https://example.com',
                    }
                ]
            },
        ],
    },
};
