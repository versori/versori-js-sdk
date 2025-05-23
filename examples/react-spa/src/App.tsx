import { Tabs } from '@radix-ui/themes';
import { VersoriEmbeddedProvider, VersoriEmbeddedRenderer } from '@versori/embed-react';
import { ReactNode } from 'react';
import { Custom } from "./custom/Custom.tsx";
import { useEndUserToken } from './useEndUserToken.ts';

function App() {
    const { error, token, externalId } = useEndUserToken();

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
                    }
                }}
            >
                <div>
                    Hello user: <em>{externalId}</em>!
                </div>
                <Tabs.Root defaultValue="renderer" orientation="horizontal">
                    <Tabs.List>
                        <Tabs.Trigger value="renderer">Renderer</Tabs.Trigger>
                        <Tabs.Trigger value="custom">Custom</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="renderer">
                        <VersoriEmbeddedRenderer />
                    </Tabs.Content>
                    <Tabs.Content value="custom">
                        <Custom />
                    </Tabs.Content>
                </Tabs.Root>
            </VersoriEmbeddedProvider>
        );
    }

    return <>{content}</>;
}

export default App;
