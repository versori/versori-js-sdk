import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { setLocale } from 'yup';
import { ConnectSingleTemplate } from '../ConnectSingleTemplate';
import { basicAuthTemplate, primaryTemplate, shopifyTemplate } from './testdata';

const meta = {
    title: 'Connect/ConnectSingleTemplate',
    component: ConnectSingleTemplate,
    args: {
        onCancel: fn(),
        onConnect: fn(),
    },
    decorators: [
        (Story) => {
            // this is configured in VersoriEmbeddedProvider but setting it here for the sake of the
            // story.
            setLocale({
                mixed: {
                    required: 'Field is required',
                },
            });

            return <Story />;
        },
    ],
} satisfies Meta<typeof ConnectSingleTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const APIKey: Story = {
    name: 'API Key',
    args: {
        userId: 'dan',
        orgId: '1234',
        project: {
            id: '1234',
            name: 'Shopify',
            currentFiles: {
                files: [],
                labels: {}
            },
            createdAt: new Date().toISOString(),
            // imageUrl: 'https://via.placeholder.com/100x150',
            environments: [
                {
                    id: '1234',
                    name: 'production',
                    status: 'running',
                    publicUrl: 'https://example.com',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            ]
        },
        connectionTemplates: [],
        template: shopifyTemplate,
    },
};

export const BasicAuth: Story = {
    name: 'Basic Auth',
    args: {
        userId: 'dan',
        orgId: '1234',
        project: {
            id: '1234',
            name: 'Basic Auth',
            currentFiles: {
                files: [],
                labels: {}
            },
            createdAt: new Date().toISOString(),
            environments: [
                {
                    id: '1234',
                    name: 'production',
                    status: 'running',
                    publicUrl: 'https://example.com',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            ]
        },
        connectionTemplates: [],
        template: basicAuthTemplate,
    },
};
