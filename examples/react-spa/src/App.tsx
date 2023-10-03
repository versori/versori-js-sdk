import { IntegrationCard } from '@versori/sdk-react';
import './App.css';

function App() {
    return (
        <div
            style={{
                display: 'flex',
                maxWidth: '800px',
                justifyContent: 'center',
            }}
        >
            <IntegrationCard board={{ name: 'Google' } as any} connected onConnect={() => {}} onDisconnect={() => {}} />
            <IntegrationCard
                board={{ name: 'Office 365' } as any}
                connected={false}
                onConnect={() => {}}
                onDisconnect={() => {}}
            />
        </div>
    );
}

export default App;
