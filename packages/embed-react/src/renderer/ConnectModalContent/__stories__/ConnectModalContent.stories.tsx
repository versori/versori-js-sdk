import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PlatformClient } from '@versori/embed';
import { embeddedApi } from '@versori/sdk/embedded';
import { DEFAULTS, VersoriEmbeddedContext } from '../../../provider';
import { ConnectModalContent } from '../ConnectModalContent';

const meta = {
    title: 'Renderer/ConnectModalContent',
    component: ConnectModalContent,
    args: {
        onCancel: fn(),
        onComplete: fn(),
    },
    decorators: [
        (Story) => (
            <VersoriEmbeddedContext.Provider
                value={{
                    client: new PlatformClient(embeddedApi.client, 'orgId', 'userId', { type: 'manual' }),
                    defaults: DEFAULTS,
                }}
            >
                <Story />
            </VersoriEmbeddedContext.Provider>
        ),
    ],
} satisfies Meta<typeof ConnectModalContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        projectId: '123',
    },
};
