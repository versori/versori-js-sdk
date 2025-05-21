import isObject from 'lodash/isObject';

/**
 * PostMessageOAuth2Hello is used to initiate the OAuth2Callback page to respond
 * with the authorization_code response.
 *
 * This message should be periodically sent from the parent window to the
 * popup/oauth2 window. When the popup opens, it will be on an external domain
 * for the Connector's OAuth 2.0 login page. Once the page redirects back to
 * Versori, it will wait for this message to be sent, validate the payload, and
 * respond back to the parent window with the PostMessageOAuth2Response event.
 */
export type PostMessageOAuth2Hello = {
    type: 'hello';
    payload: {
        state: string;
    };
};

export function isPostMessageOAuth2Hello(message: unknown): message is PostMessageOAuth2Hello {
    if (!isObject(message)) {
        return false;
    }

    if (!('type' in message && message.type === 'hello')) {
        return false;
    }

    if (!('payload' in message && isObject(message.payload))) {
        return false;
    }

    return 'state' in message.payload && typeof message.payload.state === 'string';
}

export type PostMessageOAuth2Response = {
    type: 'response';
    payload: {
        /**
         * search is the search string of the URL which was redirected to after
         * the OAuth2 login page and can be parsed with `new URLSearchParams(search)`.
         *
         * In case of not using URLSearchParams, the search string is formatted as
         * documented by `window.location.search`.
         */
        search: string;
    };
};

export function isPostMessageOAuth2Response(message: unknown): message is PostMessageOAuth2Response {
    if (!isObject(message)) {
        return false;
    }

    if (!('type' in message && message.type === 'response')) {
        return false;
    }

    if (!('payload' in message && isObject(message.payload))) {
        return false;
    }

    return 'search' in message.payload && typeof message.payload.search === 'string';
}
