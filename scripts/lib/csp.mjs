/**
 * Shared CSP + Netlify `_headers` builders.
 * Security AND cache headers ship in `_headers` because GH Actions deploys only
 * `.output/public` (`netlify deploy --no-build --dir=...`) — `netlify.toml`
 * [[headers]] are not present in that publish tree.
 *
 * After generate, write-csp-headers.mjs hashes executable inline `<script>` bodies
 * (including `type=importmap`) so we can drop script-src 'unsafe-inline' while
 * keeping Nuxt SSG payloads and Vite entry maps, then emits Cache-Control rules
 * via `buildCacheHeaderBlocks()`.
 */

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @param {string} dir
 * @returns {Generator<string>}
 */
function* walkHtmlFiles(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      yield* walkHtmlFiles(full);
    } else if (name.endsWith('.html')) {
      yield full;
    }
  }
}

/**
 * Inline script bodies that need script-src hashes under strict CSP.
 * Skips JSON / ld+json payloads. Includes `type=importmap` — Chromium treats
 * import maps as script-src gated (Nuxt 4.5+/Vite 8 emit `#entry` maps).
 * @param {string} html
 * @returns {string[]}
 */
export function extractExecutableInlineScripts(html) {
  const bodies = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    const attrs = match[1] || '';
    const body = match[2] ?? '';
    if (/\bsrc\s*=/i.test(attrs)) continue;
    if (!body.trim()) continue;
    const typeMatch = attrs.match(/\btype\s*=\s*["']([^"']+)["']/i);
    const type = typeMatch?.[1]?.trim().toLowerCase() ?? 'text/javascript';
    if (type === 'application/json' || type === 'application/ld+json' || type.endsWith('+json')) {
      continue;
    }
    bodies.push(body);
  }
  return bodies;
}

/** @param {string} content */
export function hashInlineScript(content) {
  const digest = createHash('sha256').update(content, 'utf8').digest('base64');
  return `'sha256-${digest}'`;
}

/**
 * @param {string} publicDir
 * @returns {string[]} sorted unique CSP hash tokens
 */
export function collectInlineScriptHashes(publicDir) {
  const hashes = new Set();
  for (const file of walkHtmlFiles(publicDir)) {
    const html = readFileSync(file, 'utf8');
    for (const body of extractExecutableInlineScripts(html)) {
      hashes.add(hashInlineScript(body));
    }
  }
  return [...hashes].sort();
}

/**
 * @param {{ scriptHashes?: string[], enableTrustedTypes?: boolean }} [options]
 * @returns {string[]}
 */
export function buildCspDirectives(options = {}) {
  const scriptHashes = options.scriptHashes ?? [];
  const enableTrustedTypes = options.enableTrustedTypes ?? false;

  const scriptSrc =
    scriptHashes.length > 0
      ? [
          'script-src',
          "'self'",
          'https://www.googletagmanager.com',
          'https://*.google-analytics.com',
          ...scriptHashes,
        ].join(' ')
      : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.google-analytics.com";

  /** @type {string[]} */
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com",
    "font-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    scriptSrc,
    "connect-src 'self' https://*.google-analytics.com https://www.googletagmanager.com https://huggingface.co https://*.huggingface.co https://cdn-lfs.huggingface.co https://*.hf.co",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    'upgrade-insecure-requests',
  ];

  if (enableTrustedTypes) {
    // Vue 3 registers a Trusted Types policy named `vue`.
    directives.push("require-trusted-types-for 'script'");
    directives.push('trusted-types vue default');
  }

  return directives;
}

/**
 * @param {{ scriptHashes?: string[], enableTrustedTypes?: boolean }} [options]
 * @returns {string}
 */
export function buildCspHeaderValue(options = {}) {
  return buildCspDirectives(options).join('; ');
}

/**
 * Static security headers applied to every path via Netlify `_headers`.
 * @returns {Record<string, string>}
 */
export function buildSecurityHeaders() {
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  };
}

/** HTML documents — never pin; always revalidate after deploy. */
export const CACHE_CONTROL_HTML = 'no-cache, no-store, must-revalidate';

/** Hashed Nuxt / font / i18n assets — immutable year-long cache. */
export const CACHE_CONTROL_IMMUTABLE = 'public, max-age=31536000, immutable';

/** Image CDN derivatives (/_ipx) — URL encodes transform; safe to treat as immutable. */
export const CACHE_CONTROL_IPX = 'public, max-age=31536000, immutable';

/** Source images under /img — shorter TTL so replacements propagate. */
export const CACHE_CONTROL_IMAGES = 'public, max-age=2592000, stale-while-revalidate=604800';

