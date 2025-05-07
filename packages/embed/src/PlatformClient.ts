import { Client, Options } from '@hey-api/client-fetch';
import { ApiError, ErrorType, isErrorType } from '@versori/sdk';
// TODO: the import needs to be changes to @versori/sdk at some point but this works for now with typing
import {
    Activation,
    ActivationCreate,
    ConnectionTemplate,
    EndUser,
    EndUserCreate,
    InitialiseOAuth2ConnectionRequest,
    InitialiseOAuth2ConnectionResponse,
    ListEndUsersData,
    ListProjectConnectionTemplatesData,
    ListProjectsResponse,
    ListUserActivationsResponse,
    platformApi,
    Project,
    ProjectSummary,
} from '../../sdk/src/platform';
import createDebug from 'debug';
import { CredentialSource } from './types';
import { ListEndUserActivationsResponse } from '../../sdk/src/embedded';

export type ListEndUserActivationOptions = ListEndUsersData['query'];
export type ListConnectionTemplateOptions = ListProjectConnectionTemplatesData['query'];

export type UserProjectSummary = ProjectSummary & {
    isActivated: boolean;
};

/**
 * OptionalKeys is a mapped type which extracts the keys from T where the value is optional.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type OptionalKeys<T> = Exclude<{ [K in keyof T]: {} extends Pick<T, K> ? K : never }[keyof T], undefined>;

/**
 * OptionalFields is a mapped type which only allows specifying the optional fields of T. This is
 * used as options on API methods where the SDK provides the mandatory fields and the user may
 * provide the additional optional fields.
 */
type OptionalFields<T extends Record<string, unknown>> = Pick<T, OptionalKeys<T>>;

export type PlatformClientOptions = {
    oauth2CallbackOrigin?: string;
};

const debug = createDebug('versori:embed:PlatformClient');

export class PlatformClient {
    readonly userExternalId: string;
    readonly oauth2CallbackOrigin: string;

    readonly #client: Client;
    readonly #orgId: string;
    readonly #primaryCredentialSource: CredentialSource;

    #endUser?: EndUser;

    constructor(
        client: Client,
        orgId: string,
        userExternalId: string,
        primaryCredentialSource: CredentialSource,
        opts: PlatformClientOptions = {}
    ) {
        this.userExternalId = userExternalId;

        this.#client = client;
        this.#orgId = orgId;
        this.#primaryCredentialSource = primaryCredentialSource;

        const baseUrl = this.#client.getConfig().baseUrl;
        if (!baseUrl) {
            throw new Error('client not initialized with a base URL');
        }

        this.oauth2CallbackOrigin = opts.oauth2CallbackOrigin ? opts.oauth2CallbackOrigin : new URL(baseUrl).origin;
    }

    get primaryCredentialSource(): CredentialSource {
        return this.#primaryCredentialSource;
    }

    #defaultOptions<T = Record<string, unknown>>(): Options<T, true> {
        return {
            client: this.#client,
            throwOnError: true,
        } as Options<T, true>;
    }

    get endUser(): EndUser | undefined {
        return this.#endUser;
    }

    get orgId(): string {
        return this.#orgId;
    }

    async tryGetEndUser(): Promise<void> {
        const { data, error, request, response } = await platformApi.getEndUser({
            ...this.#defaultOptions(),
            throwOnError: false,
            path: {
                organisation_id: this.#orgId,
                user_id: this.userExternalId,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                debug('End user does not exist, will create upon first activation');

                return;
            }

            const errorType: ErrorType = isErrorType(error)
                ? error
                : {
                      message: 'Unexpected response from GetEndUser',
                      code: '599999',
                  };

            throw new ApiError('Unexpected response from GetEndUser', request, response, errorType);
        }

        this.#endUser = data;
    }

    async tryCreateEndUser(): Promise<EndUser> {
        return this.createEndUser({
            displayName: `${this.userExternalId}_primary`,
        });
    }

    async createEndUser(opts: OptionalFields<EndUserCreate>): Promise<EndUser> {
        const { data } = await platformApi.createEndUser({
            ...this.#defaultOptions(),
            path: {
                organisation_id: this.#orgId,
            },
            body: {
                ...opts,
                externalId: this.userExternalId,
            },
        });

        this.#endUser = data;

        return data;
    }

    async activateEndUser(body: ActivationCreate): Promise<Activation> {
        const { data } = await platformApi.activateUser({
            ...this.#defaultOptions(),
            path: {
                organisation_id: this.#orgId,
            },
            body,
        });

        return data;
    }

    async getActivations(opts: ListEndUserActivationOptions): Promise<ListUserActivationsResponse> {
        const { data } = await platformApi.listUserActivations({
            ...this.#defaultOptions(),
            path: {
                organisation_id: this.#orgId,
                external_user_id: this.userExternalId,
                environment_id: opts?.environment_id ?? '',
            },
        });

        return data;
    }

    async deactivateEndUser(envId: string, actId: string): Promise<void> {
        await platformApi.deleteActivation({
            ...this.#defaultOptions(),
            path: {
                organisation_id: this.#orgId,
                activation_id: actId,
                environment_id: envId,
            },
        });
    }

    async getProject(id: string): Promise<Project> {
        const { data } = await platformApi.getProject({
            ...this.#defaultOptions(),
            path: {
                organisation_id: this.#orgId,
                project_id: id,
            },
        });

        return data;
    }

    // if deployed is true, only return projects that are deployed
    async getUserProjects(deployed: boolean = false): Promise<UserProjectSummary[]> {
        const { data } = await platformApi.listProjects({
            ...this.#defaultOptions(),
            path: {
                organisation_id: this.#orgId,
            },
        });

        if (deployed) {
            data.projects = data.projects.filter((p) => p.environments[0].status === 'running');
        }

        // this is a horrible but necessary evil until we make some API changes
        let projectSummaries: UserProjectSummary[] = [];

        projectSummaries = await Promise.all(
            data.projects.map(async (project) => {
                const { data } = await platformApi.listUserActivations({
                    ...this.#defaultOptions(),
                    path: {
                        organisation_id: this.#orgId,
                        external_user_id: this.userExternalId,
                        environment_id: project.environments[0].id,
                    },
                });

                return {
                    ...project,
                    isActivated: data.length > 0,
                };
            })
        );

        return projectSummaries;
    }

    async getConnectionTemplates(
        projectId: string,
        opts?: ListConnectionTemplateOptions
    ): Promise<ConnectionTemplate[]> {
        const { data } = await platformApi.listProjectConnectionTemplates({
            ...this.#defaultOptions(),
            path: {
                organisation_id: this.#orgId,
                project_id: projectId,
            },
            query: opts,
        });

        return data.items;
    }

    async initialiseOAuth2Connection(
        systemId: string,
        body: InitialiseOAuth2ConnectionRequest
    ): Promise<InitialiseOAuth2ConnectionResponse> {
        const { data } = await platformApi.initialiseOauth2Connection({
            ...this.#defaultOptions(),
            path: {
                organisation_id: this.#orgId,
                system_id: systemId,
            },
            body,
        });

        return data;
    }
}
