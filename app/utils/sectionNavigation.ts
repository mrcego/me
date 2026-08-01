/**
 * Pure helpers for route-aware home section links (hash + locale home path).
 */

import { withTrailingSlash } from './siteUrl';

export function normalizeSectionHash(hash: string): string {
  if (!hash) return '';
  return hash.startsWith('#') ? hash : `#${hash}`;
}

/** Strip trailing slashes except for root `/`. */
export function normalizePathname(path: string): string {
  return path.replace(/\/+$/, '') || '/';
}

export function pathsMatchHome(currentPath: string, homePath: string): boolean {
  return normalizePathname(currentPath) === normalizePathname(homePath);
}

/**
 * Home: `#contact`. Landings: `/es/#contact` (or `/#contact`) preserving localePath + slash style.
 */
export function buildSectionHref(hash: string, isOnHome: boolean, homePath: string): string {
  const targetHash = normalizeSectionHash(hash);
  if (!targetHash) return isOnHome ? '#' : withTrailingSlash(homePath || '/');
  if (isOnHome) return targetHash;
  return `${withTrailingSlash(homePath)}${targetHash}`;
}
