import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { type Connection } from '@versori/sdk/dist/switchboard/v1alpha1/schemas';
import { integrations, integrationsStaging, ORG_ID } from './sdk-setup-data';
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

type ConnectionInfo = {
    appId?: string;
    appKey?: string;
    hubId: string;
    boardId: string;
};

function App() {
    const [userId, setUserId] = useState<string>('');

    useEffect(() => {
        if (!userId) return;
        window.Versori.initHubs({
            userId: userId,
            orgId: ORG_ID,
            apiKey: import.meta.env.VITE_API_KEY,
            basePaths: {
                hubs: 'https://platform-staging.versori.com/api/switchboard/v1alpha1/',
                users: 'https://platform-staging.versori.com/apis/hubs-sdk/v1/',
                origin: 'https://switchboard-staging.versori.com',
            },
            // finaliseTo: 'http://someclienturl.com/api',
            onConnected: async (connection: Connection, connectionInfo: ConnectionInfo) => {
                const user = await window.Versori.connectUser({
                    orgId: ORG_ID,
                    hubId: connectionInfo.hubId,
                    boardId: connectionInfo.boardId,
                    userId: userId,
                    connection: {
                        connection: connection,
                        info: connectionInfo,
                    },
                });
                if (user.id === userId) {
                    addConnectedAttr(connectionInfo.hubId, connectionInfo.boardId);
                    toast('Integration connected');
                }
            },
            onDisconnected: async (connectionInfo: Pick<ConnectionInfo, 'hubId' | 'boardId'>) => {
                const user = await window.Versori.disconnectUser({
                    orgId: ORG_ID,
                    hubId: connectionInfo.hubId,
                    boardId: connectionInfo.boardId,
                    userId: userId,
                });
                if (user.id === userId) {
                    removeConnectedAttr(connectionInfo.hubId, connectionInfo.boardId);
                    toast('Integration disconnected');
                }
            },
            onCompleted: () => {
                console.log('complete');
            },
            onError: (error: Error) => {
                console.log(error.message, error.description);
                toast.error(error.message);
            },
            onInitialised: () => {
                changeAllButtonText();
            },
        });
    }, [userId]);

    const changeAllButtonText = () => {
        const buttons = document.querySelectorAll('.card-button');
        buttons.forEach((button) => {
            const parent = button.parentElement;
            if (button.hasAttribute('data-connected')) {
                parent?.classList.add('connected');
                button.innerHTML = 'Disconnect';
            } else {
                parent?.classList.remove('connected');
                button.innerHTML = 'Connect';
            }
        });
    };

    const addConnectedAttr = (hubId: string, boardId: string) => {
        const button = document.querySelector(`[data-vhubid="${hubId}"][data-vhubboardid="${boardId}"]`)!;
        const parent = button?.parentElement;
        parent?.classList.add('connected');
        button.setAttribute('data-connected', 'true');
        button.innerHTML = 'Disconnect';
    };

    const removeConnectedAttr = (hubId: string, boardId: string) => {
        const button = document.querySelector(`[data-vhubid="${hubId}"][data-vhubboardid="${boardId}"]`)!;
        const parent = button?.parentElement;
        parent?.classList.remove('connected');
        button.removeAttribute('data-connected');
        button.innerHTML = 'Connect';
    };

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
                placeholder="Hi, who are you?"
                className="user-input"
                onBlur={(event) => setUserId(event.target.value)}
            />
            <div className="card-grid">
                {currentEnvIntegrations.map((integration) => (
                    <div className="card" key={integration.title}>
                        <div className="card-connection"></div>
                        <h4 className="card-title">{integration.title}</h4>
                        <button
                            className="card-button"
                            data-vhubs
                            data-vhubid={integration.hubId}
                            data-vhubboardid={integration.boardId}
                            disabled={!userId}
                        >
                            Connect
                        </button>
                    </div>
                ))}
            </div>
            <Toaster />
        </div>
    );
}

export default App;
