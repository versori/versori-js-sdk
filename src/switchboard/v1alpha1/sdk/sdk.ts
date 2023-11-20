import { HubsClient, UsersClient } from '../client';
import { openOAuthWindow } from '../utilities';
import type {
    Connection,
    HubApp,
    ConnectionDataOAuth2ClientCredentials,
    ConnectionDataAPIKey,
    ConnectionDataHTTPBasicAuth,
    AppAuthConfigOAuth2,
    Board,
    ConnectIntegration,
} from '../schemas';
import '../styles/styles.css';

declare global {
    interface Window {
        Versori: any;
    }
}

type BasePaths = {
    hubs?: string;
    users?: string;
    origin?: string;
};

type VersoriHubsParams = {
    userId: string;
    orgId: string;
    apiKey: string;
    basePaths?: BasePaths;
    originUrl?: string;
    finaliseTo?: string;
    onConnected?: (connection: Connection, ConnectionInfo: ConnectionInfo) => void;
    onError: (error: Error) => void;
    onDisconnected: () => void;
    onCompleted?: () => void;
    onInitialised?: () => void;
};

type CreateUserParams = {
    orgId: string;
    hubId: string;
    boardId: string;
    userId: string;
    connection: any;
};

// These can be overriden by the user depending on environment
const HUBS_BASE_PATH = 'https://platform.versori.com/api/switchboard/v1alpha1';
const USERS_BASE_PATH = 'https://platform.versori.com/apis/hubs-sdk/v1/';
const ORIGIN_PATH = 'https://switchboard.versori.com/';

var VERSORI_HUBS: VersoriHubs | null = null;

const REMOVE_VERSORI_HUBS_EVENT_LISTENERS = () => {
    const buttons = document.querySelectorAll('[data-vhubs]');
    buttons.forEach((button) => {
        if (!VERSORI_HUBS) return;
        button.removeEventListener('click', VERSORI_HUBS.triggerFlow);
    });
};

const ATTACH_VERSORI_HUBS_EVENT_LISTENERS = () => {
    const buttons = document.querySelectorAll('[data-vhubs]');
    buttons.forEach((button) => {
        if (!VERSORI_HUBS) return;
        button.addEventListener('click', VERSORI_HUBS.triggerFlow);
    });
};

(function () {
    (window as any)['Versori'] = {
        initHubs: ({
            orgId,
            userId,
            apiKey,
            basePaths,
            finaliseTo,
            onConnected,
            onCompleted,
            onError,
            onDisconnected,
            onInitialised,
        }: VersoriHubsParams) => {
            if (VERSORI_HUBS) {
                REMOVE_VERSORI_HUBS_EVENT_LISTENERS();
                VERSORI_HUBS = null;
            }
            VERSORI_HUBS = new VersoriHubs({
                orgId,
                userId,
                apiKey,
                basePaths,
                finaliseTo,
                onConnected,
                onCompleted,
                onError,
                onDisconnected,
                onInitialised,
            });
            ATTACH_VERSORI_HUBS_EVENT_LISTENERS();
        },
        destroy: () => {
            if (VERSORI_HUBS) {
                REMOVE_VERSORI_HUBS_EVENT_LISTENERS();
                VERSORI_HUBS = null;
            }
        },
        connectUser: async ({ orgId, hubId, boardId, userId, connection }: CreateUserParams) => {
            const usersClient = new UsersClient({
                baseUrl: USERS_BASE_PATH,
            });
            const userClient = usersClient.users;
            const createdUser = await userClient.createUserProxy(orgId, hubId, boardId, userId, {
                environments: [
                    {
                        connectionId: connection.connection.id,
                        credentialId: connection.connection.credentialId,
                        key: connection.info.appKey,
                        variables: null,
                    },
                ],
                id: userId,
                variables: null,
            });
            return createdUser;
        },
        disconnectUser: async ({ orgId, hubId, boardId, userId }: CreateUserParams) => {
            const usersClient = new UsersClient({
                baseUrl: USERS_BASE_PATH,
            });
            const userClient = usersClient.users;
            const deletedUser = await userClient.deleteUserProxy(orgId, hubId, boardId, userId);
            return deletedUser;
        },
    };
})();

