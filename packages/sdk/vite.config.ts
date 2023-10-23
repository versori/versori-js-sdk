// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        dts({
            insertTypesEntry: true,
        }),
    ],
    build: {
        target: 'modules',
        lib: {
            name: '@versori/sdk',
            entry: path.resolve(__dirname, '../../src/sdk.ts'),
            formats: ['es', 'umd'],
            fileName: 'index',
        },
        rollupOptions: {
            treeshake: 'safest',
            external: [],
        },
    },
});
