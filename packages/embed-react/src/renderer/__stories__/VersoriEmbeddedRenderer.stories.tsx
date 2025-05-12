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
                        token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImM0Yzk4Nzk5LThjNGMtNDBhZC1iN2U5LTcwMjFiZjNhMjkwYSJ9.eyJleHAiOjE3MzE2NTk2NjgsImlhdCI6MTcyOTAzMTY2OCwiaXNzIjoiaHR0cDovL2ludGVybmFsLmFjY291bnRzLnN2Yy5jbHVzdGVyLmxvY2FsIiwianRpIjoiMjgyNDgyNTQtODM1ZC00MjNlLWJhZjItNDEwZGNlNGRmZTQxIiwic3ViIjoidXNlcjowMjZjMDk0OC0xYTA4LTRhM2EtOGM2Mi1hMzJiNWRkZDI0ZGQifQ.O9Jm0z0AxYz2nY3WuhAkpCJ-i8wEmcYdnKlVd4EGtVaYTC_1a8yDeUIkAlT0ICbCcV7vQp_AoLds5-p2y-diZfu3ocxyRRyb_g9qJaN-CVxbAGEn9jNDan0o-95PqWPrpULqvVX4zRF7PW9pzDjLEiUnsxdrYzlE6xzz0c3kkNiu5-JzpZay1Trw7znStYKhDokzxCf7MGTxVpxU65UFYuZUyEWvU4XGsxT7rW3DCFA3qcFH1XUFsUpL_uRLzMo8dyab-1w165ndeV_P1Fh42Xr_vzJw2pit6lurlXlNuGr6NfGomfNoh_oRK7cvtJEvXMDdRIOQLQ_XquzzQ_H4Xg',
                    },
                    orgId: '01J9SFXXT3Y44JY0HGYCR3YXGH',
                    primaryCredential: {
                        type: 'auto',
                        generate: async () => ({ name: '', type: 'string', data: { value: 'secret-primary' } }),
                    },
                    sdkOptions: {
                        baseUrl: 'http://localhost:8900/embedded/v1',
                    },
                    clientOptions: {
                        oauth2CallbackOrigin: 'http://localhost:3000',
                    },
                }}
            >
                <Story />
            </VersoriEmbeddedProvider>
        ),
    ],
};