export type ConnectionData = ConnectionDataOAuth2ClientCredentials | ConnectionDataAPIKey | ConnectionDataHTTPBasicAuth;

type modals = {
    [key: string]: () => void;
};

type ConnectionInfo = {
    appId?: string;
    appKey?: string;
    hubId?: string;
    boardId?: string;
};

type Error = {
    message: string;
    description: any;
};

class VersoriHubs {
    userId: string;
    orgId: string;
    apiKey: string;
    hubsBasePath: string;
    usersBasePath: string;
    originBaseUrl: string;
    finaliseTo?: string;
    onConnected?: (connection: Connection, ConnectionInfo: ConnectionInfo) => void;
    onError: (error: Error) => void;
    onCompleted?: () => void;
    onDisconnected: (connectionInfo: Pick<ConnectionInfo, 'hubId' | 'boardId'>) => void;
    onInitialised?: () => void;

    #currentlyConnectingInfo: ConnectionInfo = {
        appId: '',
        appKey: '',
        hubId: '',
        boardId: '',
    };
    #hubsClient: any;

    constructor({
        userId,
        orgId,
        apiKey,
        basePaths,
        onConnected,
        onCompleted,
        onDisconnected,
        onInitialised,
        onError,
    }: VersoriHubsParams) {
        this.userId = userId;
        this.orgId = orgId;
        this.apiKey = apiKey;
        this.hubsBasePath = basePaths?.hubs || HUBS_BASE_PATH;
        this.usersBasePath = basePaths?.users || USERS_BASE_PATH;
        this.originBaseUrl = basePaths?.origin || ORIGIN_PATH;
        this.onConnected = onConnected;
        this.onError = onError;
        this.onCompleted = onCompleted;
        this.onDisconnected = onDisconnected;
        this.onInitialised = onInitialised;
        this.initialise();
    }

    initialise = async () => {
        const hubsClient = new HubsClient({
            baseUrl: this.hubsBasePath,
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                origin: '*',
                mode: 'cors',
            },
        });
        this.#hubsClient = hubsClient.hubs;

        const connectedApps = await this.setConnectedApps();
        if (connectedApps) this.onInitialised?.();
        console.info('Versori Hubs SDK initialised');
    };

    setConnectedApps = async () => {
        const buttons = document.querySelectorAll('[data-vhubs]') as NodeListOf<HTMLElement>;
        const usersHubs = Array.from(buttons).map((button) => {
            /* Remove connected Attribute */
            button.removeAttribute('data-connected');
            if (button.hasAttribute('data-vhubid')) {
                return button.getAttribute('data-vhubid');
            }
            return null;
        });
        const uniqueHubs = [...new Set(usersHubs)];
        let count: number = 0;
        for (const hub of uniqueHubs) {
            try {
                const boards: Board[] = await this.#hubsClient.getUsersHubBoards(this.orgId, hub, this.userId);
                boards.forEach((board) => {
                    const button = document.querySelector(`[data-vhubboardid="${board.id}"]`);
                    if (button) button.setAttribute('data-connected', 'true');
                });
                count += 1;
            } catch (error) {
                console.warn(error);
                this.onError({
                    message: `Unable to get ${count} of users connected apps`,
                    description: error,
                });
            }
        }
        return true;
    };

    triggerFlow = (event: Event) => {
        const target = event.target as HTMLButtonElement;
        if (target.hasAttribute('data-connected')) {
            this.onDisconnected({
                hubId: target.dataset.vhubid!,
                boardId: target.dataset.vhubboardid!,
            });
        } else {
            this.getAppAndOpenModal(event);
        }
    };

    modalContent = (authType?: string) => {
        const modals: modals = {
            apikey: this.renderAPIKeyModal,
            clientCredentials: this.renderClientCredentialsModal,
            httpbasicauth: this.renderBasicAuthModal,
        };

        if (authType === undefined) return this.renderBasicAuthModal;
        return modals[authType];
    };

    getAppAndOpenModal = async (event: Event) => {
        event.preventDefault();
        const target = event.target as HTMLButtonElement;
        try {
            /* Integration endpoint won't work localy */
            const integrations: ConnectIntegration = await this.#hubsClient.getHubIntegrationInfo(
                this.orgId,
                target.dataset.vhubid,
                target.dataset.vhubboardid
            );
            /*  Work around for mock data */
            // if (!(target instanceof HTMLButtonElement)) return;
            // const integration = mock[target.dataset.vhubid!][target.dataset.vhubboardid!].find(
            //     (integration) => integration.requiresUserAuth
            // )!;

            console.log(integrations);
            if (!integrations.connections) {
                this.onError({
                    message: 'No Authentication config found for this Integration',
                    description: integrations,
                });
                return;
            }
            const integration = integrations.connections.find((integration) => integration.requiresUserAuth) as HubApp;
            if (!integration) {
                this.onError({
                    message: 'No Authentication config found for this Integration',
                    description: integration,
                });
                return;
            }

            this.#currentlyConnectingInfo = {
                appId: integration.id,
                appKey: integration.authConfig?.connectionId,
                hubId: target.dataset.vhubid!,
                boardId: target.dataset.vhubboardid!,
            };
            const currentConnectionType = integration?.authConfig;

            if (currentConnectionType?.authType === 'oidc' || currentConnectionType?.authType === 'oauth2') {
                if ((currentConnectionType.data as AppAuthConfigOAuth2).flowType === 'clientCredentials') {
                    this.modalContent('clientCredentials')();

                    return;
                }

                await this.handleOauthConnect();
            } else if (['apikey', 'httpbasicauth'].some((item) => item === currentConnectionType?.authType)) {
                this.modalContent(currentConnectionType?.authType)();
            } else {
                alert('Unsupported auth method');
            }
        } catch (error) {
            this.onError({
                message: 'No Authentication config found for this Integration',
                description: error,
            });
            console.warn(error);
        }
    };

    handlePostToClient = async () => {
        try {
            await fetch(`${this.finaliseTo}`, {
                method: 'POST',
                body: JSON.stringify({
                    connectionInfo: this.#currentlyConnectingInfo,
                }),
            });
            this.onCompleted?.();
        } catch (error) {
            this.onError({
                message: 'Failed to sync with client backend',
                description: error,
            });
            console.warn(error);
        }
    };

    handleSuccessfulConnection = async (event: MessageEvent) => {
        // if (event.data.id !== 'versori') return;
        if (event.data.success) {
            if (event.origin === this.originBaseUrl) {
                if (this.finaliseTo) {
                    this.handlePostToClient();
                } else if (this.onConnected) {
                    this.onConnected?.(event.data.connection, this.#currentlyConnectingInfo);
                } else {
                    this.onError({
                        message: 'No callback event provided',
                        description: 'Please provide either a onConnected callback or a finaliseTo url',
                    });
                }
            }
        }
        if (!event.data.success) {
            this.onError({
                message: 'Failed to authenticate',
                description: event,
            });
            console.warn(event);
        }
        window.removeEventListener('message', this.handleSuccessfulConnection);
    };

    handleOauthConnect = async () => {
        try {
            const initConnectResponse = await this.#hubsClient.initConnection(this.orgId, {
                appId: this.#currentlyConnectingInfo.appId,
                authType: 'oauth2',
            });
            if (initConnectResponse?.action?.redirect?.url) {
                openOAuthWindow({
                    url: `${initConnectResponse.action.redirect.url}&prompt=login`,
                    title: 'Connect',
                    width: 800,
                    height: 800,
                });

                window.addEventListener('message', this.handleSuccessfulConnection, false);
            }
        } catch (e) {}
    };

    createConnection = async (name: string, formBody: ConnectionData, authType: string) => {
        try {
            const connectResponse = await this.#hubsClient.createConnection(this.orgId, [
                {},
                {
                    appId: this.#currentlyConnectingInfo.appId,
                    authType,
                    data: formBody,
                    name: name,
                },
            ]);
            if (this.finaliseTo) {
                await this.handlePostToClient();
            } else if (this.onConnected) {
                this.onConnected?.(connectResponse, this.#currentlyConnectingInfo);
            } else {
                this.onError({
                    message: 'No callback event provided',
                    description: 'Please provide either a onConnected callback or a finaliseTo url',
                });
            }
        } catch (error) {
            this.onError({
                message: 'Failed to create credential',
                description: error,
            });
            console.warn(error);
        }
        this.removeVersoriSDKModal();
    };

    removeVersoriSDKModal = () => {
        const modals = document.querySelectorAll('.v-hubs-sdk-modal');
        if (modals.length) {
            modals.forEach((modal) => {
                modal.remove();
            });
        }
    };

    renderBaseModal = (title: string, description: string) => {
        const modal = document.createElement('div');
        modal.classList.add('v-hubs-sdk-modal');

        const modalWrapper = document.createElement('div');
        modalWrapper.classList.add('v-hubs-sdk-modal-wrapper');
        const modalContent = document.createElement('div');
        modalContent.classList.add('v-hubs-sdk-modal-content');

        // Create header
        const modalHeader = document.createElement('div');
        modalHeader.classList.add('v-hubs-sdk-modal-header');

        // Add title
        const modalTitle = document.createElement('h2');
        modalTitle.classList.add('v-hubs-sdk-modal-title');
        modalTitle.innerText = title;

        // Add paragraph for description
        const modalDescription = document.createElement('p');
        modalDescription.classList.add('v-hubs-sdk-modal-description');
        modalDescription.innerText = description;

        // Add close button
        const modalClose = document.createElement('button');
        modalClose.classList.add('v-hubs-sdk-modal-close');
        modalClose.setAttribute('type', 'button');
        modalClose.innerText = 'X';
        modalClose.addEventListener('click', this.removeVersoriSDKModal);

        // Append all elements to header
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(modalDescription);
        modalHeader.appendChild(modalClose);
        modalContent.appendChild(modalHeader);

        return {
            modal,
            modalWrapper,
            modalContent,
        };
    };

    renderAPIKeyModal = () => {
        const { modal, modalWrapper, modalContent } = this.renderBaseModal(
            'Connect API Key',
            'Add credentials to connect using API Key'
        );

        const form = document.createElement('form');
        form.setAttribute('action', '#');
        form.classList.add('v-hubs-sdk-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const apiKeyName = formData.get('API Key Name') as string;
            const apiKey = formData.get('API Key');
            const formBody = {
                apiKey: apiKey,
            } as ConnectionDataAPIKey;
            this.createConnection(apiKeyName, formBody, 'apikey');
        });

        // Create div to wrap all inputs and buttons
        const formInputWrapper = document.createElement('div');
        formInputWrapper.classList.add('v-hubs-sdk-form-input-wrapper');

        // Create input wrapper
        const apiKeyWrapper = document.createElement('div');
        apiKeyWrapper.classList.add('v-hubs-sdk-input-wrapper');
        const apiKeyNameWrapper = document.createElement('div');
        apiKeyNameWrapper.classList.add('v-hubs-sdk-input-wrapper');

        // Create input for api key
        const apiKeyInput = document.createElement('input');
        apiKeyInput.setAttribute('required', '');
        apiKeyInput.classList.add('v-hubs-sdk-input');
        apiKeyInput.setAttribute('type', 'text');
        apiKeyInput.setAttribute('name', 'API Key Name');
        apiKeyInput.setAttribute('placeholder', 'API Key Name');

        // Create input for api key name
        const apiKeyNameInput = document.createElement('input');
        apiKeyNameInput.setAttribute('required', '');
        apiKeyNameInput.classList.add('v-hubs-sdk-input');
        apiKeyNameInput.setAttribute('type', 'text');
        apiKeyNameInput.setAttribute('name', 'API Key');
        apiKeyNameInput.setAttribute('placeholder', 'API Key');

        // Append to wrapper
        apiKeyWrapper.appendChild(apiKeyInput);
        apiKeyNameWrapper.appendChild(apiKeyNameInput);

        // Create cancel button
        const cancelButton = document.createElement('button');
        cancelButton.setAttribute('type', 'button');
        cancelButton.classList.add('v-hubs-sdk-cancel-button');
        cancelButton.innerText = 'Cancel';
        cancelButton.addEventListener('click', this.removeVersoriSDKModal);

        const submitButton = document.createElement('button');
        submitButton.classList.add('v-hubs-sdk-submit-button');
        submitButton.setAttribute('type', 'submit');
        submitButton.innerText = 'Submit';

        // Create div to wrap all buttons
        const formButtonWrapper = document.createElement('div');
        formButtonWrapper.classList.add('v-hubs-sdk-form-button-wrapper');
        formButtonWrapper.appendChild(cancelButton);
        formButtonWrapper.appendChild(submitButton);

        // Append all elements to form
        formInputWrapper.appendChild(apiKeyWrapper);
        formInputWrapper.appendChild(apiKeyNameWrapper);
        formInputWrapper.appendChild(formButtonWrapper);
        form.appendChild(formInputWrapper);

        // Build Modal
        modalContent.appendChild(form);
        modalWrapper.appendChild(modalContent);
        modal.appendChild(modalWrapper);

        document.body.appendChild(modal);
    };

    renderClientCredentialsModal = () => {
        const { modal, modalWrapper, modalContent } = this.renderBaseModal(
            'Connect OAuth2 (Client Credentials)',
            'Add credentials to connect using OAuth2'
        );

        let additionalParametersCount = 0;

        function getAdditionalParameters() {
            const inputs = [];
            for (let i = 0; i <= additionalParametersCount; i++) {
                const item = {
                    key: '',
                    value: '',
                };
                const additionalItem = document.querySelector(`#additional-parameters-${i + 1}`);
                if (additionalItem) {
                    const keyInput = additionalItem.querySelector('input[name="Key"]') as HTMLInputElement;
                    const valueInput = additionalItem.querySelector('input[name="Value"]') as HTMLInputElement;
                    item.key = keyInput?.value;
                    item.value = valueInput?.value;
                    inputs.push(item);
                }
            }
            return inputs;
        }

        const form = document.createElement('form');
        form.setAttribute('action', '#');
        form.classList.add('v-hubs-sdk-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const name = formData.get('Name') as string;
            const clientId = formData.get('Client ID') as string;
            const clientSecret = formData.get('Client Secret') as string;
            const issueToken = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
            const additionalParemeters = getAdditionalParameters();
            const formBody = {
                clientId: clientId,
                clientSecret: clientSecret,
                additionalParameters: JSON.stringify(additionalParemeters),
                issueToken: issueToken?.checked,
            } as ConnectionDataOAuth2ClientCredentials;
            console.log(formBody);
            this.createConnection(name, formBody, 'clientCredentials');
        });

        // Create div to wrap all inputs and buttons
        const formInputWrapper = document.createElement('div');
        formInputWrapper.classList.add('v-hubs-sdk-form-input-wrapper');

        // Create input wrappers
        const clientCredentialsNameWrapper = document.createElement('div');
        clientCredentialsNameWrapper.classList.add('v-hubs-sdk-input-wrapper');
        const clientCredentialsIdWrapper = document.createElement('div');
        clientCredentialsIdWrapper.classList.add('v-hubs-sdk-input-wrapper');
        const clientCredentialsSecretWrapper = document.createElement('div');
        clientCredentialsSecretWrapper.classList.add('v-hubs-sdk-input-wrapper');

        // Create input for name
        const name = document.createElement('input');
        name.setAttribute('required', '');
        name.classList.add('v-hubs-sdk-input');
        name.setAttribute('type', 'text');
        name.setAttribute('name', 'Name');
        name.setAttribute('placeholder', 'Name');

        // Create input for client ID
        const clientIdInput = document.createElement('input');
        clientIdInput.setAttribute('required', '');
        clientIdInput.setAttribute('type', 'text');
        clientIdInput.setAttribute('name', 'Client ID');
        clientIdInput.setAttribute('placeholder', 'Client ID');
        clientIdInput.classList.add('v-hubs-sdk-input');

        // Create input for client secret
        const clientSecretInput = document.createElement('input');
        clientSecretInput.setAttribute('required', '');
        clientSecretInput.setAttribute('type', 'text');
        clientSecretInput.setAttribute('name', 'Client Secret');
        clientSecretInput.setAttribute('placeholder', 'Client Secret');
        clientSecretInput.classList.add('v-hubs-sdk-input');

        const additionalParametersWrapper = document.createElement('div');
        additionalParametersWrapper.classList.add('v-hubs-sdk-additional-parameters-wrapper');
        const additionalParametersTitle = document.createElement('h3');
        additionalParametersTitle.classList.add('v-hubs-sdk-additional-parameters-title');
        additionalParametersTitle.innerText = 'Additional Parameters';
        additionalParametersWrapper.append(additionalParametersTitle);

        const addAdditionalParametersButton = document.createElement('button');
        additionalParametersWrapper.appendChild(addAdditionalParametersButton);
        addAdditionalParametersButton.setAttribute('type', 'button');
        addAdditionalParametersButton.classList.add('v-hubs-sdk-add-additional-parameters-button');
        addAdditionalParametersButton.innerText = '+';
        addAdditionalParametersButton.addEventListener('click', () => {
            additionalParametersCount += 1;
            const additionalParametersItem = document.createElement('div');
            additionalParametersItem.classList.add('v-hubs-sdk-additional-parameters-item');
            additionalParametersItem.setAttribute('id', `additional-parameters-${additionalParametersCount}`);
            const keyInputWrapper = document.createElement('div');
            keyInputWrapper.classList.add('v-hubs-sdk-parameters-input-wrapper');
            const keyInput = document.createElement('input');
            keyInput.setAttribute('required', '');
            keyInput.classList.add('v-hubs-sdk-input');
            keyInput.setAttribute('type', 'text');
            keyInput.setAttribute('name', 'Key');
            keyInput.setAttribute('placeholder', 'Key');
            keyInputWrapper.appendChild(keyInput);
            const valueInputWrapper = document.createElement('div');
            valueInputWrapper.classList.add('v-hubs-sdk-parameters-input-wrapper');
            const valueInput = document.createElement('input');
            valueInput.setAttribute('required', '');
            valueInput.classList.add('v-hubs-sdk-input');
            valueInput.setAttribute('type', 'text');
            valueInput.setAttribute('name', 'Value');
            valueInput.setAttribute('placeholder', 'Value');
            valueInputWrapper.appendChild(valueInput);
            const removeButton = document.createElement('button');
            removeButton.setAttribute('type', 'button');
            removeButton.classList.add('v-hubs-sdk-remove-additional-parameters-button');
            removeButton.innerText = 'Remove';
            removeButton.addEventListener('click', (event) => {
                event.preventDefault();
                const _self = event.target as HTMLButtonElement;
                const parent = _self.parentElement;
                if (parent) {
                    parent.remove();
                }
            });
            additionalParametersItem.appendChild(keyInputWrapper);
            additionalParametersItem.appendChild(valueInputWrapper);
            additionalParametersItem.appendChild(removeButton);
            const addAdditionalParametersButton = document.querySelector(
                '.v-hubs-sdk-add-additional-parameters-button'
            );
            additionalParametersWrapper.insertBefore(additionalParametersItem, addAdditionalParametersButton);
        });

        // Checkbox
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.classList.add('v-hubs-sdk-checkbox-wrapper');
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('name', 'Issue Token');
        checkbox.setAttribute('id', 'Issue Token');
        checkbox.classList.add('v-hubs-sdk-checkbox');
        const checkboxLabel = document.createElement('label');
        checkboxLabel.setAttribute('for', 'Issue Token');
        checkboxLabel.classList.add('v-hubs-sdk-checkbox-label');
        checkboxLabel.innerText = 'Issue Token';
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(checkboxLabel);

        // Append to wrapper
        clientCredentialsNameWrapper.appendChild(name);
        clientCredentialsIdWrapper.appendChild(clientIdInput);
        clientCredentialsSecretWrapper.appendChild(clientSecretInput);

        // Create cancel button
        const cancelButton = document.createElement('button');
        cancelButton.setAttribute('type', 'button');
        cancelButton.classList.add('v-hubs-sdk-cancel-button');
        cancelButton.innerText = 'Cancel';
        cancelButton.addEventListener('click', this.removeVersoriSDKModal);

        const submitButton = document.createElement('button');
        submitButton.classList.add('v-hubs-sdk-submit-button');
        submitButton.setAttribute('type', 'submit');
        submitButton.innerText = 'Submit';

        // Create div to wrap all buttons
        const formButtonWrapper = document.createElement('div');
        formButtonWrapper.classList.add('v-hubs-sdk-form-button-wrapper');
        formButtonWrapper.appendChild(cancelButton);
        formButtonWrapper.appendChild(submitButton);

        // Append all elements to form
        formInputWrapper.appendChild(clientCredentialsNameWrapper);
        formInputWrapper.appendChild(clientCredentialsIdWrapper);
        formInputWrapper.appendChild(clientCredentialsSecretWrapper);
        formInputWrapper.appendChild(additionalParametersWrapper);
        formInputWrapper.appendChild(checkboxWrapper);
        formInputWrapper.appendChild(formButtonWrapper);
        form.appendChild(formInputWrapper);

        // Build Modal
        modalContent.appendChild(form);
        modalWrapper.appendChild(modalContent);
        modal.appendChild(modalWrapper);

        document.body.appendChild(modal);
    };

    renderBasicAuthModal = () => {
        const { modal, modalWrapper, modalContent } = this.renderBaseModal(
            'Connect HTTP Basic Auth',
            'Add credentials to connect using user and password'
        );

        const form = document.createElement('form');
        form.setAttribute('action', '#');
        form.classList.add('v-hubs-sdk-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const user = formData.get('User') as string;
            const password = formData.get('Password') as string;
            const formBody = {
                user: user,
                password: password,
            } as ConnectionDataHTTPBasicAuth;
            this.createConnection(user, formBody, 'httpbasicauth');
        });

        // Create div to wrap all inputs and buttons
        const formInputWrapper = document.createElement('div');
        formInputWrapper.classList.add('v-hubs-sdk-form-input-wrapper');

        // Create input wrapper
        const basicAuthNameWrapper = document.createElement('div');
        basicAuthNameWrapper.classList.add('v-hubs-sdk-input-wrapper');
        const basicAuthPasswordWrapper = document.createElement('div');
        basicAuthPasswordWrapper.classList.add('v-hubs-sdk-input-wrapper');

        // Create input for user
        const user = document.createElement('input');
        user.setAttribute('required', '');
        user.classList.add('v-hubs-sdk-input');
        user.setAttribute('type', 'text');
        user.setAttribute('name', 'User');
        user.setAttribute('placeholder', 'User');

        // Create input for password
        const password = document.createElement('input');
        password.setAttribute('required', '');
        password.classList.add('v-hubs-sdk-input');
        password.setAttribute('type', 'text');
        password.setAttribute('name', 'Password');
        password.setAttribute('placeholder', 'Password');

        // Append to wrapper
        basicAuthNameWrapper.appendChild(user);
        basicAuthPasswordWrapper.appendChild(password);

        // Create cancel button
        const cancelButton = document.createElement('button');
        cancelButton.setAttribute('type', 'button');
        cancelButton.classList.add('v-hubs-sdk-cancel-button');
        cancelButton.innerText = 'Cancel';
        cancelButton.addEventListener('click', this.removeVersoriSDKModal);

        const submitButton = document.createElement('button');
        submitButton.classList.add('v-hubs-sdk-submit-button');
        submitButton.setAttribute('type', 'submit');
        submitButton.innerText = 'Submit';

        // Create div to wrap all buttons
        const formButtonWrapper = document.createElement('div');
        formButtonWrapper.classList.add('v-hubs-sdk-form-button-wrapper');
        formButtonWrapper.appendChild(cancelButton);
        formButtonWrapper.appendChild(submitButton);

        // Append all elements to form
        formInputWrapper.appendChild(basicAuthNameWrapper);
        formInputWrapper.appendChild(basicAuthPasswordWrapper);
        formInputWrapper.appendChild(formButtonWrapper);
        form.appendChild(formInputWrapper);

        // Build Modal
        modalContent.appendChild(form);
        modalWrapper.appendChild(modalContent);
        modal.appendChild(modalWrapper);

        document.body.appendChild(modal);
    };
}
