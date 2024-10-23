import { createClient, createConfig } from '@hey-api/client-fetch';
import { configureEmbeddedSdk, embeddedApi } from '@versori/sdk/embedded';
import { EmbedClient } from './EmbedClient';
import { parseEndUserAuth } from './internal/parseEndUserAuth';
import { parseJwtSub } from './internal/parseJwtSub';
import { InitOptions } from './types';

export async function initEmbedded(opts: InitOptions): Promise<EmbedClient> {
    const { endUserAuth, sdkOptions = {} } = opts;

    let client = embeddedApi.client;
    if (opts.overrideClient) {
        // opts.overrideClient is truthy, so if it's a boolean then we create a new client, otherwise the value
        // must be a client instance.
        client = typeof opts.overrideClient === 'boolean' ? createClient(createConfig()) : opts.overrideClient;
    }

    configureEmbeddedSdk(
        {
            ...sdkOptions,
            auth: parseEndUserAuth(endUserAuth),
        },
        client
    );

    const userId = endUserAuth.type === 'api-key' ? endUserAuth.userId : parseJwtSub(endUserAuth.token);

    const embedClient = new EmbedClient(embeddedApi.client, opts.hubId, userId, opts.primaryCredential, opts.clientOptions);

    await embedClient.tryGetEndUser();

    return embedClient;
}
