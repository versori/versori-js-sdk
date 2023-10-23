import { ApiError } from '../../common/index.ts';
import { User } from '../../schemas/index.ts';
import { RawClient } from '../types.ts';

export class Users {
    private readonly client: RawClient;

    constructor(client: RawClient) {
        this.client = client;
    }

    async getUser(orgId: string, hubId: string, boardId: string, userId: string): Promise<User> {
        const { data, error, response } = await this.client.GET(
            '/organisations/{orgId}/hubs/{hubId}/boards/{boardId}/users/{userId}',
            {
                params: {
                    path: {
                        orgId,
                        hubId,
                        boardId,
                        userId,
                    },
                },
            }
        );

        if (error) {
            throw new ApiError(response, error);
        }

        return data;
    }

    async createUser(orgId: string, hubId: string, boardId: string, userId: string, body: any): Promise<User> {
        const { data, error, response } = await this.client.PUT(
            '/organisations/{orgId}/hubs/{hubId}/boards/{boardId}/users/{userId}',
            {
                params: {
                    path: {
                        orgId,
                        hubId,
                        boardId,
                        userId,
                    },
                },
                body,
            }
        );

        if (error) {
            throw new ApiError(response, error);
        }

        return data;
    }

    async createUserProxy(orgId: string, hubId: string, boardId: string, userId: string, body: any) {
        const res = await fetch(
            `https://hubsdemo-staging.versori.io/apis/hubs-sdk/v1/organisations/${orgId}/hubs/${hubId}/boards/${boardId}/users/${userId}`,
            {
                method: 'PUT',
                headers: {
                    origin: 'https://storage.googleapis.com/',
                },
                mode: 'cors',
                body: JSON.stringify(body),
            }
        );
        const data = await res.json();
        return data;
    }

    async deleteUser(orgId: string, hubId: string, boardId: string, userId: string): Promise<User> {
        const { data, error, response } = await this.client.DELETE(
            '/organisations/{orgId}/hubs/{hubId}/boards/{boardId}/users/{userId}',
            {
                params: {
                    path: {
                        orgId,
                        hubId,
                        boardId,
                        userId,
                    },
                },
            }
        );

        if (error) {
            throw new ApiError(response, error);
        }

        return data;
    }

    async deleteUserProxy(orgId: string, hubId: string, boardId: string, userId: string): Promise<User> {
        const res = await fetch(
            `https://hubsdemo-staging.versori.io/apis/hubs-sdk/v1/organisations/${orgId}/hubs/${hubId}/boards/${boardId}/users/${userId}`,
            {
                method: 'DELETE',
                headers: {
                    origin: 'https://storage.googleapis.com/',
                },
                mode: 'cors',
            }
        );
        const data = await res.json();
        return data;
    }
}
