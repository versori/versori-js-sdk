import { SdkAuth } from '@versori/sdk';
import { EndUserAuthSigningKeyJwt } from "../types";

export function parseEndUserAuth(auth: EndUserAuthSigningKeyJwt): SdkAuth {
    return {
        type: 'api-key',
        token: auth.token,
        location: {
            in: 'header',
            name: 'Authorization',
            prefix: 'JWT',
        },
    }

}
