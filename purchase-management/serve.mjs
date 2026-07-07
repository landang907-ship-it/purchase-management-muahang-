// Tiny static file server — serves the dist/ folder
// Run from C:\dev\pm (symlink) so paths stay ASCII
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');
const PORT = 5173;

console.log('[serve] cwd =', process.cwd());
console.log('[serve] __dirname =', __dirname);
console.log('[serve] DIST =', DIST);
console.log('[serve] exists =', fs.existsSync(DIST));
console.log('[serve] files =', fs.existsSync(DIST) ? fs.readdirSync(DIST) : 'N/A');

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.map': 'application/json; charset=utf-8',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

function safeJoin(root, reqPath) {
    // strip query
    const p = decodeURIComponent(reqPath.split('?')[0]);
    const clean = path.normalize(p).replace(/^(\.\.[\/\\])+/, '');
    return path.join(root, clean);
}

const server = http.createServer((req, res) => {
    const url = req.url || '/';
    let filePath = safeJoin(DIST, url === '/' ? '/index.html' : url);
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        // SPA fallback
        filePath = path.join(DIST, 'index.html');
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    try {
        const data = fs.readFileSync(filePath);
        res.writeHead(200, {
            'Content-Type': mime,
            'Content-Length': data.length,
            'Cache-Control': 'no-store',
        });
        res.end(data);
        console.log('[serve]', req.method, url, '->', filePath, '(', data.length, 'bytes)');
    } catch (e) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error: ' + e.message);
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`[serve] listening on http://localhost:${PORT}/`);
});
