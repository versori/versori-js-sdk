import { ulid } from 'ulid';
import {
    AuthSchemeConfig,
    AuthSchemeConfigOAuth2,
    CredentialDataNone,
    Credential,
} from '@versori/sdk/platform';

import createDebug from 'debug';

const debug = createDebug('versori:embed:newCredential');

function newCredentialForOAuth2(cfg: AuthSchemeConfigOAuth2, orgId: string): Credential {
    const { grant } = cfg;
    const newId = ulid();

    switch (grant.type) {
        case 'clientCredentials':
            return {
                id: newId,
                organisationId: orgId,
                name: '(Client Credentials)',
                type: 'oauth2-client',
                data: {
                    oauth2Client: {
                        clientId: '',
                        clientSecret: '',
                        scopes: cfg.scopes.map((s) => s.name),
                        tokenUrl: cfg.tokenUrl,
                    },
                },
            };
        case 'password':
            return {
                id: newId,
                organisationId: orgId,
                name: '(Password Grant)',
                type: 'oauth2-password',
                data: {
                    oauth2Password: {
                        username: '',
                        password: '',
                    },
                },
            };
        case 'authorizationCode':
            // these object is not actually used directly, but is here to be type-safe. The UI will render an
            // "Authorize" button if this grant type is used which will launch the OAuth 2.0 authorization flow.
            return {
                id: newId,
                organisationId: orgId,
                name: '(Authorization Code)',
                type: 'oauth2-code',
                data: {
                    oauth2Code: {
                        state: '',
                        code: '',
                    },
                },
            };
        default:
            debug('WARN: newCredentialForOAuth2: Unsupported grant type', grant);

            throw new Error('Invalid OAuth 2.0 configuration');
    }
}

export function newCredentialCreate(cfg: AuthSchemeConfig, orgId: string): Credential {
    const newId = ulid();

    switch (cfg.type) {
        case 'basic-auth':
            return {
                id: newId,
                organisationId: orgId,
                type: 'basic-auth',
                name: '(Basic Auth)',
                data: {
                    basicAuth: {
                        username: '',
                        password: '',
                    },
                },
            };
        case 'api-key':
            return {
                id: newId,
                organisationId: orgId,
                type: 'string',
                name: '(API Key)',
                data: {
                    string: {
                        value: '',
                    },
                },
            };
        case 'oauth2':
            if (!cfg.oauth2) {
                debug('WARN: newCredentialForConfig: OAuth2 config is missing');

                throw new Error('Invalid OAuth 2.0 configuration');
            }
            return newCredentialForOAuth2(cfg.oauth2, orgId);
        // case 'hmac':
        //     return {
        //         name: '(HMAC)',
        //         // TODO: need to figure out whether to handle HMAC secrets as binary or string
        //         type: 'binary',
        //         data: {
        //             valueBase64: '',
        //         } as CredentialDataBinary,
        //     };
        case 'none':
            return {
                id: newId,
                organisationId: orgId,
                name: '(None)',
                type: 'none',
                data: {} as CredentialDataNone,
            };
        default:
            debug('WARN: newCredentialForConfig: Unsupported scheme type', cfg);

            throw new Error('Invalid auth scheme configuration');
    }
}
