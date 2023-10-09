import { VersoriSDK } from '@versori/sdk';
import type { Connection } from '@versori/sdk';
import '@versori/sdk/dist/style.css';
// import { IntegrationCard } from '@versori/sdk-react';
import { useEffect } from 'react';
import './reset.css';

// Values hardcoded for now
function App() {
    useEffect(() => {
        const ORG_ID = '01HARWP7QHM05CGDKH7W4AD9NM';
        VersoriSDK.initHubs({
            userId: 'switchboard-demo',
            orgId: ORG_ID,
            onSuccess: (connection: Connection) => console.log(connection),
            onError: () => () => console.log('error'),
        });
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
            <div className="card">
                <h2 className="card-title">Google Calendar</h2>
                <button
                    className="card-button"
                    data-vhubid="01HARZ9Z72NGZMY0T9613VGJEV"
                    data-vhubsboardid="01HASBHKXE00A2ERKC9J4960KY"
                >
                    Connect
                </button>
            </div>
            <div className="card">
                <h2 className="card-title">Spotify</h2>
                <button
                    className="card-button"
                    data-vhubid="01HARZ9Z72NGZMY0T9613VGJEV"
                    data-vhubsboardid="01HASBT94R4JZQMVPT85S82KN2"
                >
                    Connect
                </button>
            </div>
            <div className="card">
                <h2 className="card-title">Apple</h2>
                <button
                    className="card-button"
                    data-vhubid="01HARZ9Z72NGZMY0T9613VGJEV"
                    data-vhubsboardid="01HASBT94R4JZQMVPT85S82KN2"
                >
                    Connect
                </button>
            </div>
            {/* <IntegrationCard
                board={{ name: 'Google' } as any}
                connected
                onConnect={() => handleConnection()}
                onDisconnect={() => {}}
            />
            <IntegrationCard
                board={{ name: 'Office 365' } as any}
                connected={false}
                onConnect={() => handleConnection()}
                onDisconnect={() => {}}
            /> */}
        </div>
    );
}

export default App;
