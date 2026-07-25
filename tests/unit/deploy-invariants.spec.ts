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

  it('keeps Netlify HTML post-processing disabled', () => {
    const toml = read('netlify.toml');
    expect(toml).toMatch(/skip_processing\s*=\s*true/);
    expect(toml).toMatch(/publish\s*=\s*"\.output\/public"/);
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
