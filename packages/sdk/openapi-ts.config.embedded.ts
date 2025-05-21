import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    client: '@hey-api/client-fetch',
    input: 'src/embedded/v1/embedded-v1-openapi.yaml',
    output: 'src/embedded/v1/generated',
    schemas: false,
});
