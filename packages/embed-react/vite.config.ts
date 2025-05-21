// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        dts({
            insertTypesEntry: true,
            rollupTypes: true,
            tsconfigPath: path.resolve(__dirname, 'tsconfig.build.json'),
        }),
        svgr({
            include: '**/*.svg',
        }),
    ],
    build: {
        target: 'modules',
        lib: {
            name: '@versori/embed-react',
            entry: path.resolve(__dirname, 'src/index.ts'),
            formats: ['es', 'umd'],
            fileName: 'index',
        },
        sourcemap: true,
        rollupOptions: {
            treeshake: 'safest',
            external: ['react', '@radix-ui/themes'],
            output: {
                globals: {
                    react: 'React',
                    '@radix-ui/themes': 'RadixThemes',
                },
            },
        },
    },
});
