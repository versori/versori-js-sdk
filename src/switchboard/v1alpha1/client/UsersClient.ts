import createClient from 'openapi-fetch';
import { paths } from '../generated/users.ts';
import { Users } from './users/Users.ts';
import { RawClient } from './types.ts';

// ClientOptions is a type that is used to configure the client
export type UsersClientOptions = Parameters<typeof createClient>[0] & {
    baseUrl: string;
};

export class UsersClient {
    private readonly client: RawClient;

    #users?: Users;

    constructor(opts: UsersClientOptions) {
        this.client = createClient<paths>(opts);
    }

    get users(): Users {
        if (!this.#users) {
            this.#users = new Users(this.client);
        }

        return this.#users;
    }
}
