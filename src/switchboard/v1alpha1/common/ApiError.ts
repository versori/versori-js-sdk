import { Error as SwitchboardError } from '../schemas';

export class ApiError extends Error {
    readonly response: Response;
    readonly body: SwitchboardError;

    constructor(response: Response, body: SwitchboardError) {
        super(response.statusText);

        this.response = response;
        this.body = body;
    }
}
