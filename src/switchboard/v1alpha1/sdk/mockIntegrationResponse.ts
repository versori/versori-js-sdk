export const mock = {
    connections: [
        // integrations
        {
            authConfig: {
                authType: 'apikey',
                connectionId: 'reallylongconnectionid',
                data: { in: 'header', name: 'Authorization' },
            },
            id: '01HCD7D96SGEAB73BQP4J42WKJ',
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
