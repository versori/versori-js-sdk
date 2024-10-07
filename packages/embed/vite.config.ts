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
            rollupTypes: true,
        }),
    ],
    build: {
        target: 'modules',
        lib: {
            name: '@versori/embed',
            entry: path.resolve(__dirname, 'src/index.ts'),
            formats: ['es', 'umd'],
            fileName: 'index',
        },
        rollupOptions: {
            treeshake: 'safest',
        },
    },
});
