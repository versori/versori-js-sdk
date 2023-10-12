import { HubsClient } from '../client';
import { openOAuthWindow } from '../utilities';
import type {
    Connection,
    ConnectionDataOAuth2ClientCredentials,
    ConnectionDataAPIKey,
    ConnectionDataHTTPBasicAuth,
    AppAuthConfigOAuth2,
    Board,
} from '../schemas';
import '../styles/styles.css';
import { mock } from './mockIntegrationResponse';

declare global {
    interface Window {
        Versori: any;
    }
}

(function () {
    console.log('Versori SDK loaded');
    (window as any)['Versori'] = {
        initHubs: ({ orgId, userId, originUrl, onSuccess, onConnection, onError }: initHubsParams) => {
            new Versori({ orgId, userId, originUrl, onSuccess, onConnection, onError });
        },
    };
})();

export type ConnectionData =
    | ConnectionDataOAuth2ClientCredentials
    | ConnectionDataAPIKey
    // | ConnectionDataHTTPRefresh
    // | ConnectionDataDatabase
    | ConnectionDataHTTPBasicAuth;

type modals = {
    [key: string]: () => void;
};

type CurrentlyConnectingInfo = {
    appId: string;
    appKey: string;
    hub: string;
    board: string;
};

const BASE_PATH = 'http://127.0.0.1:8080/v1alpha1';

type initHubsParams = {
    userId: string;
    orgId: string;
    originUrl: string;
    onConnection: string;
    onSuccess: string | ((connection: any, ConnectionInfo: CurrentlyConnectingInfo) => void);
    onError: (error: string) => void;
};

class Versori {
    userId: string;
    orgId: string;
    originUrl: string;
    onConnection: string;
    onSuccess: string | ((connection: any, ConnectionInfo: CurrentlyConnectingInfo) => void);
    onError: (error: string) => void;

