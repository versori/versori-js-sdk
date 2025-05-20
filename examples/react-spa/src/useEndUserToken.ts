import invariant from 'invariant';
import { decodeJwt } from "jose";
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export type UseEndUserTokenHookLoading = {
    externalId: string;
    error?: Error;
    token: string;
};

export type UseEndUserTokenHookError = {
    externalId: string;
    error: Error;
    token: string;
};

export type UseEndUserTokenHookSuccess = {
    externalId: string;
    error?: Error;
    token: string;
};

export type UseEndUserTokenHook = UseEndUserTokenHookLoading | UseEndUserTokenHookError | UseEndUserTokenHookSuccess;


/**
 * Mock hook to generate an end user token using SigningKeys.
 *
 * DO NOT DO THIS IN PRODUCTION - YOUR PRIVATE KEY IS PRIVATE AND SHOULD BE USED IN A SECURE ENVIRONMENT
 *
 * @param privateKey
 */
export function useEndUserToken(privateKey?: string): UseEndUserTokenHook {
    const [externalId, setExternalId] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [error, setError] = useState<Error | undefined>(undefined);
    const userJwt = Cookies.get("versori-user-jwt");

    useEffect(() => {
        if (!userJwt) {
            setError(new Error('userJwt not found'))
            return;
        }

        setToken(userJwt);
        if (!externalId) {
            const claims = decodeJwt(userJwt);
            setExternalId(claims.sub ?? '');
        }

    }, [externalId, userJwt]);

    invariant(privateKey ? token : true, 'token should be defined');

    return {
        externalId,
        error,
        token,
    };
}
