import * as yup from 'yup';
import {
    AuthSchemeConfig,
    CredentialDataBasicAuth,
    CredentialDataBinary,
    CredentialDataNone,
    CredentialDataOAuth2Client,
    CredentialDataOAuth2Code,
    CredentialDataOAuth2Password,
    CredentialDataOAuth2Token,
    CredentialDataString,
    CredentialType,
} from '@versori/sdk/platform';

type CredentialDataEnumeration = {
    none: { none: CredentialDataNone };
    string: { string: CredentialDataString };
    binary: { binary: CredentialDataBinary };
    'basic-auth': { basicAuth: CredentialDataBasicAuth };
    'oauth2-client': { oauth2Client: CredentialDataOAuth2Client };
    'oauth2-code': { oauth2Code: CredentialDataOAuth2Code };
    'oauth2-password': { oauth2Password: CredentialDataOAuth2Password };
    'oauth2-token': { oauth2Token: CredentialDataOAuth2Token };
    // These aren't implemented yet
    'custom-function': never;
    oauth1: never;
    'jwt-bearer': never;
    certificate: never;
};

export type CredentialData<T extends CredentialType> = CredentialDataEnumeration[T];

export type CredentialDataProps<T extends CredentialType> = {
    id: string;
    name: string;
    systemId?: string;
    authSchemeConfig: AuthSchemeConfig;
    data: CredentialData<T>;
    onDataChange: (credential: CredentialData<T>) => void;
    errors?: yup.ValidationError[];
};
