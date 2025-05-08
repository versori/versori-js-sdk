import { ComponentType, useCallback } from 'react';
import * as yup from 'yup';
import { CredentialDataBasicAuth } from './CredentialDataBasicAuth';
import { CredentialDataBinary } from './CredentialDataBinary';
import { CredentialDataOAuth2ClientCredentials } from './CredentialDataOAuth2ClientCredentials';
import { CredentialDataOAuth2Code } from './CredentialDataOAuth2Code';
import { CredentialDataOAuth2Password } from './CredentialDataOAuth2Password';
import { CredentialDataString } from './CredentialDataString';
import { CredentialData, CredentialDataProps } from './types';
import { AuthSchemeConfig, Credential, CredentialType } from '@versori/sdk/platform';

type CredentialDataComponentTypes = {
    [K in CredentialType]: ComponentType<CredentialDataProps<K>>;
};

const CREDENTIAL_DATA_COMPONENTS: CredentialDataComponentTypes = {
    none: () => false,
    string: CredentialDataString,
    binary: CredentialDataBinary,
    'basic-auth': CredentialDataBasicAuth,
    'oauth2-client': CredentialDataOAuth2ClientCredentials,
    'oauth2-code': CredentialDataOAuth2Code,
    'oauth2-password': CredentialDataOAuth2Password,
    'oauth2-token': () => <div>OAuth2 Token</div>,
    'oauth1': () => <div>OAuth1</div>,
    certificate: () => <div>Certificate</div>,
};

function componentForCredential<T extends CredentialType>(
    credential: Credential
): [ComponentType<CredentialDataProps<T>>, CredentialData<T>] {
    return [CREDENTIAL_DATA_COMPONENTS[credential.type as T], credential.data as CredentialData<T>];
}

export type CredentialInputGroupProps = {
    id: string;
    systemId: string;
    name: string;
    authSchemeConfig: AuthSchemeConfig;
    credential: Credential;
    errors?: yup.ValidationError[];
    onChange: (id: string, credential: Credential) => void;
};

export function CredentialInputGroup({
    id,
    systemId,
    name,
    authSchemeConfig,
    credential,
    onChange,
    errors,
}: CredentialInputGroupProps) {
    const onDataChange = useCallback(
        (data: CredentialData<CredentialType>) => onChange(id, { ...credential, data }),
        [onChange, id, credential]
    );

    const [Component, data] = componentForCredential(credential);

    return (
        <Component
            id={id}
            name={`${name}.data`}
            systemId={systemId}
            authSchemeConfig={authSchemeConfig}
            data={data}
            onDataChange={onDataChange}
            errors={errors}
        />
    );
}
