import { defineVitestConfig } from '@nuxt/test-utils/config';

// @nuxt/test-utils: unit project (node) + nuxt project for *.nuxt.spec.ts / tests/nuxt
export default defineVitestConfig({
  define: {
    'import.meta.client': JSON.stringify(true),
    'import.meta.server': JSON.stringify(false),
  },
  test: {
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
        'app/composables/usePortfolioSeo.ts',
        'app/composables/useExpertiseLandingSeo.ts',
        'app/composables/useAiEngineerLandingSeo.ts',
        'app/composables/useVueDeveloperLandingSeo.ts',
        'app/composables/useNodeBackendLandingSeo.ts',
        'app/composables/useSmoothedScroll.ts',
        'app/composables/usePortfolio.ts',
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
