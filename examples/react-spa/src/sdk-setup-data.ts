export const ORG_ID = '01HD1F83E9TGNE6DB8GNHKY1ZP';
export const USER_ID = 'andy';

export const switchboard = {
    development: {
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
    },
    staging: {
        hubs: {
            one: '01HD1FGS161K6308NGW3YH96J6',
        },
        boards: {
            hubOneBoardOne: '01HD1FGVPED3SX4PD8YGAG072B',
        },
    },
};

type Integration = {
    title: string;
    hubId: string;
    boardId: string;
};

export const integrations: Integration[] = [
    {
        title: 'Hub Two - Spotify',
        hubId: switchboard.development.hubs.two,
        boardId: switchboard.development.boards.hubTwoBoardOne,
    },
    {
        title: 'Hub One - Spot',
        hubId: switchboard.development.hubs.one,
        boardId: switchboard.development.boards.hubOneBoardTwo,
    },
    {
        title: 'Hub One - Square',
        hubId: switchboard.development.hubs.one,
        boardId: switchboard.development.boards.hubOneBoardOne,
    },
    {
        title: 'Hub One - Square API',
        hubId: switchboard.development.hubs.one,
        boardId: switchboard.development.boards.hubOneBoardThree,
    },
    {
        title: 'Hub Two - Square Creds',
        hubId: switchboard.development.hubs.two,
        boardId: switchboard.development.boards.hubTwoBoardTwo,
    },
];

export const integrationsStaging: Integration[] = [
    {
        title: 'Spotify',
        hubId: switchboard.staging.hubs.one,
        boardId: switchboard.staging.boards.hubOneBoardOne,
    },
];
