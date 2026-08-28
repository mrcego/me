import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (rel: string) => readFileSync(join(root, rel), 'utf8');

describe('deploy / layout invariants (regression guards)', () => {
  it('keeps Netlify deploy on --no-build with prebuilt .output/public', () => {
    const workflow = read('.github/workflows/netlify.yml');
    expect(workflow).toMatch(/--no-build/);
    expect(workflow).toMatch(/--dir=\.output\/public/);
    expect(workflow).toMatch(/needs:\s*validate/);
  });

  it('publishes a Netlify Deploy Preview from the CI artifact on pull requests', () => {
    // Preview lives outside reusable ci.yml so Deploy-to-Netlify is not forced
    // to grant pull-requests: write for a skipped nested job.
    const preview = read('.github/workflows/netlify-preview.yml');
    expect(preview).toMatch(/alias="pr-\$\{\{\s*github\.event\.number\s*\}\}"/);
    expect(preview).toMatch(/--no-build/);
    expect(preview).toMatch(/uses:\s*\.\/\.github\/workflows\/ci\.yml/);
    expect(read('.github/workflows/ci.yml')).not.toMatch(/pull-requests:\s*write/);
  });

  it('keeps Netlify HTML post-processing disabled', () => {
    const toml = read('netlify.toml');
    expect(toml).toMatch(/skip_processing\s*=\s*true/);
    expect(toml).toMatch(/publish\s*=\s*"\.output\/public"/);
  });

  it('documents that deploy security headers are generated into _headers', () => {
    // GH Actions only uploads .output/public — netlify.toml [[headers]] never reach the CDN.
    const cspLib = read('scripts/lib/csp.mjs');
    expect(cspLib).toMatch(/buildSecurityHeaders/);
    expect(cspLib).toMatch(/buildCacheHeaderBlocks/);
    expect(cspLib).toMatch(/includeSubDomains/);
    expect(cspLib).toMatch(/Cross-Origin-Opener-Policy/);
    expect(cspLib).toMatch(/collectInlineScriptHashes/);
  });

  it('keeps sitemap zeroRuntime + static rewrite consistent (no function proxy)', () => {
    // Artifact --no-build deploys have no Nitro server. sitemap_index must be a
    // prerendered static file; public/_redirects may rewrite /sitemap.xml → index
    // but must never force sitemap_index to /.netlify/functions|builders.
    const cfg = read('nuxt.config.ts');
    expect(cfg).toMatch(/sitemap:\s*\{[\s\S]*zeroRuntime:\s*true/);
    expect(cfg).toMatch(/prerenderRoutesWithSitemap|SITEMAP_PRERENDER_ROUTES/);

    const redirects = read('public/_redirects');
    expect(redirects).toMatch(/\/sitemap\.xml\s+\/sitemap_index\.xml\s+200!/);
    expect(redirects).not.toMatch(/sitemap_index\.xml\s+\/\.netlify\//);
    expect(redirects).not.toMatch(/__sitemap__.*\/\.netlify\//);

    const toml = read('netlify.toml');
    expect(toml).toMatch(/from\s*=\s*"\/sitemap\.xml"/);
    expect(toml).toMatch(/to\s*=\s*"\/sitemap_index\.xml"/);
  });

  it('wires prerender + sitemap URLs from the typed route manifest', () => {
    const cfg = read('nuxt.config.ts');
    expect(cfg).toMatch(/from\s+['"]\.\/app\/config\/routes\.manifest['"]/);
    expect(cfg).toMatch(/urls:\s*sitemapUrls\(\)/);
  });

  it('softens webfont swap after generate to cut hero CLS', () => {
    const pkg = read('package.json');
    expect(pkg).toMatch(/font-display-optional\.mjs/);
    expect(read('scripts/font-display-optional.mjs')).toMatch(/font-display:optional/);
  });

  it('does not preload webfonts (LCP is the hero image, not text)', () => {
    const cfg = read('nuxt.config.ts');
    // Both families must stay preload:false so slow-4G bandwidth goes to /_ipx me.jpg.
    expect(cfg).toMatch(/name:\s*'Fira Code'[\s\S]*?preload:\s*false/);
    expect(cfg).toMatch(/name:\s*'Outfit'[\s\S]*?preload:\s*false/);
    expect(cfg).not.toMatch(/preload:\s*true/);
    // Fira ships globally so @font-face exists even when first paint omits the family name.
    expect(cfg).toMatch(/name:\s*'Fira Code'[\s\S]*?global:\s*true/);
  });

  it('limits font CSS-variable processing to font-prefixed variables', () => {
    const cfg = read('nuxt.config.ts');

    expect(cfg).toMatch(/processCSSVariables:\s*'font-prefixed-only'/);
  });

  it('defers webfont family names until after load (keeps /_fonts off LCP chain)', () => {
    const presets = read('app/utils/themePresets.ts');
    const init = read('app/utils/themeInitScript.ts');
    const css = read('app/assets/css/main.css');
    expect(presets).toContain('FONT_STACKS_LOCAL');
    expect(presets).toContain('ui-monospace');
    expect(presets).toContain('SFMono-Regular');
    expect(presets).not.toContain('Fira Code Fallback:');
    expect(presets).toContain('"Fira Code", ${FONT_STACKS_LOCAL[\'Fira Code\']}');
    // Blocking theme-init applies local stack first, then load+idle activates webfonts.
    expect(init).toContain('FONT_STACKS_LOCAL');
    expect(init).toContain('requestIdleCallback');
    expect(init).toContain('dataset.webfonts');
    expect(init).toContain("addEventListener('load'");
    // CSS :root must not put "Fira Code" in the used --app-font (unused webfont vars OK).
    // Its non--font-* name also keeps the OG font scanner away from local aliases.
    expect(css).toMatch(/--app-font:\s*ui-monospace,\s*monospace/);
    expect(css).not.toMatch(/--app-font:\s*'Fira Code'/);
    expect(css).not.toContain('Fira Code Fallback:');
    // Mono fallbacks for Fira — proportional locals CLS the hero name on activation.
    expect(read('nuxt.config.ts')).toMatch(
      /name:\s*'Fira Code'[\s\S]*?fallbacks:\s*\[\s*'Consolas'/,
    );
  });

  it('keeps cssCodeSplit false so CSS preload can target one stylesheet', () => {
    expect(read('nuxt.config.ts')).toMatch(/cssCodeSplit:\s*false/);
  });

  it('keeps fixed navbar outside the overflow-x-clip wrapper', () => {
    const app = read('app/app.vue');
    const navIdx = app.search(/<(?:Lazy)?AppNavbar/);
    // Match the real wrapper class, not the explanatory HTML comment above it.
    const clipIdx = app.search(/class="[^"]*overflow-x-clip[^"]*"/);
    expect(navIdx).toBeGreaterThan(-1);
    expect(clipIdx).toBeGreaterThan(-1);
    expect(navIdx).toBeLessThan(clipIdx);
  });
});
