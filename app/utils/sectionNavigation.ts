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

export function revealSectionGeometry(targetId?: string) {
  if (typeof document === 'undefined') return;
  const sections = [...document.querySelectorAll('.portfolio-content > [id]')] as HTMLElement[];
  if (!sections.length) return;

  let focusIndex = targetId ? sections.findIndex((section) => section.id === targetId) : -1;
  if (focusIndex < 0) focusIndex = 0;

  const end = Math.min(sections.length - 1, focusIndex + 1);
  for (let i = 0; i <= end; i++) {
    const section = sections[i];
    if (section) section.style.contentVisibility = 'visible';
  }
}
