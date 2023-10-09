export const mock = {
    connections: [
        // integrations
        {
            authConfig: {
                authType: 'apikey',
                connectionId: 'reallylongconnectionid',
                data: { in: 'header', name: 'Authorization' },
            },
            id: '01HC07MB2BJ7BWEPJ0W576JN2R',
            name: 'Gigpig',
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
