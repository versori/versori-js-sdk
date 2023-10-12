// import type { Connection } from '@versori/sdk';
import '@versori/sdk/dist';
import '@versori/sdk/dist/style.css';
import { useEffect } from 'react';
import './reset.css';

// Values hardcoded for now

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
    },
};

type Integration = {
    title: string;
    hubId: string;
    boardId: string;
};

const integrations: Integration[] = [
    {
        title: 'Hub Two - Spotify',
        hubId: switchboard.hubs.two,
        boardId: switchboard.boards.hubTwoBoardOne,
    },
    {
        title: 'Hub One - Spot',
        hubId: switchboard.hubs.one,
        boardId: switchboard.boards.hubOneBoardTwo,
    },
    {
        title: 'Hub One - Square',
        hubId: switchboard.hubs.one,
        boardId: switchboard.boards.hubOneBoardOne,
    },
    {
        title: 'Hub One - Square API',
        hubId: switchboard.hubs.one,
        boardId: switchboard.boards.hubOneBoardThree,
    },
];

const ORG_ID = '01HARWP7QHM05CGDKH7W4AD9NM';
const USER_ID = 'Izabel';

function App() {
    useEffect(() => {
        window.Versori.initHubs({
            userId: USER_ID,
            orgId: ORG_ID,
            originUrl: import.meta.env.VITE_ORIGIN_URL, // environment url
            onConnection: 'http://someclienturl.com/api',
            // onSuccess: async (connection: any, connectionKey: string) => {
            //     console.log(connection, connectionKey, currentIntegration);
            //     // Customer does their thing then calls createUser
            //     // await window.Versori.users.createUser(
            //     //     ORG_ID,
            //     //     currentIntegration?.hubId,
            //     //     currentIntegration?.boardId,
            //     //     USER_ID,
            //     //     {
            //     //         id: USER_ID,
            //     //         environments: [
            //     //             {
            //     //                 key: connectionKey,
            //     //                 credentialId: connection.credentialId,
            //     //                 connectionId: connection.connectionId,
            //     //             },
            //     //         ],
            //     //     }
            //     // );
            // },
            onError: (error: string) => console.log(error),
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
                maxWidth: '800px',
                justifyContent: 'center',
                gap: '20px',
            }}
        >
            {integrations.map((integration) => (
                <div className="card" key={integration.title}>
                    <h2 className="card-title">{integration.title}</h2>
                    <button
                        className="card-button"
                        data-vhubs
                        data-vhubid={integration.hubId}
                        data-vhubboardid={integration.boardId}
                    ></button>
                </div>
            ))}
        </div>
    );
}

export default App;
