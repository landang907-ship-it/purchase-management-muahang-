import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// Vitest config — kept separate from `vite.config.ts` because
// `vitest/config` re-exports its own (older) bundled Vite types, which
// clash with the top-level `@vitejs/plugin-react` that the project uses.
// Run with: `npx vitest` or `npm test`.
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
        css: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'json'],
            exclude: ['node_modules/', 'dist/', 'src/test/', '**/*.d.ts'],
        },
    },
});
