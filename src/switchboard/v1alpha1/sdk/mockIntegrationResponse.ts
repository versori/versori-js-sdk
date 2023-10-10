export const mock = {
    connections: [
        // integrations
        {
            authConfig: {
                authType: 'oauth2',
                connectionId: 'reallylongconnectionid',
                data: { in: 'header', name: 'Authorization' },
            },
            id: '01HCCB8QEY81BJ8MXYZWTN7MD7',
            name: 'Spotify',
            requiresUserAuth: true,
        },
        {
            authConfig: {
                authType: 'apikey',
                connectionId: 'ghfh',
                data: { in: 'header', name: 'X-Shopify-Access-Token' },
            },
            id: '01HBDWAWX2SXZTBYN94SA8ZW73',
            listenerUrl: 'https://s14r825t.sb-cvspobmh7bhw-cvspobmt76x1.switchboard.versori.io',
            name: 'Versori Shopify',
        },
        {
            authConfig: {
                authType: 'apikey',
                connectionId: 'ghfh',
                data: { in: 'header', name: 'X-Shopify-Access-Token' },
            },
            id: '01HBDWAWX2SXZTBYN94SA8ZW73',
            listenerUrl: 'https://s14r825t.sb-cvspobmh7bhw-cvspobmt76x1.switchboard.versori.io',
            name: 'Versori Shopify',
        },
    ],
};
