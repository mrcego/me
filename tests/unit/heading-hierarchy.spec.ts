import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '../..');

describe('homepage heading hierarchy', () => {
  it('uses an h2 for the About section title before its role-card headings', () => {
    const aboutSection = readFileSync(
      resolve(root, 'app/components/sections/AboutSection.vue'),
      'utf8',
    );
    const titleIndex = aboutSection.indexOf("{{ $t('about.title') }}");
    const roleCardHeadingIndex = aboutSection.indexOf('class="surface-card__title');

    expect(titleIndex).toBeGreaterThan(-1);
    expect(roleCardHeadingIndex).toBeGreaterThan(titleIndex);
    expect(aboutSection).toMatch(/<h2\s+[\s\S]{0,300}\{\{ \$t\('about\.title'\) \}\}/);
  });
});
