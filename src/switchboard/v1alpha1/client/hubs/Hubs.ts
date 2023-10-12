import { ApiError } from '../../common';
import { operations } from '../../generated/switchboard.ts';
import {
    Connection,
    // CreateConnectionRequestBody,
    InitConnectionResponseBody,
    // InitConnectionRequestBody,
    // Hub,
    HubsPage,
    ConnectionsPage,
    BoardVariablesSchema,
    ConnectIntegration,
    ConnectedAppsPage,
    BoardsPage,
    // CreateCredentialRequestBody,
} from '../../schemas';
import { RawClient } from '../types.ts';

export type ListHubsParams = operations['GetHubs']['parameters']['query'];
export type ListHubBoardsParams = operations['ListHubBoards']['parameters']['query'];
export type ListUserHubBoardsParams = operations['GetUserHubBoards']['parameters']['query'];
export type ListConnectionsParams = operations['GetConnections']['parameters']['query'];

export class Hubs {
    private readonly client: RawClient;

    constructor(client: RawClient) {
        this.client = client;
    }

    async initConnection(organisationId: string, body: any): Promise<InitConnectionResponseBody> {
        const { data, error, response } = await this.client.POST('/organisations/{organisationId}/connection-init', {
            params: {
                path: {
                    organisationId,
                },
            },
            body,
        });

        if (error) {
            throw new ApiError(response, error);
        }

        return data;
    }

    async createConnection(organisationId: string, body: any): Promise<Connection> {
        const { data, error, response } = await this.client.POST('/organisations/{organisationId}/connections', {
            params: {
                path: {
                    organisationId,
                },
            },
            body,
        });

        if (error) {
            throw new ApiError(response, error);
        }

        return data;
    }

    async createCredential(organisationId: string, body: any): Promise<Connection> {
        const { data, error, response } = await this.client.POST('/organisations/{organisationId}/credentials', {
            params: {
                path: {
                    organisationId,
                },
            },
            body,
        });

        if (error) {
            throw new ApiError(response, error);
        }

        return data;
    }

    async getConnections(organisationId: string, params: ListConnectionsParams): Promise<ConnectionsPage> {
        const { data, error, response } = await this.client.GET('/organisations/{organisationId}/connections', {
            params: {
                path: {
                    organisationId,
                },
                query: params,
            },
        });

        if (error) {
            throw new ApiError(response, error);
        }

        return data;
    }

    async listHubs(organisationId: string, params: ListHubsParams): Promise<HubsPage> {
        const { data, error, response } = await this.client.GET('/organisations/{organisationId}/hubs', {
            params: {
                path: {
                    organisationId,
                },
                query: params,
            },
        });

        if (error) {
            throw new ApiError(response, error);
        }

        return data;
    }

    async listHubBoards(organisationId: string, hubId: string, params: ListHubBoardsParams): Promise<BoardsPage> {
        const { data, error, response } = await this.client.GET('/organisations/{organisationId}/hubs/{hubId}/boards', {
            params: {
                path: {
                    organisationId,
                    hubId,
                },
                query: params,
            },
        });

        if (error) {
            throw new ApiError(response, error);
        }

        return data;
    }

    async getHubIntegrationInfo(organisationId: string, hubId: string, boardId: string): Promise<ConnectIntegration> {
        const { data, error, response } = await this.client.GET(
            '/organisations/{organisationId}/hubs/{hubId}/boards/{boardId}/integration-info',
            {
                params: {
                    path: {
                        organisationId,
                        hubId,
                        boardId,
                    },
                },
            }
        );

        if (error) {
            throw new ApiError(response, error);
        }

        return data;
    }

    async getConnectedApps(organisationId: string): Promise<ConnectedAppsPage> {
        const { data, error, response } = await this.client.GET('/organisations/{organisationId}/connected-apps', {
            params: {
                path: {
                    organisationId,
                },
            },
        });

        if (error) {
            throw new ApiError(response, error);
        }

        return data;
    }

    async getUsersHubBoards(
        organisationId: string,
        hubId: string,
        userId: string,
        params: ListUserHubBoardsParams
    ): Promise<BoardsPage> {
        const { data, error, response } = await this.client.GET(
            '/organisations/{organisationId}/hubs/{hubId}/users/{userId}',
            {
                params: {
                    path: {
                        organisationId,
                        hubId,
                        userId,
                    },
                    query: params,
                },
            }
        );

        if (error) {
            throw new ApiError(response, error);
        }

        return data;
    }

    async getBoardVariables(organisationId: string, boardId: string): Promise<BoardVariablesSchema> {
        const { data, error, response } = await this.client.GET(
            '/organisations/{organisationId}/boards/{boardId}/variables',
            {
                params: {
                    path: {
                        organisationId,
                        boardId,
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
