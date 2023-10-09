import createClient from 'openapi-fetch';
import { paths } from '../generated/switchboard.ts';
import { Hubs } from './hubs/Hubs.ts';
import { RawClient } from './types.ts';

// ClientOptions is a type that is used to configure the client
export type HubsClientOptions = Parameters<typeof createClient>[0] & {
    baseUrl: string;
};

export class HubsClient {
    private readonly client: RawClient;

    #hubs?: Hubs;

    constructor(opts: HubsClientOptions) {
        this.client = createClient<paths>(opts);
    }

    get hubs(): Hubs {
        if (!this.#hubs) {
            this.#hubs = new Hubs(this.client);
        }

        return this.#hubs;
    }
}
