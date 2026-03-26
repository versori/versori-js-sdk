import { DEFAULT_SDK_AUTH_API_KEY_LOCATION, SdkAuth } from '../util';
import type { VersoriHttpClient } from './versoriHttpClient';

export function configureAuth(client: VersoriHttpClient, auth: SdkAuth) {
    switch (auth.type) {
        case 'api-key': {
            const location = auth.location ?? DEFAULT_SDK_AUTH_API_KEY_LOCATION;

            if (location.in !== 'header') {
                throw new Error(`Invalid API key location, "${location.in}", only "header" is supported`);
            }

            client.interceptors.request.use((req) => {
                const value = location.prefix ? `${location.prefix} ${auth.token}` : auth.token;

                req.headers.set(location.name, value);

                return req;
            });
            break;
        }
        case 'cookie':
            client.setConfig({
                ...client.getConfig(),
                credentials: 'include',
            });
            break;
    }
}
