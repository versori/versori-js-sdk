import { Board } from '../switchboard/v1alpha1';
import { ConnectButton } from './ConnectButton.tsx';

export type IntegrationCardProps = {
    board: Board;
    connected: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
};

export function IntegrationCard({ board, connected, onConnect, onDisconnect }: IntegrationCardProps) {
    return (
        <div style={{ margin: '1rem', backgroundColor: '#f8f8f8', color: 'black', padding: '1rem', width: 200 }}>
            <h3>{board.name}</h3>
            <ConnectButton connected={connected} onClick={connected ? onDisconnect : onConnect} />
        </div>
    );
}
