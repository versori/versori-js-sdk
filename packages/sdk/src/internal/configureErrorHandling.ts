import { ApiError, ErrorType, isErrorType } from '../error';
import { ErrorHandlingOptions } from '../util';
import type { VersoriHttpClient } from './versoriHttpClient';

const DEFAULT_ERROR_RESPONSE: ErrorType = {
    code: '500000',
    message: 'An unknown error occurred',
};

export function configureErrorHandling(client: VersoriHttpClient, errorHandlingOptions: ErrorHandlingOptions = {}) {
    client.interceptors.error.use(async (error, response, request, opts) => {
        if (!opts.throwOnError) {
            return error;
        }

        if (typeof error !== 'object') {
            return error;
        }

        const errorObj = isErrorType(error) ? error : errorHandlingOptions.defaultError || DEFAULT_ERROR_RESPONSE;

        throw new ApiError(errorObj.message, request, response ?? new Response(), errorObj);
    });
}
