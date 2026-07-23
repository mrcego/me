import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const OUT = '.output/public';

/** Collect executable inline <script> bodies (skip JSON-LD / Nuxt data JSON). */
function collectInlineScriptBodies(html) {
  const bodies = [];
  const re = /<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html))) {
    const attrs = match[1] || '';
    const body = match[2] || '';
    if (/\ssrc\s*=/.test(attrs)) continue;
    const typeMatch = attrs.match(/\stype\s*=\s*["']([^"']+)["']/i);
    const type = typeMatch?.[1]?.toLowerCase() || 'text/javascript';
    if (
      type.includes('ld+json') ||
      type === 'application/json' ||
      type === 'importmap' ||
      type === 'speculationrules'
    ) {
      continue;
    }
    bodies.push(body);
  }
  return bodies;
}

function walkHtmlFiles(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_nuxt' || entry.name === '_ipx' || entry.name === '_fonts') continue;
      walkHtmlFiles(path, files);
    } else if (entry.name.endsWith('.html')) {
      files.push(path);
    }
  }
  return files;
}

function sha256Base64(content) {
  return createHash('sha256').update(content, 'utf8').digest('base64');
}

function buildCsp(scriptHashes) {
  const scriptSrc = ["'self'", ...scriptHashes.map((h) => `'sha256-${h}'`)].join(' ');
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    `script-src ${scriptSrc}`,
    "connect-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'",
  ].join('; ');
}

const htmlFiles = walkHtmlFiles(OUT);
if (htmlFiles.length === 0) {
  console.error(`[write-csp-headers] No HTML under ${OUT} — run generate first`);
  process.exit(1);
}

const hashSet = new Set();
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const body of collectInlineScriptBodies(html)) {
    hashSet.add(sha256Base64(body));
  }
}

const hashes = [...hashSet];
const csp = buildCsp(hashes);

const headers = `/*
  Content-Security-Policy: ${csp}
`;

writeFileSync(join(OUT, '_headers'), headers, 'utf8');
console.log(
  `[write-csp-headers] Wrote ${join(OUT, '_headers')} with ${hashes.length} script hash(es)`,
);
for (const h of hashes) console.log(`  sha256-${h}`);
