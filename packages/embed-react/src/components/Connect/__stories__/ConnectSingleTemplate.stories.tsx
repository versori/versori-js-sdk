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
        integration: {
            id: '1234',
            name: 'Shopify',
            description: 'Connect your Shopify store to Versori',
            imageUrl: 'https://via.placeholder.com/100x150',
            isActivated: false,
            isDeployed: true,
            connectionTemplates: [primaryTemplate, shopifyTemplate],
        },
        template: shopifyTemplate,
    },
};

export const BasicAuth: Story = {
    name: 'Basic Auth',
    args: {
        userId: 'dan',
        integration: {
            id: '1234',
            name: 'Shopify',
            description: 'Connect your Shopify store to Versori',
            imageUrl: 'https://via.placeholder.com/100x150',
            isActivated: false,
            isDeployed: true,
            connectionTemplates: [primaryTemplate, basicAuthTemplate],
        },
        template: basicAuthTemplate,
    },
};
