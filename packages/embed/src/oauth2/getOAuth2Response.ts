import createDebug from 'debug';
import { isPostMessageOAuth2Response, PostMessageOAuth2Hello, PostMessageOAuth2Response } from './types';

export type OAuth2ResponseSuccess = {
    code: string;
    state: string;

    additionalParams?: string;
};

export type OAuth2ResponseError = {
    error: string;
    error_description?: string;
    error_uri?: string;

    additionalParams?: string;
};

export type OAuth2Response = OAuth2ResponseSuccess | OAuth2ResponseError;

export type GetOAuth2ResponseOptions = {
    target: string;
    pollMs: number;
};

const DEFAULT_OPTIONS: GetOAuth2ResponseOptions = {
    target: 'https://platform.versori.com',
    pollMs: 500,
};

const debug = createDebug('versori:embed:getOAuth2Response');

export async function getOAuth2Response(
    child: Window,
    state: string,
    opts: Partial<GetOAuth2ResponseOptions> = {}
): Promise<OAuth2Response> {
    const { target, pollMs } = { ...DEFAULT_OPTIONS, ...opts };

    const hello: PostMessageOAuth2Hello = {
        type: 'hello',
        payload: {
            state,
        },
    };

    let interval: NodeJS.Timeout;

    const response = await new Promise<PostMessageOAuth2Response>((resolve) => {
        const onEvent = (event: MessageEvent) => {
            if (event.origin !== target) {
                debug('received postMessage event from unexpected origin', event);

                return;
            }

            if (!isPostMessageOAuth2Response(event.data)) {
                debug('received unexpected postMessage event from expected origin', event);

                return;
            }

            window.removeEventListener('message', onEvent);

            clearInterval(interval);

            resolve(event.data);
        };

        window.addEventListener('message', onEvent);

        interval = setInterval(() => {
            child.postMessage(hello, target);
        }, pollMs);
    });

    const params = new URLSearchParams(response.payload.search);

    if (params.has('error')) {
        const error = params.get('error')!;
        params.delete('error');

        const error_description = params.get('error_description') ?? undefined;
        params.delete('error_description');

        const error_uri = params.get('error_uri') ?? undefined;
        params.delete('error_uri');

        return {
            error,
            error_description,
            error_uri,
            additionalParams: params.size > 0 ? params.toString() : undefined,
        };
    }

    if (!params.has('code')) {
        throw new Error('invalid response, missing code or error');
    }

    if (!params.has('state')) {
        throw new Error('invalid response, missing state');
    }

    const code = params.get('code')!;
    params.delete('code');

    const receivedState = params.get('state')!;
    params.delete('state');

    return {
        code,
        state: receivedState,
        additionalParams: params.size > 0 ? params.toString() : undefined,
    };
}
