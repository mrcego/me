import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PORTFOLIO_ROUTES } from '../../app/config/routes.manifest';

const OUTPUT_PUBLIC = join(process.cwd(), process.env.NUXT_OUTPUT_DIR || '.output', 'public');

function collectSitemapXml(): string | null {
  if (!existsSync(OUTPUT_PUBLIC)) return null;

  const chunks: string[] = [];
  const indexPath = join(OUTPUT_PUBLIC, 'sitemap_index.xml');
  if (existsSync(indexPath)) {
    chunks.push(readFileSync(indexPath, 'utf8'));
  }

  const sitemapDir = join(OUTPUT_PUBLIC, '__sitemap__');
  if (existsSync(sitemapDir)) {
    for (const file of readdirSync(sitemapDir)) {
      if (file.endsWith('.xml')) {
        chunks.push(readFileSync(join(sitemapDir, file), 'utf8'));
      }
    }
  }

  const rootSitemap = join(OUTPUT_PUBLIC, 'sitemap.xml');
  if (existsSync(rootSitemap)) {
    chunks.push(readFileSync(rootSitemap, 'utf8'));
  }

  return chunks.length ? chunks.join('\n') : null;
}

describe('sitemap emission', () => {
  it('includes every PORTFOLIO_ROUTES path in generated sitemap XML', () => {
    const xml = collectSitemapXml();
    if (!xml) {
      // CI generate step produces .output/public; local runs may skip.
      return;
    }

    for (const route of PORTFOLIO_ROUTES) {
      const enPath =
        route.paths.en === '/'
          ? 'https://cesargomez.dev/'
          : `https://cesargomez.dev${route.paths.en}`;
      const esPath = `https://cesargomez.dev${route.paths.es}`;

      expect(xml, `missing EN path ${route.paths.en}`).toContain(enPath);
      expect(xml, `missing ES path ${route.paths.es}`).toContain(esPath);
    }
  });
});
