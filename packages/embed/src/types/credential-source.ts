import { CredentialCreate } from '@versori/sdk/embedded';

/**
 * CredentialAuto is used when the application authors can provide the credential information
 * to the SDK on-demand.
 *
 * This is invisible to the user and is the preferred approach in order to provide a seamless
 * experience to the user.
 */
export type CredentialSourceFunction = {
    type: 'auto';

    /**
     * generate is a callback which provides the credential information to the SDK. This option is not supported
     * when embedding the integration hub via an iframe.
     */
    generate: () => Promise<CredentialCreate>;
};

/**
 * CredentialManual is used when the user must provide the credential information to the SDK.
 *
 * This method will result in a visible window presented to the user in order for them to provide
 * credentials to the system.
 */
export type CredentialSourceManual = {
    type: 'manual';
};

/**
 * CredentialUrl is used when the credential information may be accessed via a URL.
 *
 * This will be called via a GET request and will include an Authorization header with the same token as used when
 * communicating with Versori. The expected response is a JSON object matching the CredentialCreate type.
 */
export type CredentialSourceUrl = {
    type: 'url';
    url: string;
};

/**
 * CredentialJwtClaim is used when the credential information is stored within a JWT claim.
 *
 * This only applicable when the SDK is initialised using the `jwt` method.
 */
export type CredentialSourceJwtClaim = {
    type: 'jwt-claim';
    claimName: string;
};

/**
 * CredentialIframeFragment is used when the credential information is stored within a fragment parameter of the URL
 * used to load the iframe.
 *
 * The value of this parameter should be a JSON object with proper URL-encoding matching the payload
 * of the `CredentialCreate` type.
 */
export type CredentialSourceIframeFragment = {
    type: 'iframe';

    /**
     * fragmentName is the name of the search parameter from the fragment portion of the URL which contains the
     * credential information.
     */
    fragmentName: string;
};

export type CredentialSource =
    | CredentialSourceFunction
    | CredentialSourceManual
    | CredentialSourceUrl
    | CredentialSourceJwtClaim
    | CredentialSourceIframeFragment;
