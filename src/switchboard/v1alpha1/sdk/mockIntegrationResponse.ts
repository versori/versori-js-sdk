const switchboard = {
    hubs: {
        one: '01HARZ9Z72NGZMY0T9613VGJEV',
        two: '01HC08JFRV9QJBBTA3PP5G82FX',
    },
    boards: {
        hubOneBoardOne: '01HASBT94R4JZQMVPT85S82KN2',
        hubOneBoardTwo: '01HASBHKXE00A2ERKC9J4960KY',
        hubOneBoardThree: '01HCD7BMSPVVYRXDGK9963PVP6',
        hubTwoBoardOne: '01HC08JH1HQSS7BEH57PH3Z47J',
        hubTwoBoardTwo: '01HCJA8M0ZX607SP17MMYT9NPB',
    },
};

type Mock = {
    [key: string]: {
        [key: string]: {
            authConfig: {
                authType: string;
                connectionId: string;
                data: { flowType?: string; in?: string; name?: string };
            };
            id: string;
            name: string;
            requiresUserAuth: boolean;
        }[];
    };
};

export const mock: Mock = {
    '01HARZ9Z72NGZMY0T9613VGJEV': {
        '01HASBT94R4JZQMVPT85S82KN2': [
            {
                authConfig: {
                    authType: 'httpbasicauth',
                    connectionId: 'Square Basic',
                    data: { in: 'header', name: 'Authorization' },
                },
                id: '01HCCSBSZS2D2345XGNW5VDP9F',
                name: 'Square',
                requiresUserAuth: true,
            },
        ],
        '01HASBHKXE00A2ERKC9J4960KY': [
            {
                authConfig: {
                    authType: 'oauth2',
                    connectionId: 'Popeye',
                    data: { in: 'header', name: 'Authorization' },
                },
                id: '01HCCB8QEY81BJ8MXYZWTN7MD7',
                name: 'Spot',
                requiresUserAuth: true,
            },
        ],
        '01HCD7BMSPVVYRXDGK9963PVP6': [
            {
                authConfig: {
                    authType: 'apikey',
                    connectionId: 'Square APIKEY',
                    data: { in: 'header', name: 'Authorization' },
                },
                id: '01HCD7D96SGEAB73BQP4J42WKJ',
                name: 'Square API',
                requiresUserAuth: true,
            },
        ],
    },
    '01HC08JFRV9QJBBTA3PP5G82FX': {
        '01HC08JH1HQSS7BEH57PH3Z47J': [
            {
                authConfig: {
                    authType: 'oauth2',
                    connectionId: 'Spotify oAuth',
                    data: { in: 'header', name: 'Authorization' },
                },
                id: '01HCCCZ80JH265836KJA9XBAQG',
                name: 'Spotify',
                requiresUserAuth: true,
            },
        ],
        '01HCJA8M0ZX607SP17MMYT9NPB': [
            {
                authConfig: {
                    authType: 'oauth2',
                    connectionId: 'Square Creds',
                    data: { flowType: 'clientCredentials' },
                },
                id: '01HCJA6XBKYZKYPNDRG6M7BQWX',
                name: 'Square Creds',
                requiresUserAuth: true,
            },
        ],
    },
};
