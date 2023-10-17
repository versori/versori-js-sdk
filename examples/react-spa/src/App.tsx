// import type { Connection } from '@versori/sdk';
// import '@versori/sdk/dist/index.mjs';
import '@versori/sdk/dist/style.css';
import { useEffect } from 'react';
import './reset.css';

// Values hardcoded for now

// const switchboard = {
//     hubs: {
//         one: '01HARZ9Z72NGZMY0T9613VGJEV',
//         two: '01HC08JFRV9QJBBTA3PP5G82FX',
//     },
//     boards: {
//         hubOneBoardOne: '01HASBT94R4JZQMVPT85S82KN2',
//         hubOneBoardTwo: '01HASBHKXE00A2ERKC9J4960KY',
//         hubOneBoardThree: '01HCD7BMSPVVYRXDGK9963PVP6',
//         hubTwoBoardOne: '01HC08JH1HQSS7BEH57PH3Z47J',
//         hubTwoBoardTwo: '01HCJA8M0ZX607SP17MMYT9NPB',
//     },
// };

const switchboardStaging = {
    hubs: {
        one: '01HCW15T4HS63AH9Y2A83EH8HZ',
    },
    boards: {
        hubOneBoardOne: '01HCW15XJH7HE4YRFWTHJEQWV3',
    },
};

type Integration = {
    title: string;
    hubId: string;
    boardId: string;
};

// const integrations: Integration[] = [
//     {
//         title: 'Hub Two - Spotify',
//         hubId: switchboard.hubs.two,
//         boardId: switchboard.boards.hubTwoBoardOne,
//     },
//     {
//         title: 'Hub One - Spot',
//         hubId: switchboard.hubs.one,
//         boardId: switchboard.boards.hubOneBoardTwo,
//     },
//     {
//         title: 'Hub One - Square',
//         hubId: switchboard.hubs.one,
//         boardId: switchboard.boards.hubOneBoardOne,
//     },
//     {
//         title: 'Hub One - Square API',
//         hubId: switchboard.hubs.one,
//         boardId: switchboard.boards.hubOneBoardThree,
//     },
//     {
//         title: 'Hub Two - Square Creds',
//         hubId: switchboard.hubs.two,
//         boardId: switchboard.boards.hubTwoBoardTwo,
//     },
// ];

const integrationsStaging: Integration[] = [
    {
        title: 'Square',
        hubId: switchboardStaging.hubs.one,
        boardId: switchboardStaging.boards.hubOneBoardOne,
    },
];

const ORG_ID = '01HCW119CAWJQRE7EQPVPMWA8H';
const USER_ID = 'andy';

declare global {
    interface Window {
        Versori: any;
    }
}

type Error = {
    message: string;
    description: any;
};

function App() {
    useEffect(() => {
        window.Versori.initHubs({
            userId: USER_ID, // Currently logged in user
            orgId: ORG_ID, // Switchboard organiaation id
            originUrl: import.meta.env.VITE_ORIGIN_URL, // Environment url passed in from desired config. Value is used to check the origin of the request when connectin with OAuth
            onConnection: 'http://someclienturl.com/api', // Url to send connection data to, payload contains appId, appKey, hub and board
            // onConnection: async (connection: any, connectionInfo: string) => {
            //     Optional callback to handle connection data independently. Useful for when extra side effects are needed
            //     Customer does their thing here
            //     console.log(connection, connectionInfo);
            // },
            onComplete: (connection: any) => {
                // Optional onComplete callback. Callback only trigged when onConnection is a url
                // Customer does their thing here
                console.log(connection);
            },
            onError: (error: Error) => console.log(error.message, error.description), //onError triggered at any point when an error occurs that would prevent the connection from being made
        });
    }, []);

    useEffect(() => {
        // Hack to change button text
        setTimeout(() => {
            const buttons = document.querySelectorAll('.card-button');
            buttons.forEach((button) => {
                if (button.hasAttribute('data-connected')) {
                    button.innerHTML = 'Connected';
                } else {
                    button.innerHTML = 'Connect';
                }
            });
        }, 500);
    });

    return (
        <div
            style={{
                display: 'flex',
                maxWidth: '1440px',
                justifyContent: 'center',
                gap: '20px',
            }}
        >
            <div className="card-grid">
                {integrationsStaging.map((integration) => (
                    <div className="card" key={integration.title}>
                        <h4 className="card-title">{integration.title}</h4>
                        <button
                            className="card-button"
                            data-vhubs
                            data-vhubid={integration.hubId}
                            data-vhubboardid={integration.boardId}
                        ></button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
