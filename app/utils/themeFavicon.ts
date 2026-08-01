const CG_MARK_PATHS = [
  'M 27.43 23.13 A 11.25 11.25 0 1 0 27.43 40.87',
  'M 51.03 23.64 A 11.25 11.25 0 1 0 49.46 41.54',
  'M 43.00 32 H 55.10 V 38.40',
] as const;

export const buildThemeFaviconHref = (primary: string) => {
  const paths = CG_MARK_PATHS.map(
    (path, index) =>
      `<path d="${path}" stroke="${primary}" stroke-width="5.75" stroke-linecap="butt"${
        index === 2 ? ' stroke-linejoin="miter"' : ''
      } fill="none"/>`,
  ).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">${paths}</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};
