import { ConnectionTemplate } from '@versori/sdk/platform';

export const primaryTemplate: ConnectionTemplate = {
    id: 'primary-template-1234',
    name: 'Default',
    connectionTemplateId: '1234',
    // imageUrl: 'https://via.placeholder.com/100x150',
    dynamic: true,
    domain: 'https://example.com',
    templateBaseUrl: 'https://example.com',
    authSchemeConfigs: [
        {
            type: 'basic-auth',
            basicAuth: {
                id: 'basic-auth-123',
                description: 'Basic Auth',
            },
        },
    ],
};

export const shopifyTemplate: ConnectionTemplate = {
    id: 'shopify-template-1234',
    name: 'Default',
    connectionTemplateId: '1234',
    dynamic: true,
    // imageUrl: 'https://via.placeholder.com/100x150',
    domain: 'https://example.com',
    templateBaseUrl: 'https://example.com',
    authSchemeConfigs: [
        {
            type: 'api-key',
            apiKey: {
                id: 'api-key-123',
                name: 'x-shopify-access-token',
                in: 'header',
                description: 'API Key',
            },
        },
    ],
};

export const basicAuthTemplate: ConnectionTemplate = {
    id: 'basic-auth-template-1234',
    name: 'Default',
    connectionTemplateId: '1234',
    dynamic: true,
    // imageUrl: 'https://via.placeholder.com/100x150',
    domain: 'https://example.com',
    templateBaseUrl: 'https://example.com',
    authSchemeConfigs: [
        {
            type: 'basic-auth',
            basicAuth: {
                id: 'basic-auth-123',
                description: 'Basic Auth',
            },
        },
    ],
};
