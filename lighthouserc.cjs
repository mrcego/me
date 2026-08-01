/**
 * Lighthouse CI — lab budgets aligned with quality/BASELINE.md.
 * Targets the local SSG server from `pnpm serve:ssg` (default http://127.0.0.1:4173).
 *
 * INP has no stable lab metric; TBT is the aspirational proxy (≤200ms).
 * Core routes use warn-level asserts until a clean baseline is established;
 * expand to error once CI is green for several releases.
 */
const SSG_ORIGIN = process.env.LHCI_BASE_URL || 'http://127.0.0.1:4173';

/** @type {import('@lhci/cli/src/index').LHCI.ServerCommand.Options} */
module.exports = {
  ci: {
    collect: {
      url: [
        `${SSG_ORIGIN}/`,
        `${SSG_ORIGIN}/es/`,
        `${SSG_ORIGIN}/vue-frontend-developer/`,
        `${SSG_ORIGIN}/case-studies/colegium/`,
        `${SSG_ORIGIN}/web-developer-cartagena/`,
      ],
      numberOfRuns: 1,
      settings: {
        formFactor: 'mobile',
        screenEmulation: { mobile: true },
        throttlingMethod: 'simulate',
      },
    },
    assert: {
      assertLevel: 'warn',
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        // INP p75 ≤200ms — lab proxy via TBT until CrUX/field data is wired.
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
