/** Production site origin (no trailing path). */
export const SITE_ORIGIN = 'https://cesargomez.dev';

/** Ensure a path ends with `/` (root stays `/`). */
export const withTrailingSlash = (path: string): string => {
  if (!path || path === '/') return '/';
  const bare = path.startsWith('/') ? path : `/${path}`;
  return bare.endsWith('/') ? bare : `${bare}/`;
};

/** Absolute site URL with trailing slash (matches Netlify directory URLs). */
export const absoluteSiteUrl = (path = '/'): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      const url = new URL(path);
      if (url.origin !== SITE_ORIGIN) return path;
      url.pathname = withTrailingSlash(url.pathname);
      return url.toString();
    } catch {
      return path;
    }
  }

  const normalized = withTrailingSlash(path);
  return normalized === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${normalized}`;
};
