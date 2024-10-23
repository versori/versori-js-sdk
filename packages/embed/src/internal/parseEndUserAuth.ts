import { SdkAuth } from '@versori/sdk';
import { EndUserAuth } from '../types';

export function parseEndUserAuth(auth: EndUserAuth): SdkAuth {
    switch (auth.type) {
        case 'api-key': {
            const { userId, ...rest } = auth;

            return rest;
        }
        case 'jwt':
            return {
                type: 'api-key',
                token: auth.token,
                location: {
                    in: 'header',
                    name: 'Authorization',
                    prefix: 'JWT',
                },
            };
        default:
            throw new Error(`Unsupported end user auth type: ${(auth as EndUserAuth).type}`);
    }
}
