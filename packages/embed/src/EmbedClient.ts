import { Client, Options } from '@hey-api/client-fetch';
import { ApiError, ErrorType, isErrorType } from '@versori/sdk';
import {
    Activation,
    ActivationCreate,
    ActivationPage,
    ConnectionCreate,
    embeddedApi,
    EmbeddedIntegration,
    EmbeddedIntegrationPage,
    EndUser,
    EndUserCreate,
    InitialiseOAuth2ConnectionRequest,
    InitialiseOAuth2ConnectionResponse,
    ListEndUserActivationsData,
    ListEndUserIntegrationsData,
} from '@versori/sdk/embedded';
import createDebug from 'debug';

const debug = createDebug('versori:embed:EmbedClient');

export type ListIntegrationOptions = ListEndUserIntegrationsData['query'];
export type ListEndUserActivationOptions = ListEndUserActivationsData['query'];

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

export class EmbedClient {
    readonly userExternalId: string;
    readonly #client: Client;
    readonly #hubId: string;
    #endUser?: EndUser;

    constructor(client: Client, hubId: string, userExternalId: string) {
        this.#client = client;
        this.#hubId = hubId;
        this.userExternalId = userExternalId;
    }

    get endUser(): EndUser | undefined {
        return this.#endUser;
    }

    /**
     * Try to get the end user from the API and populate this instance with it upon success, ignoring 404 errors.
     *
     * Any non-404 errors will be thrown as an `ApiError`.
     */
    async tryGetEndUser(): Promise<void> {
        const { data, error, request, response } = await embeddedApi.getEndUser({
            ...this.#defaultOptions(),
            // override throwOnError from defaultOptions since we want to ignore 404 errors
            throwOnError: false,
            path: {
                hub_id: this.#hubId,
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

    async createEndUser(
        primaryConnection: ConnectionCreate,
        opts: OptionalFields<EndUserCreate> = {}
    ): Promise<EndUser> {
        const { data } = await embeddedApi.createEndUser({
            ...this.#defaultOptions(),
            path: {
                hub_id: this.#hubId,
            },
            body: {
                ...opts,
                externalId: this.userExternalId,
                primaryConnection,
            },
        });

        this.#endUser = data;

        return data;
    }

    /**
     * Get a list of integrations for the current user.
     *
     * @param opts
     */
    async getIntegrations(opts: ListIntegrationOptions = {}): Promise<EmbeddedIntegrationPage> {
        const { data } = await embeddedApi.listEndUserIntegrations({
            ...this.#defaultOptions(),
            path: {
                hub_id: this.#hubId,
                user_id: this.userExternalId,
            },
            query: opts,
        });

        return data;
    }

    /**
     * Get a single integration by ID.
     * @param id
     */
    async getIntegration(id: string): Promise<EmbeddedIntegration> {
        const { data } = await embeddedApi.getEmbeddedIntegration({
            ...this.#defaultOptions(),
            path: {
                hub_id: this.#hubId,
                user_id: this.userExternalId,
                integration_id: id,
            },
        });

        return data;
    }

    async activateIntegration(body: ActivationCreate): Promise<Activation> {
        const { data } = await embeddedApi.activateIntegration({
            ...this.#defaultOptions(),
            body,
        });

        return data;
    }

    async deactivateIntegration(activationId: string): Promise<void> {
        await embeddedApi.deleteActivation({
            ...this.#defaultOptions(),
            path: {
                activation_id: activationId,
            },
        });
    }

    async getActivations(opts?: ListEndUserActivationOptions): Promise<ActivationPage> {
        const { data } = await embeddedApi.listEndUserActivations({
            ...this.#defaultOptions(),
            path: {
                hub_id: this.#hubId,
                user_id: this.userExternalId,
            },
            query: opts,
        });

        return data;
    }

    async initialiseOAuth2Connection(
        connectorId: string,
        body: InitialiseOAuth2ConnectionRequest
    ): Promise<InitialiseOAuth2ConnectionResponse> {
        const { data } = await embeddedApi.initialiseOauth2EmbeddedConnection({
            ...this.#defaultOptions(),
            path: {
                hub_id: this.#hubId,
                connector_id: connectorId,
            },
            body,
        });

        return data;
    }

    #defaultOptions<T = Record<string, unknown>>(): Options<T, true> {
        return {
            client: this.#client,
            throwOnError: true,
        } as Options<T, true>;
    }
}
