import { CSSProperties } from 'react';

export type ConnectButtonProps = {
    connected: boolean;
    onClick: () => void;
};

export function ConnectButton({ connected, onClick }: ConnectButtonProps) {
    const styles: CSSProperties = connected
        ? {
              backgroundColor: 'green',
              color: 'white',
              border: '1px solid white',
          }
        : {
              backgroundColor: 'white',
              color: 'black',
              border: '1px solid black',
          };

    return (
        <button style={styles} onClick={onClick}>
            {connected ? 'Disconnect' : 'Connect'}
        </button>
    );
}
