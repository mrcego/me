import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '../..');

describe('homepage heading hierarchy', () => {
  it('uses an h3 for the About section title before its role-card h4 headings', () => {
    const aboutSection = readFileSync(resolve(root, 'app/components/AboutSection.vue'), 'utf8');
    const titleIndex = aboutSection.indexOf("{{ $t('about.title') }}");
    const roleCardHeadingIndex = aboutSection.indexOf('class="surface-card__title');

    expect(titleIndex).toBeGreaterThan(-1);
    expect(roleCardHeadingIndex).toBeGreaterThan(titleIndex);
    expect(aboutSection).toMatch(/<h3\s+class="[^"]+"[\s\S]{0,300}\{\{ \$t\('about\.title'\) \}\}/);
  });
});
