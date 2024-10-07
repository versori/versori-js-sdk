import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    client: '@hey-api/client-fetch',
    input: 'src/connect/v1/connect-v1-openapi.yaml',
    output: 'src/connect/v1/generated',
    schemas: false,
});
