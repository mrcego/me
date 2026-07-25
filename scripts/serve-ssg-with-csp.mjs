/**
 * Serve `.output/public` with the Content-Security-Policy from `_headers`.
 * Plain static servers ignore Netlify `_headers`, so e2e would miss CSP/Vue boot failures.
 *
 * Usage: node scripts/serve-ssg-with-csp.mjs
 * Env: PORT (default 4173), NUXT_OUTPUT_DIR (default .output)
 */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { parseCspFromHeadersFile } from './lib/csp.mjs';

const outputRoot = process.env.NUXT_OUTPUT_DIR || '.output';
const root = join(process.cwd(), outputRoot, 'public');
const port = Number(process.env.PORT || 4173);

if (!existsSync(root)) {
  console.error(`[serve-ssg] Missing ${root} — run pnpm generate first`);
  process.exit(1);
}

const headersPath = join(root, '_headers');
const csp = existsSync(headersPath)
  ? parseCspFromHeadersFile(readFileSync(headersPath, 'utf8'))
  : null;

if (!csp) {
  console.error(`[serve-ssg] Missing CSP in ${headersPath}`);
  process.exit(1);
}

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

/**
 * @param {string} urlPath
 * @returns {string | null}
 */
function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0] || '/');
  const candidates = [];

  if (clean.endsWith('/')) {
    candidates.push(join(root, clean, 'index.html'));
  } else {
    candidates.push(join(root, clean));
    candidates.push(join(root, `${clean}.html`));
    candidates.push(join(root, clean, 'index.html'));
  }

  for (const file of candidates) {
    if (existsSync(file) && statSync(file).isFile()) return file;
  }
  return null;
}

const server = createServer((req, res) => {
  const file = resolveFile(req.url || '/');
  if (!file) {
    res.writeHead(404, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Security-Policy': csp,
    });
    res.end('Not found');
    return;
  }

  const type = mime[extname(file)] || 'application/octet-stream';
  res.writeHead(200, {
    'Content-Type': type,
    'Content-Security-Policy': csp,
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(readFileSync(file));
});

server.listen(port, '127.0.0.1', () => {
  console.log(`[serve-ssg] http://127.0.0.1:${port} (CSP from _headers)`);
});
