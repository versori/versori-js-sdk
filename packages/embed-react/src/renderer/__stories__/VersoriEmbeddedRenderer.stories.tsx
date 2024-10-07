import type { Meta, StoryObj } from '@storybook/react';
import { VersoriEmbeddedProvider } from '../../provider';
import { VersoriEmbeddedRenderer } from '../VersoriEmbeddedRenderer';

const meta = {
    title: 'Renderer/VersoriEmbeddedRenderer',
    component: VersoriEmbeddedRenderer,
    args: {},
} satisfies Meta<typeof VersoriEmbeddedRenderer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: 'Default',
    args: {},
    decorators: [
        (Story) => (
            <VersoriEmbeddedProvider
                options={{
                    endUserAuth: {
                        userId: 'dan',
                        type: 'api-key',
                        location: {
                            in: 'header',
                            name: 'X-Versori-Internal-Token',
                        },
                        token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImM0Yzk4Nzk5LThjNGMtNDBhZC1iN2U5LTcwMjFiZjNhMjkwYSJ9.eyJleHAiOjE3MzA2Njk1MjgsImlhdCI6MTcyODA0MTUyOCwiaXNzIjoiaHR0cDovL2ludGVybmFsLmFjY291bnRzLnN2Yy5jbHVzdGVyLmxvY2FsIiwianRpIjoiYzY2ZWEzNzMtNGU1NS00MmJhLThmZmItMzVjMzgwN2RlOTZlIiwic3ViIjoidXNlcjowMjZjMDk0OC0xYTA4LTRhM2EtOGM2Mi1hMzJiNWRkZDI0ZGQifQ.jaotWfjg1RbLW45llH9QwDKdYNf4--GEPAKRPv0c0Eyvh0SW8mv6MqtVdwMSNyi0MFLr9-IzwHiki63Hfg6g_56cop5EcBPxaFS58owdevEa4h-EyLFOtkjI2rqUCqsIE2oCeTgW0XcRhWTSPMeKnwtD-T2zS4_XUw4yZfKRRaDXgb_QGxL4uEYV1NiS3K6RkqlKIKH6PQotpRXgga6yqcQ9H6eEGFiVC-Km4FDhN48T-HqWLmlL40-lXK79WS9uVY8ExTGfg---PNpnfclUbfAvB1toE98vqtoyladzRa6RtQUzj5ExTpPz_h8HNSNz2rTNl-Ou7iCS8-pbPK7AdA',
                    },
                    hubId: '01J9BEH3KMRP7NXJXZP0E7J1MN',
                    primaryCredential: {
                        type: 'auto',
                        generate: async () => ({ name: '', type: 'string', data: { value: 'secret-primary' } }),
                    },
                    sdkOptions: {
                        baseUrl: 'http://localhost:8900/embedded/v1',
                    },
                }}
            >
                <Story />
            </VersoriEmbeddedProvider>
        ),
    ],
};
