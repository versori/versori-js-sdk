import { HubConnectionTemplate } from '@versori/sdk/embedded';

export const primaryTemplate: HubConnectionTemplate = {
    id: 'primary-template-1234',
    name: 'Default',
    connectorId: '1234',
    imageUrl: 'https://via.placeholder.com/100x150',
    isUsed: true,
    isPrimary: true,
    authSchemeConfig: {
        id: 'primary-asc-1234',
        schemeType: 'basic-auth',
        description: 'Basic Auth',
    },
};

export const shopifyTemplate: HubConnectionTemplate = {
    id: 'shopify-template-1234',
    name: 'Default',
    connectorId: '1234',
    imageUrl: 'https://via.placeholder.com/100x150',
    isUsed: true,
    isPrimary: false,
    authSchemeConfig: {
        id: 'shopify-asc-1234',
        schemeType: 'api-key',
        name: 'x-shopify-access-token',
        in: 'header',
        description: 'API Key',
    },
};

export const basicAuthTemplate: HubConnectionTemplate = {
    id: 'basic-auth-template-1234',
    name: 'Default',
    connectorId: '1234',
    imageUrl: 'https://via.placeholder.com/100x150',
    isUsed: true,
    isPrimary: false,
    authSchemeConfig: {
        id: 'basic-auth-asc-1234',
        schemeType: 'basic-auth',
        description: 'Basic Auth',
    },
};