    #currentlyConnectingInfo: CurrentlyConnectingInfo = {
        appId: '',
        appKey: '',
        hub: '',
        board: '',
    };
    #hubsClient: any;

    constructor({ userId, orgId, originUrl, onSuccess, onConnection, onError }: initHubsParams) {
        this.userId = userId;
        this.orgId = orgId;
        this.originUrl = originUrl;
        this.onConnection = onConnection;
        this.onError = onError;
        this.onSuccess = onSuccess;
        this.initialise();
    }

    initialise = async () => {
        this.attachEventListeners();

        const hubsClient = new HubsClient({
            baseUrl: BASE_PATH,
        });
        this.#hubsClient = hubsClient.hubs;

        this.setConnectedApps();
    };

    setConnectedApps = async () => {
        const buttons = document.querySelectorAll('button[data-vhubs]') as NodeListOf<HTMLElement>;
        const usersHubs = Array.from(buttons).map((button) => {
            if (button.hasAttribute('data-vhubid')) {
                return button.getAttribute('data-vhubid');
            }
            return null;
        });
        const uniqueHubs = [...new Set(usersHubs)];
        for (const hub of uniqueHubs) {
            const boards: Board[] = await this.#hubsClient.getUsersHubBoards(this.orgId, hub, this.userId);
            boards.forEach((board) => {
                const button = document.querySelector(`button[data-vhubboardid="${board.id}"]`);
                if (button) button.setAttribute('data-connected', 'true');
            });
        }
    };

    attachEventListeners = () => {
        const buttons = document.querySelectorAll('button[data-vhubboardid]');
        buttons.forEach((button) => {
            button.addEventListener('click', this.getAppAndOpenModal);
        });
    };

    modalContent = (authType: string) => {
        const modals: modals = {
            apikey: this.renderAPIKeyModal,
            clientCredentials: this.renderClientCredentialsModal,
            httpbasicauth: this.renderBasicAuthModal,
        };

        return modals[authType];
    };

    getAppAndOpenModal = async (event: Event) => {
        event.preventDefault();
        const target = event.target as HTMLButtonElement;
        /* Integration endpoint won't work localy */
        // const integrations = await this.#hubsClient.getHubIntegrations(
        //     window.Versori.orgId,
        //     el.dataset.vhubid,
        //     el.dataset.vhubboardid
        // );

        /*  Work around for mock data */
        if (!(target instanceof HTMLButtonElement)) return;
        const integration = mock[target.dataset.vhubid!][target.dataset.vhubboardid!].find(
            (integration) => integration.requiresUserAuth
        )!;
        this.#currentlyConnectingInfo = {
            appId: integration.id,
            appKey: integration.authConfig.connectionId,
            hub: target.dataset.vhubid!,
            board: target.dataset.vhubboardid!,
        };
        const currentConnectionType = integration?.authConfig;

        if (currentConnectionType.authType === 'oidc' || currentConnectionType.authType === 'oauth2') {
            if ((currentConnectionType.data as AppAuthConfigOAuth2).flowType === 'clientCredentials') {
                this.modalContent('clientCredentials')();

                return;
            }

            await this.handleOauthConnect();
        } else if (['apikey', 'httprefresh', 'database', 'httpbasicauth'].includes(currentConnectionType.authType)) {
            this.modalContent(currentConnectionType.authType)();
        } else {
            alert('Unsupported auth method');
        }
    };

    handlePostToClient = async () => {
        try {
            const response = await fetch(
                `${this.onSuccess}/${this.#currentlyConnectingInfo.hub}/${this.#currentlyConnectingInfo.board}`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        connectionInfo: this.#currentlyConnectingInfo,
                    }),
                }
            );
            console.log(response);
        } catch (e) {
            console.log(e);
        }
    };

    handleSuccessfulConnection = async (event: MessageEvent) => {
        console.log(event);
        if (event.data.success) {
            if (event.origin === this.originUrl) {
                if (typeof this.onSuccess === 'string') {
                    this.handlePostToClient();
                } else {
                    this.onSuccess(event.data.connectionID, this.#currentlyConnectingInfo);
                }
            }
        }
        if (!event.data.success) {
            this.onError('error');
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
            console.log(initConnectResponse);
        } catch (e) {}
    };

    createConnection = async (name: string, formBody: ConnectionData, authType: string) => {
        try {
            const connectResponse = await this.#hubsClient.createConnection(this.orgId, {
                appId: this.#currentlyConnectingInfo.appId,
                authType,
                data: formBody,
                name: name,
            });
            if (typeof this.onSuccess === 'string') {
                this.handlePostToClient();
            } else {
                this.onSuccess(connectResponse, this.#currentlyConnectingInfo);
            }
        } catch (e) {
            this.onError('error');
        }
        this.removeVersoriSDKModal();
    };

    removeVersoriSDKModal = () => {
        const modal = document.querySelector('.v-hubs-sdk-modal');
        if (modal) {
            modal.remove();
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
        apiKeyWrapper.classList.add('v-hubs-sdk-api-key-input-wrapper');
        const apiKeyNameWrapper = document.createElement('div');
        apiKeyNameWrapper.classList.add('v-hubs-sdk-api-key-input-wrapper');

        // Create input for api key
        const apiKeyInput = document.createElement('input');
        apiKeyInput.setAttribute('required', '');
        apiKeyInput.classList.add('v-hubs-sdk-api-key-input');
        apiKeyInput.setAttribute('type', 'text');
        apiKeyInput.setAttribute('name', 'API Key Name');
        apiKeyInput.setAttribute('placeholder', 'API Key Name');

        // Create input for api key name
        const apiKeyNameInput = document.createElement('input');
        apiKeyNameInput.setAttribute('required', '');
        apiKeyNameInput.setAttribute('type', 'text');
        apiKeyNameInput.setAttribute('name', 'API Key');
        apiKeyNameInput.setAttribute('placeholder', 'API Key');
        apiKeyNameInput.classList.add('v-hubs-sdk-api-key-input');

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
            'Connect OAuth2 (client_credentials)',
            'Add credentials to connect using OAuth2'
        );

        const form = document.createElement('form');
        form.setAttribute('action', '#');
        form.classList.add('v-hubs-sdk-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const name = formData.get('Name') as string;
            const clientId = formData.get('Client ID');
            const clientSecret = formData.get('Client Secret');
            const formBody = {
                clientId: clientId,
                clientSecret: clientSecret,
                // additionalParameters: [],
                // issueToken: false,
            } as ConnectionDataOAuth2ClientCredentials;
            this.createConnection(name, formBody, 'clientCredentials');
        });

        // Create div to wrap all inputs and buttons
        const formInputWrapper = document.createElement('div');
        formInputWrapper.classList.add('v-hubs-sdk-form-input-wrapper');

        // Create input wrapper
        const apiKeyWrapper = document.createElement('div');
        apiKeyWrapper.classList.add('v-hubs-sdk-api-key-input-wrapper');
        const apiKeyNameWrapper = document.createElement('div');
        apiKeyNameWrapper.classList.add('v-hubs-sdk-api-key-input-wrapper');

        // Create input for name
        const name = document.createElement('input');
        name.setAttribute('required', '');
        name.classList.add('v-hubs-sdk-api-key-input');
        name.setAttribute('type', 'text');
        name.setAttribute('name', 'Name');
        name.setAttribute('placeholder', 'Name');

        // Create input for client ID
        const clientIdInput = document.createElement('input');
        clientIdInput.setAttribute('required', '');
        clientIdInput.setAttribute('type', 'text');
        clientIdInput.setAttribute('name', 'Client ID');
        clientIdInput.setAttribute('placeholder', 'Client ID');
        clientIdInput.classList.add('v-hubs-sdk-api-key-input');

        // Create input for client secret
        const clientSecretInput = document.createElement('input');
        clientSecretInput.setAttribute('required', '');
        clientSecretInput.setAttribute('type', 'text');
        clientSecretInput.setAttribute('name', 'Client ID');
        clientSecretInput.setAttribute('placeholder', 'Client ID');
        clientSecretInput.classList.add('v-hubs-sdk-api-key-input');

        // Append to wrapper
        apiKeyWrapper.appendChild(name);
        apiKeyWrapper.appendChild(clientIdInput);
        apiKeyNameWrapper.appendChild(clientSecretInput);

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
        const apiKeyWrapper = document.createElement('div');
        apiKeyWrapper.classList.add('v-hubs-sdk-api-key-input-wrapper');
        const apiKeyNameWrapper = document.createElement('div');
        apiKeyNameWrapper.classList.add('v-hubs-sdk-api-key-input-wrapper');

        // Create input for user
        const user = document.createElement('input');
        user.setAttribute('required', '');
        user.classList.add('v-hubs-sdk-api-key-input');
        user.setAttribute('type', 'text');
        user.setAttribute('name', 'User');
        user.setAttribute('placeholder', 'User');

        // Create input for password
        const password = document.createElement('input');
        password.setAttribute('required', '');
        password.setAttribute('type', 'text');
        password.setAttribute('name', 'Password');
        password.setAttribute('placeholder', 'Password');
        password.classList.add('v-hubs-sdk-api-key-input');

        // Append to wrapper
        apiKeyWrapper.appendChild(user);
        apiKeyWrapper.appendChild(password);

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
}
