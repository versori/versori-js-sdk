import { Client, Options } from '@hey-api/client-fetch';
import { ApiError, ErrorType, isErrorType } from '@versori/sdk';
import {
    Activation,
    ActivationCreate,
    ActivationPage,
    AuthSchemeConfig,
    ConnectionCreate,
    embeddedApi,
    EmbeddedIntegration,
    EmbeddedIntegrationPage,
    EndUser,
    EndUserCreate,
    Hub,
    InitialiseOAuth2ConnectionRequest,
    InitialiseOAuth2ConnectionResponse,
    ListEndUserActivationsData,
    ListEndUserIntegrationsData,
} from '@versori/sdk/embedded';
import createDebug from 'debug';
import { CredentialSource } from './types';

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

export type EmbedClientOptions = {
    oauth2CallbackOrigin?: string;
}

const debug = createDebug('versori:embed:EmbedClient');

export class EmbedClient {
    readonly userExternalId: string;
    readonly oauth2CallbackOrigin: string;

    readonly #client: Client;
    readonly #hubId: string;
    readonly #primaryCredentialSource: CredentialSource;

    #endUser?: EndUser;

    constructor(client: Client, hubId: string, userExternalId: string, primaryCredentialSource: CredentialSource, opts: EmbedClientOptions = {}) {
        this.userExternalId = userExternalId;

        this.#client = client;
        this.#hubId = hubId;
        this.#primaryCredentialSource = primaryCredentialSource;

        const baseUrl = this.#client.getConfig().baseUrl;
        if (!baseUrl) {
            throw new Error('client not initialized with baseUrl');
        }

        this.oauth2CallbackOrigin = opts.oauth2CallbackOrigin ? opts.oauth2CallbackOrigin : new URL(baseUrl).origin;
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

    async tryCreateEndUser(authSchemeConfig: AuthSchemeConfig): Promise<EndUser> {
        if (this.#primaryCredentialSource.type !== 'auto') {
            throw new Error('Cannot create end user when primary credential source is not auto');
        }

        const credential = await this.#primaryCredentialSource.generate();

        return this.createEndUser({
            name: `${this.userExternalId}_primary`,
            variables: [],
            credentials: {
                action: [{ authSchemeConfig, credential }],
            },
        });
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

    async getHub(): Promise<Hub> {
        const { data } = await embeddedApi.getHub({
            ...this.#defaultOptions(),
            path: {
                hub_id: this.#hubId,
            },
        });

        return data;
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
}
