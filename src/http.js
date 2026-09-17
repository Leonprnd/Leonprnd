// De webserver: levert de schermen uit public/ en de API uit src/api.js.

import http from 'node:http';
import path from 'node:path';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { handleApi } from './api.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PUBLIC_DIR = path.join(ROOT, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
};

export function createServer(store) {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    if (url.pathname.startsWith('/api/')) {
      return handleApi(req, res, url, store);
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      return res.end();
    }
    if (url.pathname.startsWith('/uploads/')) {
      return serveFile(res, store.uploadsDir, url.pathname.slice('/uploads/'.length));
    }
    const relative = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    return serveFile(res, PUBLIC_DIR, relative, 'index.html');
  });
}

async function serveFile(res, baseDir, relative, fallback) {
  const target = path.join(baseDir, path.normalize(decodeURIComponent(relative)));
  if (!target.startsWith(baseDir)) {
    res.writeHead(403).end('Verboden');
    return;
  }
  try {
    const info = await stat(target);
    if (info.isDirectory()) throw Object.assign(new Error('map'), { code: 'ENOENT' });
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(target).toLowerCase()] || 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-cache',
    });
    createReadStream(target).pipe(res);
  } catch {
    if (fallback && !path.extname(relative)) return serveFile(res, baseDir, fallback);
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Niet gevonden');
  }
}
