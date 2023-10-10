import { ApiError } from '../../common/index.ts';
import { User } from '../../schemas/index.ts';
import { RawClient } from '../types.ts';

export class Users {
    private readonly client: RawClient;

    constructor(client: RawClient) {
        this.client = client;
    }

    async getUser(organisationId: string, hubId: string, boardId: string, userId: string): Promise<User> {
        const { data, error, response } = await this.client.GET(
            '/organisations/{orgId}/hubs/{hubId}/boards/{boardId}/users/{userId}',
            {
                params: {
                    path: {
                        organisationId,
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
}
