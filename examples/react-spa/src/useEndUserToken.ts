import invariant from 'invariant';
import { importPKCS8, SignJWT } from 'jose';
import { startTransition, useCallback, useEffect, useState } from 'react';

export type UseEndUserTokenHookLoading = {
    isLoading: true;
    error?: Error;
    token: string;
};

export type UseEndUserTokenHookError = {
    isLoading: false;
    error: Error;
    token: string;
};

export type UseEndUserTokenHookSuccess = {
    isLoading: false;
    error?: Error;
    token: string;
};

export type UseEndUserTokenHook = UseEndUserTokenHookLoading | UseEndUserTokenHookError | UseEndUserTokenHookSuccess;

const ISSUER = `https://versori.com/sk/${import.meta.env.VITE_END_USER_AUTH_PRIVATE_KEY_ID}`;

/**
 * Mock hook to generate an end user token using SigningKeys.
 *
 * DO NOT DO THIS IN PRODUCTION - YOUR PRIVATE KEY IS PRIVATE AND SHOULD BE USED IN A SECURE ENVIRONMENT
 *
 * @param externalId
 * @param privateKey
 */
export function useEndUserToken(externalId: string, privateKey?: string): UseEndUserTokenHook {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [token, setToken] = useState<string>('');

    const initToken = useCallback(async () => {
        if (!privateKey) {
            setIsLoading(false);

            return;
        }

        setIsLoading(true);

        try {
            const key = await importPKCS8(privateKey, 'RS256');

            const token = await new SignJWT({ sub: externalId })
                .setIssuer(ISSUER)
                .setIssuedAt()
                .setExpirationTime('1 hour')
                .setProtectedHeader({ alg: 'RS256' })
                .sign(key);

            startTransition(() => {
                setIsLoading(false);
                setToken(token);
            });

            return;
        } catch (e) {
            if (e instanceof Error) {
                setError(e);
            } else {
                setError(new Error(`An unknown error occurred: ${e}`));
            }

            setIsLoading(false);
        }
    }, [externalId, privateKey]);

    useEffect(() => {
        if (!externalId) {
            return;
        }

        initToken()
            .then(() => console.log('token initialised'))
            .catch((err) => console.error('failed to initialise token', err));
    }, [externalId, initToken]);

    if (isLoading) {
        return {
            isLoading,
            error: undefined,
            token: '',
        };
    }

    if (error) {
        return {
            isLoading: false,
            error,
            token: '',
        };
    }

    invariant(privateKey ? token : true, 'token should be defined');

    return {
        isLoading,
        error: undefined,
        token,
    };
}
