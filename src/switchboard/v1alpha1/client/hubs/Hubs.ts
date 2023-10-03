import { ApiError } from '../../common';
import { operations } from '../../generated/api.ts';
import { Hub, HubCreate, HubsPage } from '../../schemas';
import { RawClient } from '../types.ts';

export type ListHubsParams = operations['GetHubs']['parameters']['query'];

export class Hubs {

    private readonly client: RawClient;

    constructor(client: RawClient) {
        this.client = client;
    }

    async create(organisationId: string, body: HubCreate): Promise<Hub> {
        const { data, error, response } = await this.client.POST('/organisations/{organisationId}/hubs', {
            params: {
                path: {
                    organisationId,
                },
            },
            body,
        })

        if (error) {
            throw new ApiError(response, error);
        }

        return data;
    }

    async list(organisationId: string, params: ListHubsParams): Promise<HubsPage> {
        const { data, error, response } = await this.client.GET('/organisations/{organisationId}/hubs', {
           params: {
               path: {
                   organisationId,
               },
               query: params,
           }
        });

        if (error) {
            throw new ApiError(response, error);
        }

        return data;
    }
}
