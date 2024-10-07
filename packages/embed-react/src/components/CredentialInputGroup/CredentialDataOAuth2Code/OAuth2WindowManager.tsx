import { Button, Dialog, Flex, IconButton, Text } from '@radix-ui/themes';
import createDebug from 'debug';
import { SyntheticEvent, useCallback, useEffect, useRef } from 'react';
import CloseIcon from '../../../assets/close-icon.svg';
import { openCenteredPopupWindow } from '../../../utils/openCenteredPopupWindow';

const debug = createDebug('versori:embed:OAuth2WindowManager');

export type OAuth2Error = {
    /**
     * Error should be one of the following error codes, but some implementations may
     * stray from the standards:
     *  invalid_request, unauthorized_client, access_denied, unsupported_response_type,
     *  invalid_scope, server_error, temporarily_unavailable, invalid_client, invalid_grant,
     *  interaction_required, login_required, account_selection_required, consent_required,
     *  invalid_request_uri, invalid_request_object, request_not_supported,
     *  request_uri_not_supported, registration_not_supported.
     *
     * More details of available error codes can be found in the OAuth2 specification
     * and OpenID Connect Core specification.
     * - https://openid.net/specs/openid-connect-core-1_0.html#AuthError
     * - https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.2.1
     */
    error: string;
    error_description?: string | null;
    error_uri?: string | null;
};

export type OAuth2WindowManagerProps = {
    open: boolean;
    channelId: string;
    url: string;

    onSuccess: (code: string, state: string) => void;
    onError: (info: OAuth2Error, state: string) => void;
    onCancel: () => void;
};

/**
 * OAuth2WindowManager is responsible for opening and closing the OAuth2 Authorization
 * Code flow window and handling the communication between the window and the
 * parent window.
 *
 * @constructor
 */
export function OAuth2WindowManager({ open, channelId, url, onSuccess, onError, onCancel }: OAuth2WindowManagerProps) {
    const windowRef = useRef<Window | null | undefined>(null);

    useEffect(() => {
        if (!open) {
            return () => {};
        }

        debug('initiating authorization_code flow', url);

        const state = new URL(url).searchParams.get('state');

        const sessionKey = `oauth2-state-${state}`;

        sessionStorage.setItem(sessionKey, channelId);

        const channel = new BroadcastChannel(channelId);

        channel.onmessage = (event) => {
            debug('received message');

            if (typeof event.data !== 'string') {
                debug('ERROR: received message is not a string', event.data);

                onError({ error: 'internal' }, '');

                return;
            }

            const params = new URLSearchParams(event.data);

            if (params.has('error')) {
                onError(
                    {
                        error: params.get('error')!,
                        error_description: params.get('error_description'),
                        error_uri: params.get('error_uri'),
                    },
                    params.get('state') ?? ''
                );

                return;
            }

            if (!params.has('code')) {
                debug('ERROR: missing code in response', event.data);

                onError({ error: 'internal' }, '');

                return;
            }

            onSuccess(params.get('code')!, params.get('state')!);
        };

        debug('opening authorize window', url);

        windowRef.current = openCenteredPopupWindow({
            url: url,
            title: '_blank',
            width: 800,
            height: 600,
        });

        return () => {
            debug('closing channel');
            channel.close();
            sessionStorage.removeItem(sessionKey);
        };
    }, [channelId, onError, onSuccess, open, url]);

    const onFocusWindow = useCallback((e: SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault();

        windowRef.current?.focus();
    }, []);

    const onOpenChange = useCallback(
        (open: boolean) => {
            if (open) {
                return;
            }

            onCancel();
        },
        [onCancel]
    );

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content size="1" maxWidth="300px">
                <Flex justify="end">
                    <IconButton variant="ghost" onClick={onCancel}>
                        <CloseIcon />
                    </IconButton>
                </Flex>
                <Dialog.Title>Connecting</Dialog.Title>
                <Dialog.Description>Login to the external system via the popup window.</Dialog.Description>

                <Text>
                    Can't see it? Click{' '}
                    <Button onClick={onFocusWindow} variant="ghost">
                        here
                    </Button>{' '}
                    to bring it to the front
                </Text>
            </Dialog.Content>
        </Dialog.Root>
    );
}
