import { HubsClient, UsersClient } from '../client';
import { openOAuthWindow } from '../utilities';
import type {
    Connection,
    ConnectionDataOAuth2ClientCredentials,
    ConnectionDataAPIKey,
    ConnectionDataHTTPBasicAuth,
    AppAuthConfigOAuth2,
} from '../schemas';
import '../styles/styles.css';
import { mock } from './mockIntegrationResponse';

declare global {
    interface Window {
        Versori: any;
    }
}

export type ConnectionData =
    | ConnectionDataOAuth2ClientCredentials
    | ConnectionDataAPIKey
    // | ConnectionDataHTTPRefresh
    // | ConnectionDataDatabase
    | ConnectionDataHTTPBasicAuth;

type modals = {
    [key: string]: () => void;
};

const BASE_PATH = 'http://127.0.0.1:8080/v1alpha1';
const USERS_PATH = 'http://localhost:8889/v1';

// Click connect, authorise, get credential token, pass to their backend, they save it and then send us the userId and credential Id. We therefore know thereafter what the credential Id is for that user.

type initHubsParams = {
    userId: string;
    orgId: string;
    onSuccess: (connection: any) => void;
    onError: () => void;
};

class Versori {
    userId: string;
    orgId: string;
    onSuccess: (connection: any) => void;
    onError: () => void;

    #currentlyConnectingApp = '';

    constructor({ userId, orgId, onSuccess, onError }: initHubsParams) {
        this.userId = userId;
        this.orgId = orgId;
        this.onError = onError;
        this.onSuccess = onSuccess;
        this.initialise();
    }

    initialise = async () => {
        this.attachEventListeners();

        const usersClient = new UsersClient({
            baseUrl: USERS_PATH,
        });

        const hubsClient = new HubsClient({
            baseUrl: BASE_PATH,
        });

        (window as any)['Versori'] = {
            client: hubsClient.hubs,
            users: usersClient.users,
            userId: this.userId,
            orgId: this.orgId,
            onSuccess: this.onSuccess,
            onError: this.onError,
        };
        // const connections = await window.Versori.client.getConnections(this.orgId);
        // const connectedApps = await window.Versori.client.getConnectedApps(this.orgId);
        this.setConnectedApps();
        // console.log(connections, connectedApps);
    };

    setConnectedApps = async () => {
        const buttons = document.querySelectorAll('button[data-vhubsboardid]') as NodeListOf<HTMLElement>;
        for (const button of buttons) {
            const usersHubs = await window.Versori.client.getUsersHubBoards(
                this.orgId,
                button.dataset.vhubid,
                this.userId
            );
            console.log(usersHubs);
            const connection = usersHubs.find((board: any) => board.id === button.dataset.vhubsboardid);
            if (connection) {
                button.setAttribute('data-connected', 'true');
            }
        }
    };

    attachEventListeners = () => {
        const buttons = document.querySelectorAll('button[data-vhubsboardid]');
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

    getAppAndOpenModal = async (e: Event) => {
        e.preventDefault();
        // const el = e.target as HTMLButtonElement;
        // const integrations = await window.Versori.client.getHubIntegrations(
        //     window.Versori.orgId,
        //     el.dataset.vhubid,
        //     el.dataset.vhubsboardid
        // );
        const integration = mock.connections.find((integration) => integration.requiresUserAuth)!;
        this.#currentlyConnectingApp = integration.id;
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
            // handleCancelConnection();
            // addToast({
            //     title: 'Unsupported auth method',
            //     variant: 'error',
            // });
        }
    };

    handleSuccessfulConnection = async (event: MessageEvent) => {
        console.log('connected', event);
        this.onSuccess('connected');
        this.createUser();
    };

    createUser = async () => {
        const createdUser = await window.Versori.users.createUser(
            this.orgId,
            '01HARZ9Z72NGZMY0T9613VGJEV',
            '01HCD7BMSPVVYRXDGK9963PVP6',
            this.userId,
            {
                id: this.userId,
            }
        );
        console.log(createdUser);
    };

    handleOauthConnect = async () => {
        try {
            const initConnectResponse = await window.Versori.client.initConnect(this.orgId, {
                appId: this.#currentlyConnectingApp,
                authType: 'oauth2',
            });
            if (initConnectResponse?.action?.redirect?.url) {
                // setShowConnectionOverlay(true);

                // Open the window - width and height ensures it is its own pop up window
                openOAuthWindow({
                    url: `${initConnectResponse.action.redirect.url}&prompt=login`,
                    title: 'Switchboard Connect',
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
            const connectResponse = await window.Versori.client.connect(this.orgId, {
                appId: this.#currentlyConnectingApp,
                authType,
                data: formBody,
                name: name,
            });
            this.onSuccess(connectResponse);
            this.createUser();
        } catch (e) {
            this.onError();
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
            const password = formData.get('Password');
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
        user.setAttribute('user', 'User');
        user.setAttribute('placeholder', 'User');

        // Create input for password
        const password = document.createElement('input');
        password.setAttribute('required', '');
        password.setAttribute('type', 'text');
        password.setAttribute('name', 'Paswword');
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

export const VersoriSDK = {
    initHubs: async ({ orgId, userId, onSuccess, onError }: initHubsParams) => {
        new Versori({ orgId, userId, onSuccess, onError });
    },
};
