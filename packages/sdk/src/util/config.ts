import type { Config as FetchConfig } from '@hey-api/client-fetch';
import { ErrorType } from '../error';

export const Production = 'https://platform.versori.com/api' as const;

export type SdkAuthApiKeyLocation = {
    /**
     * in defines where the API key should be sent in the request, "header" is currently the only supported value.
     */
    in: 'header';

    /**
     * name defines the name of the header or query parameter to send the API key in.
     */
    name: string;

    /**
     * prefix defines the prefix to use when sending the API key in the 'Authorization' header.
     */
    prefix?: string;
};

export const DEFAULT_SDK_AUTH_API_KEY_LOCATION: SdkAuthApiKeyLocation = {
    in: 'header',
    name: 'Authorization',
    prefix: 'Bearer',
};

export type SdkAuthApiKey = {
    type: 'api-key';
    token: string;

    /**
     * location defines where the API key should be sent in the request, defaults to
     * `DEFAULT_END_USER_AUTH_API_KEY_LOCATION`.
     */
    location?: SdkAuthApiKeyLocation;
};

export type SdkAuthCookie = {
    type: 'cookie';
};

export type SdkAuth = SdkAuthApiKey | SdkAuthCookie;

export type ErrorHandlingOptions = {
    defaultError?: ErrorType;
};

export type SdkConfig = FetchConfig & {
    baseUrl?: typeof Production | string;
    auth?: SdkAuth;
    errorHandling?: ErrorHandlingOptions;
};
