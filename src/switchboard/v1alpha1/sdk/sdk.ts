import { Client } from '../client';
import type { Connection } from '../schemas';
import '../styles/styles.css';
import { mock } from './mockIntegrationResponse';

declare global {
    interface Window {
        Versori: any;
    }
}

const BASE_PATH = 'http://127.0.0.1:8080/v1alpha1';

// Click connect, authorise, get credential token, pass to their backend, they save it and then send us the userId and credential Id. We therefore know thereafter what the credential Id is for that user.

type initHubsParams = {
    userId: string;
    orgId: string;
    onSuccess: (connection: Connection) => void;
    onError: () => void;
};

export const VersoriSDK = {
    currentlyConnectingApp: '',
    initHubs: async ({ orgId, userId, onSuccess, onError }: initHubsParams) => {
        const buttons = document.querySelectorAll('button[data-vhubsboardid]');
        buttons.forEach((button) => {
            button.addEventListener('click', VersoriSDK.getAppAndOpenModal);
        });
        const client = new Client({
            baseUrl: BASE_PATH,
        });

        (window as any)['Versori'] = {
            client: client.hubs,
            userId: userId,
            orgId: orgId,
            onSuccess: onSuccess,
            onError: onError,
        };

        try {
            const hubs = await VersoriSDK.getHubs(orgId);
            const boards = await VersoriSDK.getAllBoards(orgId, hubs);
            const boardItems = boards.reduce((acc, board) => {
                return [...acc, ...board.items];
            }, []);
            console.log(boardItems);
        } catch (e) {
            console.log(e);
        }

        // const hubs = await window.Versori.client.listHubs(orgId);
        // const apps = await window.Versori.client.getConnectedApps(orgId);
        // console.log(hubs);
        // // console.log(integrations);
        // console.log(apps);
    },
    removeVersoriSDKModal: () => {
        const modal = document.querySelector('.v-hubs-sdk-modal');
        if (modal) {
            modal.remove();
        }
    },
    getAppAndOpenModal: (e: Event) => {
        e.preventDefault();
        const el = e.target as HTMLButtonElement;
        // const integrations = await window.Versori.client.getHubIntegrations(
        //     window.Versori.orgId,
        //     el.dataset.vhubid,
        //     el.dataset.vhubsboardid
        // );
        const integration = mock.connections.find((integration) => integration.requiresUserAuth)!;
        VersoriSDK.currentlyConnectingApp = integration.id;
        const currentConnectionType = integration?.authConfig.authType;
        if (currentConnectionType === 'apikey') {
            VersoriSDK.renderVersoriSDKModal(el.dataset.vhubsboardid!);
        } else {
            // render oauth modal
        }
    },
    getHubs: async (orgId: string) => {
        try {
            const hubs = await window.Versori.client.listHubs(orgId);
            return hubs;
        } catch (e) {
            console.log(e);
        }
    },
    getAllBoards: (orgId: string, hubs: any) => {
        const promises = hubs.items.map((hub: any) => {
            return window.Versori.client.listHubBoards(orgId, hub.id);
        });
        return Promise.all(promises);
    },
    connect: async (form: HTMLFormElement) => {
        const formData = new FormData(form);
        const apiKeyName = formData.get('API Key Name');
        const apiKey = formData.get('API Key');
        const formBody = {
            name: apiKeyName,
            appId: VersoriSDK.currentlyConnectingApp,
            authType: 'apiKey',
            data: {
                apiKey: apiKey,
            },
        };
        const connectResponse = await window.Versori.client.connect(window.Versori.orgId, formBody);
        console.log(connectResponse);
        window.Versori.onSuccess(connectResponse);
        VersoriSDK.removeVersoriSDKModal();
    },
    renderVersoriSDKModal: (boardId: string) => {
        console.log(boardId);
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
        modalTitle.innerText = 'Connect API Key';

        // Add paragraph for description
        const modalDescription = document.createElement('p');
        modalDescription.classList.add('v-hubs-sdk-modal-description');
        modalDescription.innerText = 'Add credentials to connect using API Key';

        // Add close button
        const modalClose = document.createElement('button');
        modalClose.classList.add('v-hubs-sdk-modal-close');
        modalClose.setAttribute('type', 'button');
        modalClose.innerText = 'X';
        modalClose.addEventListener('click', VersoriSDK.removeVersoriSDKModal);

        // Append all elements to header
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(modalDescription);
        modalHeader.appendChild(modalClose);
        modalContent.appendChild(modalHeader);

        const form = document.createElement('form');
        form.setAttribute('action', '#');
        form.classList.add('v-hubs-sdk-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            VersoriSDK.connect(form);
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
        cancelButton.addEventListener('click', VersoriSDK.removeVersoriSDKModal);

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
    },
};
