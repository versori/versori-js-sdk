import createClient from 'openapi-fetch';
import { paths } from '../generated/api.ts';
import { Hubs } from './hubs/Hubs.ts';
import { RawClient } from './types.ts';

// ClientOptions is a type that is used to configure the client
export type ClientOptions = Parameters<typeof createClient>[0] & {
    baseUrl: string;
};

export class Client {

    private readonly client: RawClient;

    #hubs?: Hubs;

    constructor(opts: ClientOptions) {
        this.client = createClient<paths>(opts)
    }

    get hubs(): Hubs {
        if (!this.#hubs) {
            this.#hubs = new Hubs(this.client);
        }

        return this.#hubs;
    }
}
