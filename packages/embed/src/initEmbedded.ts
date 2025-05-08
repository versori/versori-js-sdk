import { createClient, createConfig } from '@hey-api/client-fetch';
import { parseEndUserAuth } from './internal/parseEndUserAuth';
import { parseJwtSub } from './internal/parseJwtSub';
import { InitOptions } from './types';
import { PlatformClient } from './PlatformClient';
import { platformApi, configurePlatformSdk } from '@versori/sdk/platform';

export async function initEmbedded(opts: InitOptions): Promise<PlatformClient> {
    const { endUserAuth, sdkOptions = {} } = opts;

    let client = platformApi.client;
    if (opts.overrideClient) {
        // opts.overrideClient is truthy, so if it's a boolean then we create a new client, otherwise the value
        // must be a client instance.
        client = typeof opts.overrideClient === 'boolean' ? createClient(createConfig()) : opts.overrideClient;
    }

    configurePlatformSdk(
        {
            ...sdkOptions,
            auth: parseEndUserAuth(endUserAuth),
        },
        client
    );

    const userId = endUserAuth.type === 'api-key' ? endUserAuth.userId : parseJwtSub(endUserAuth.token);

    const platformClient = new PlatformClient(platformApi.client, opts.orgId, userId, opts.primaryCredential, opts.clientOptions);

    await platformClient.tryGetEndUser();

    return platformClient;
}
