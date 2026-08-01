import { describe, expect, it } from 'vitest';
import { buildThemeFaviconHref } from '../../app/utils/themeFavicon';

describe('buildThemeFaviconHref', () => {
  it('embeds the selected theme primary color in the SVG favicon', () => {
    const href = buildThemeFaviconHref('#bd93f9');

    expect(href).toMatch(/^data:image\/svg\+xml,/);
    const svg = decodeURIComponent(href.replace('data:image/svg+xml,', ''));
    expect(svg).toContain('stroke="#bd93f9"');
    expect(svg.match(/stroke="#bd93f9"/g) ?? []).toHaveLength(3);
  });
});
