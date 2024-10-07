import { Error as ConnectError } from '../connect';
import { Error as EmbeddedError } from '../embedded';

export type ErrorType = EmbeddedError | ConnectError;

export function isErrorType(error: unknown): error is ErrorType {
    if (!error || typeof error !== 'object') {
        return false;
    }

    return 'code' in error && typeof error.code === 'string' && 'message' in error && typeof error.message === 'string';
}

export class ApiError extends Error {
    public readonly request: Request;
    public readonly response: Response;
    public readonly error: ErrorType;

    constructor(message: string, request: Request, response: Response, error: ErrorType) {
        super(message);

        this.request = request;
        this.response = response;
        this.error = error;
    }
}
