import { VersoriEmbeddedProvider, VersoriEmbeddedRenderer } from '@versori/embed-react';
import { ReactNode, useState } from 'react';
import { ExternalIdForm } from './ExternalIdForm.tsx';
import { useEndUserToken } from './useEndUserToken.ts';
import { useGenerateAppCredential } from './useGenerateAppCredential.ts';

function App() {
    const [externalId, setExternalId] = useState('');

    const { isLoading, error, token } = useEndUserToken(externalId, import.meta.env.VITE_END_USER_AUTH_PRIVATE_KEY);
    const generateToken = useGenerateAppCredential(externalId);

    let content: ReactNode;
    if (error) {
        content = <p>An error occurred: {error.message}</p>;
    } else if (!isLoading) {
        content = (
            <VersoriEmbeddedProvider
                options={{
                    orgId: import.meta.env.VITE_ORG_ID,
                    endUserAuth: import.meta.env.VITE_END_USER_AUTH_TYPE_API_KEY ? {
                        type: 'api-key',
                        token: import.meta.env.VITE_END_USER_AUTH_TYPE_API_KEY,
                        userId: externalId,
                    } : {
                        type: 'jwt',
                        token,
                    },
                    primaryCredential: {
                        type: 'auto',
                        generate: generateToken,
                    },
                }}
            >
                <VersoriEmbeddedRenderer />
            </VersoriEmbeddedProvider>
        );
    }

    return (
        <>
            <ExternalIdForm onSubmit={setExternalId} />
            {!externalId && <p>Provide a user ID to get started</p>}
            {content}
        </>
    );
}

export default App;
