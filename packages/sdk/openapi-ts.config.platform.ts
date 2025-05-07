import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
    client: "@hey-api/client-fetch",
    input: "src/platform/v2/platform-v2-openapi.yaml",
    output: "src/platform/v2/generated",
    schemas: false,
})