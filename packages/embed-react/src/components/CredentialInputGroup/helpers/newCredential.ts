import {
    AuthSchemeConfig,
    AuthSchemeConfigOAuth2,
    CredentialCreate,
    CredentialDataBasicAuth,
    CredentialDataBinary,
    CredentialDataNone,
    CredentialDataOAuth2Client,
    CredentialDataOAuth2Password,
    CredentialDataOAuth2Token,
    CredentialDataString,
} from '@versori/sdk/embedded';

import createDebug from 'debug';

const debug = createDebug('versori:embed:newCredential');

function newCredentialForOAuth2(cfg: AuthSchemeConfigOAuth2): CredentialCreate {
    const { grant } = cfg;

    switch (grant.grantType) {
        case 'client_credentials':
            return {
                name: '(Client Credentials)',
                type: 'oauth2-client',
                data: {
                    clientId: '',
                    clientSecret: '',
                    scopes: cfg.scopes.map((s) => s.name),
                    authorizeUrl: '',
                    tokenUrl: cfg.tokenUrl,
                } as CredentialDataOAuth2Client,
            };
        case 'password':
            return {
                name: '(OAuth2 Password)',
                type: 'oauth2-password',
                data: {
                    username: '',
                    password: '',
                } as CredentialDataOAuth2Password,
            };
        case 'authorization_code':
            // these object is not actually used directly, but is here to be type-safe. The UI will render an
            // "Authorize" button if this grant type is used which will launch the OAuth 2.0 authorization flow.
            return {
                name: '(Authorization Code)',
                type: 'oauth2-code',
                data: {
                    clientId: grant.clientId,
                    clientSecret: grant.clientSecret,
                    scopes: cfg.scopes.map((s) => s.name),
                    authorizeUrl: cfg.authorizeUrl,
                    tokenUrl: cfg.tokenUrl,
                } as CredentialDataOAuth2Token,
            };
        default:
            debug('WARN: newCredentialForOAuth2: Unsupported grant type', grant);

            throw new Error('Invalid OAuth 2.0 configuration');
    }
}

export function newCredentialCreate(cfg: AuthSchemeConfig): CredentialCreate {
    switch (cfg.schemeType) {
        case 'basic-auth':
            return {
                type: 'basic-auth',
                name: '(Basic Auth)',
                data: {
                    username: '',
                    password: '',
                } as CredentialDataBasicAuth,
            };
        case 'api-key':
            return {
                type: 'string',
                name: '(API Key)',
                data: {
                    value: '',
                } as CredentialDataString,
            };
        case 'oauth2':
            return newCredentialForOAuth2(cfg);
        case 'hmac':
            return {
                name: '(HMAC)',
                // TODO: need to figure out whether to handle HMAC secrets as binary or string
                type: 'binary',
                data: {
                    valueBase64: '',
                } as CredentialDataBinary,
            };
        case 'none':
            return {
                name: '(None)',
                type: 'none',
                data: {} as CredentialDataNone,
            };
        default:
            debug('WARN: newCredentialForConfig: Unsupported scheme type', cfg);

            throw new Error('Invalid auth scheme configuration');
    }
}
