import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';



// Use process.cwd() so root follows the symlinked working dir (C:\\dev\\pm)
// rather than the realpath of __dirname (which contains Unicode).
let projectRoot = process.cwd();
if (projectRoot.length > 2 && projectRoot[1] === ':') {
    projectRoot = projectRoot[0].toUpperCase() + projectRoot.slice(1);
}

// Test config is in `vitest.config.ts` to avoid type clashes between
// vitest's bundled vite and the top-level @vitejs/plugin-react plugin.
export default defineConfig({
    root: projectRoot,
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: [
            { find: '@', replacement: path.resolve(projectRoot, './src') }
        ],
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: false,
        fs: {
            // Allow serving files outside the symlinked root (real Windows path with Unicode)
            allow: [
                projectRoot,
                path.resolve(projectRoot, '../..'),
            ],
        },
    },
    preview: {
        host: '0.0.0.0',
        port: 4173,
        strictPort: false,
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        target: 'es2022',
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'xlsx-vendor': ['xlsx'],
                    'motion-vendor': ['motion', 'framer-motion'],
                },
            },
        },
    },

});
