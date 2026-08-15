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

  it('uses semantic h2 section titles and h3 cards across all major homepage sections', () => {
    const capabilities = readFileSync(
      resolve(root, 'app/components/sections/CapabilitiesSection.vue'),
      'utf8',
    );
    expect(capabilities).toMatch(/<h2[\s\S]{0,100}\{\{ \$t\('capabilities\.title'\) \}\}/);
    expect(capabilities).toMatch(/<h3[\s\S]{0,100}surface-card__title/);

    const techStack = readFileSync(
      resolve(root, 'app/components/sections/TechStackSection.vue'),
      'utf8',
    );
    expect(techStack).toMatch(/<h2[\s\S]{0,100}id="tech-stack-heading"/);
    expect(techStack).toMatch(/<h3[\s\S]{0,100}surface-card__title/);

    const certs = readFileSync(
      resolve(root, 'app/components/sections/CertificationsSection.vue'),
      'utf8',
    );
    expect(certs).toMatch(/<h2[\s\S]{0,400}\{\{ \$t\('certifications\.title'\) \}\}/);
    expect(certs).toMatch(/<h3[\s\S]{0,100}surface-card__title/);

    const testimonials = readFileSync(
      resolve(root, 'app/components/sections/TestimonialsSection.vue'),
      'utf8',
    );
    expect(testimonials).toMatch(/<h2[\s\S]{0,400}\{\{ \$t\('testimonials\.title'\) \}\}/);

    const coreHeader = readFileSync(
      resolve(root, 'app/core/components/CoreSectionHeader.vue'),
      'utf8',
    );
    expect(coreHeader).toMatch(/<h2[\s\S]{0,400}\{\{ title \}\}/);
  });
});
