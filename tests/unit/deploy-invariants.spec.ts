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
    expect(cspLib).toMatch(/includeSubDomains/);
    expect(cspLib).toMatch(/Cross-Origin-Opener-Policy/);
    expect(cspLib).toMatch(/collectInlineScriptHashes/);
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
    // Fira stack must not chain a second webfont (Outfit) after optional timeout.
    expect(read('app/utils/themePresets.ts')).toMatch(/'Fira Code':\s*'"Fira Code", ui-sans-serif/);
  });

  it('keeps cssCodeSplit false so CSS preload can target one stylesheet', () => {
    expect(read('nuxt.config.ts')).toMatch(/cssCodeSplit:\s*false/);
  });

  it('keeps fixed navbar outside the overflow-x-clip wrapper', () => {
    const app = read('app/app.vue');
    const navIdx = app.indexOf('<LazyAppNavbar');
    // Match the real wrapper class, not the explanatory HTML comment above it.
    const clipIdx = app.search(/class="[^"]*overflow-x-clip[^"]*"/);
    expect(navIdx).toBeGreaterThan(-1);
    expect(clipIdx).toBeGreaterThan(-1);
    expect(navIdx).toBeLessThan(clipIdx);
  });
});
