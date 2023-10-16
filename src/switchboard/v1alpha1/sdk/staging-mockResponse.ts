const switchboard = {
    hubs: {
        one: '01HCW15T4HS63AH9Y2A83EH8HZ',
    },
    boards: {
        hubOneBoardOne: '01HCW15XJH7HE4YRFWTHJEQWV3',
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
    '01HCW15T4HS63AH9Y2A83EH8HZ': {
        '01HCW15XJH7HE4YRFWTHJEQWV3': [
            {
                authConfig: {
                    authType: 'apikey',
                    connectionId: 'Square ApiKey',
                    data: { in: 'header', name: 'Authorization' },
                },
                id: '01HCW12E1GSYGAXXHRHTKC0M2Q',
                name: 'Square',
                requiresUserAuth: true,
            },
        ],
    },
};
