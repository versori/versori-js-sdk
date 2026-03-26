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
                    response: Response | undefined,
                    request: Request,
                    opts: { throwOnError?: boolean }
                ) => unknown | Promise<unknown>
            ) => unknown;
        };
    };
};
