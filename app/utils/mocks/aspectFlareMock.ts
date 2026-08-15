/**
 * Mock stub for optional @aspect/flare engine import in @browserai/browserai.
 * Resolves Vite import analysis in development and production bundling.
 */
export default async function initFlare(): Promise<void> {}
export const Flare = Object.freeze({});
