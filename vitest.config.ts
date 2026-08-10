import { defineVitestConfig } from '@nuxt/test-utils/config';

// @nuxt/test-utils: unit project (node) + nuxt project for *.nuxt.spec.ts / tests/nuxt
export default defineVitestConfig({
  define: {
    'import.meta.client': JSON.stringify(true),
    'import.meta.server': JSON.stringify(false),
  },
  test: {
    // Nuxt environment setup under coverage can exceed Vitest's 10s default.
    hookTimeout: 60_000,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.output/**',
      '**/.nuxt/**',
      '**/tests/e2e/**',
      '**/playwright-report/**',
      '**/coverage/**',
    ],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'text-summary', 'html', 'lcov'],
      include: [
        'app/composables/**/*.ts',
        'app/utils/**/*.ts',
        'app/config/**/*.ts',
        'scripts/lib/**/*.{mjs,ts}',
      ],
      exclude: [
        'app/composables/seo/usePortfolioSeo.ts',
        'app/composables/seo/useExpertiseLandingSeo.ts',
        'app/composables/seo/useAiEngineerLandingSeo.ts',
        'app/composables/seo/useVueDeveloperLandingSeo.ts',
        'app/composables/seo/useNodeBackendLandingSeo.ts',
        'app/composables/seo/useCaseStudySeo.ts',
        'app/composables/seo/useContentPageSeo.ts',
        'app/composables/seo/useAiCraftLandingSeo.ts',
        'app/composables/seo/useLocalLandingSeo.ts',
        'app/composables/ui/useSmoothedScroll.ts',
        'app/composables/domain/usePortfolio.ts',
        // Client wiring covered by e2e / focused nuxt specs; keep thresholds honest.
        'app/composables/seo/useWebVitalsRum.ts',
        'app/composables/domain/useSectionNavigation.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80,
      },
    },
  },
});
