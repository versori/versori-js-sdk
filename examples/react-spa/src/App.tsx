import { VersoriEmbeddedProvider, VersoriEmbeddedRenderer } from '@versori/embed-react';
import { ReactNode } from 'react';
import { useEndUserToken } from './useEndUserToken.ts';
import { useGenerateAppCredential } from './useGenerateAppCredential.ts';

function App() {
    const { error, token, externalId } = useEndUserToken();
    const generateToken = useGenerateAppCredential(externalId);

    let content: ReactNode;
    if (error) {
        content = <p>An error occurred: {error.message}</p>;
    } else if (token) {
        content = (
            <VersoriEmbeddedProvider
                options={{
                    orgId: import.meta.env.VITE_ORG_ID,
                    endUserAuth: {
                        type: 'jwt',
                        token,
                    },
                    primaryCredential: {
                        type: 'auto',
                        generate: generateToken,
                    },
                }}
            >
                <div>Hello user {externalId}! With token {token}</div>
                <VersoriEmbeddedRenderer />
            </VersoriEmbeddedProvider>
        );
    }

    return (
        <>
            {content}
        </>
    );
}

export default App;
