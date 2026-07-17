/**
 * Structural type for Hey API generated clients (connect / embedded / platform).
 * Avoids coupling internal helpers to `@hey-api/client-fetch` types, which can
 * diverge from the client types emitted next to generated SDK code.
 */
export type VersoriHttpClient = {
    setConfig: (config: object) => void;
    getConfig: () => object;
    interceptors: {
        request: { use: (fn: (req: Request) => Request | Promise<Request>) => unknown };
        error: {
            use: (
                fn: (
                    error: unknown,
                    /** response may be undefined due to a network error where no response object is produced */
                    response: Response | undefined,
                    /** request may be undefined, because error may be from building the request object itself */
                    request: Request | undefined,
                    options: { throwOnError?: boolean }
                ) => unknown | Promise<unknown>
            ) => unknown;
        };
    };
};
