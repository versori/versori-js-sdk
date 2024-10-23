import { CredentialCreate } from '@versori/sdk/embedded';

export type GenerateAppCredentialHook = () => Promise<CredentialCreate>;

export function useGenerateAppCredential(userId: string): GenerateAppCredentialHook {
    const data = import.meta.env.VITE_PRIMARY_CREDENTIAL_DATA ? JSON.parse(import.meta.env.VITE_PRIMARY_CREDENTIAL_DATA) : {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        scopes: [],
    };

    return async () => ({
        name: `${userId}-primary`,
        type: 'oauth2-token',
        data,
    });
}