/** Favicons — short cache (brand marks change with redesigns). */
export const CACHE_CONTROL_BRAND = 'public, max-age=86400, must-revalidate';

/** Manifest allows a longer SWR window than other brand marks. */
export const CACHE_CONTROL_MANIFEST = 'public, max-age=86400, stale-while-revalidate=604800';

/**
 * Cache policies for artifact deploys (`netlify deploy --no-build`).
 * Mirror of `netlify.toml` [[headers]] — toml rules are NOT uploaded with --dir.
 * @returns {Array<{ path: string, headers: Record<string, string> }>}
 */
export function buildCacheHeaderBlocks() {
  return [
    { path: '/', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/index.html', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/200.html', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    // Directory HTML for indexable pretty URLs (locale + landings + case studies).
    { path: '/es/', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/vue-frontend-developer/', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/es/desarrollador-vue/', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/ai-engineer/', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/es/ingeniero-ia/', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/nodejs-backend-developer/', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/es/desarrollador-backend-nodejs/', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/case-studies/*', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/es/casos/*', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/web-developer-cartagena/', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/es/desarrollo-web-cartagena/', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/ai-assisted-craft/', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/es/craft-asistido-ia/', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/angular-developer/', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/es/desarrollador-angular/', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/frontend-architect/', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/es/arquitecto-frontend/', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/fullstack-engineer/', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/es/ingeniero-fullstack/', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },
    { path: '/*.html', headers: { 'Cache-Control': CACHE_CONTROL_HTML } },

    { path: '/_nuxt/*', headers: { 'Cache-Control': CACHE_CONTROL_IMMUTABLE } },
    { path: '/_fonts/*', headers: { 'Cache-Control': CACHE_CONTROL_IMMUTABLE } },
    { path: '/_i18n/*', headers: { 'Cache-Control': CACHE_CONTROL_IMMUTABLE } },

    { path: '/_ipx/*', headers: { 'Cache-Control': CACHE_CONTROL_IPX } },
    { path: '/img/*', headers: { 'Cache-Control': CACHE_CONTROL_IMAGES } },

    { path: '/favicon.ico', headers: { 'Cache-Control': CACHE_CONTROL_BRAND } },
    { path: '/favicon.svg', headers: { 'Cache-Control': CACHE_CONTROL_BRAND } },
    { path: '/favicon-16x16.png', headers: { 'Cache-Control': CACHE_CONTROL_BRAND } },
    { path: '/favicon-32x32.png', headers: { 'Cache-Control': CACHE_CONTROL_BRAND } },
    { path: '/apple-touch-icon.png', headers: { 'Cache-Control': CACHE_CONTROL_BRAND } },
    { path: '/manifest.json', headers: { 'Cache-Control': CACHE_CONTROL_MANIFEST } },
  ];
}

/**
 * @param {string} csp
 * @param {Record<string, string>} [security]
 */
export function buildNetlifyHeadersFile(
  csp = buildCspHeaderValue(),
  security = buildSecurityHeaders(),
) {
  const securityLines = Object.entries(security)
    .map(([name, value]) => `  ${name}: ${value}`)
    .join('\n');

  const cacheBlocks = buildCacheHeaderBlocks()
    .map((block) => {
      const lines = Object.entries(block.headers)
        .map(([name, value]) => `  ${name}: ${value}`)
        .join('\n');
      return `${block.path}\n${lines}`;
    })
    .join('\n\n');

  return `\
#
# Generated by scripts/write-csp-headers.mjs — do not edit by hand.
# Deployed via artifact + netlify deploy --no-build — headers must live here.
# Includes CSP/security AND cache policies (netlify.toml [[headers]] are not in the publish tree).
#
/*
  Content-Security-Policy: ${csp}
${securityLines}

${cacheBlocks}
`;
}

/**
 * Parse the first Content-Security-Policy value from a Netlify `_headers` file.
 * @param {string} headersText
 * @returns {string | null}
 */
export function parseCspFromHeadersFile(headersText) {
  const match = headersText.match(/Content-Security-Policy:\s*(.+)/i);
  return match?.[1]?.trim() ?? null;
}

/**
 * @param {string} headersText
 * @param {string} headerName
 * @returns {string | null}
 */
export function parseHeaderFromHeadersFile(headersText, headerName) {
  const escaped = headerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = headersText.match(new RegExp(`^\\s*${escaped}:\\s*(.+)$`, 'im'));
  return match?.[1]?.trim() ?? null;
}
