import { Client } from '@hey-api/client-fetch';
import { SdkConfig } from '@versori/sdk';
import { PlatformClientOptions } from '../PlatformClient';
import { CredentialSource } from './credential-source';
import { EndUserAuth } from './end-user-auth';

export type InitOptions = {
    /**
     * endUserAuth defines how the SDK should authenticate the end-user with Versori.
     */
    endUserAuth: EndUserAuth;

    /**
     * primaryCredential defines how the SDK should retrieve the user's credential to authenticate
     * with your own system. This information is used to create a connection within Versori so that
     * the integrations can interact with your system on behalf of the user.
     */
    primaryCredential: CredentialSource;

    /**
     * orgId is the unique identifier of the Organisation which owns the integrations, this can be found from
     * the Versori platform.
     */
    orgId: string;

    /**
     * sdkOptions allows configuring the underlying SDK that is used to communicate to Versori APIs.
     */
    sdkOptions?: Omit<SdkConfig, 'auth'>;

    /**
     * overrideClient can be defined to prevent the use of the default global client. If set to true,
     * a new client will be created, or a custom client can be provided.
     */
    overrideClient?: boolean | Client;

    clientOptions?: PlatformClientOptions;
};
