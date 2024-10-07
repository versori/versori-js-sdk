import type {
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
} from '@versori/sdk/connect';
import * as yup from 'yup';

type CredentialDataEnumeration = {
    none: CredentialDataNone;
    string: CredentialDataString;
    binary: CredentialDataBinary;
    'basic-auth': CredentialDataBasicAuth;
    'oauth2-client': CredentialDataOAuth2Client;
    'oauth2-code': CredentialDataOAuth2Code;
    'oauth2-password': CredentialDataOAuth2Password;
    'oauth2-token': CredentialDataOAuth2Token;
    // These aren't implemented yet
    'custom-function': never;
    'jwt-bearer': never;
    certificate: never;
};

export type CredentialData<T extends CredentialType> = CredentialDataEnumeration[T];

export type CredentialDataProps<T extends CredentialType> = {
    id: string;
    name: string;
    connectorId: string;
    authSchemeConfig: AuthSchemeConfig;
    data: CredentialData<T>;
    onDataChange: (credential: CredentialData<T>) => void;
    errors?: yup.ValidationError[];
};
