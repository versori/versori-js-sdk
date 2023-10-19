import { useState, useEffect } from 'react';
import { integrations, integrationsStaging, switchboard, ORG_ID } from './sdk-setup-data';
import './reset.css';
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
    const [userId, setUserId] = useState<string>('');
    useEffect(() => {
        if (!userId) return;
        window.Versori.initHubs({
            userId: userId, // Currently logged in user
            orgId: ORG_ID, // Switchboard organiaation id
            hubsBaseUrl: import.meta.env.VITE_HUBS_BASE_URL,
            originUrl: import.meta.env.VITE_ORIGIN_URL, // Environment url passed in from desired config. Value is used to check the origin of the request when connecting with OAuth
            // onConnection: 'http://someclienturl.com/api', // Url to send connection data to, payload contains appId, appKey, hub and board
            onConnection: async (connection: any, connectionInfo: any) => {
                await window.Versori.createUser({
                    orgId: ORG_ID,
                    hubId: switchboard.staging.hubs.one,
                    boardId: switchboard.staging.boards.hubOneBoardOne,
                    userId: userId,
                    usersBaseUrl: import.meta.env.VITE_USERS_BASE_URL,
                    connection: {
                        connection: connection,
                        info: connectionInfo,
                    },
                });
            },
            onComplete: () => {
                // Optional onComplete callback. Callback only trigged when onConnection is a url
                // Customer does their thing here
                console.log('complete');
            },
            onError: (error: Error) => console.log(error.message, error.description), //onError triggered at any point when an error occurs that would prevent the connection from being made
        });
    }, [userId]);

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
    }, [userId]);

    const currentEnvIntegrations =
        import.meta.env.VITE_ENVIRONMENT === 'production' ? integrationsStaging : integrations;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                maxWidth: '1440px',
                justifyContent: 'center',
                gap: '20px',
            }}
        >
            <input
                type="text"
                placeholder="Who are you?"
                className="user-input"
                onBlur={(event) => setUserId(event.target.value)}
            />
            <div className="card-grid">
                {currentEnvIntegrations.map((integration) => (
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
