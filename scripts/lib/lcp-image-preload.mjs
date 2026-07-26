/**
 * Hero LCP image preload — keep attrs in sync with NuxtImg in HeroSection.vue
 * (sizes / densitites / format / quality) and app.vue useHead.
 *
 * PSI mobile (Moto G Power): 224 CSS px × ~2.625 DPR → prefers 448w.
 * Early <head> injection cuts resource load delay (preload must not sit after
 * ~200KB of inline CSS).
 */

export const HERO_LCP_IMAGE_HREF = '/_ipx/f_webp&q_85&fit_cover&s_448x560/img/me.jpg';

/** Matches NuxtImg sizes="224px sm:256px lg:392px xl:448px" expanded form. */
export const HERO_LCP_IMAGE_SIZES =
  '(max-width: 640px) 224px, (max-width: 1024px) 256px, (max-width: 1280px) 392px, 448px';

export const HERO_LCP_IMAGE_SRCSET = [
  '/_ipx/f_webp&q_85&fit_cover&s_224x280/img/me.jpg 224w',
  '/_ipx/f_webp&q_85&fit_cover&s_256x320/img/me.jpg 256w',
  '/_ipx/f_webp&q_85&fit_cover&s_392x490/img/me.jpg 392w',
  '/_ipx/f_webp&q_85&fit_cover&s_448x560/img/me.jpg 448w',
].join(', ');

/** @returns {string} */
export function buildHeroLcpPreloadTag() {
  return (
    `<link rel="preload" as="image" type="image/webp" href="${HERO_LCP_IMAGE_HREF}"` +
    ` fetchpriority="high" imagesizes="${HERO_LCP_IMAGE_SIZES}"` +
    ` imagesrcset="${HERO_LCP_IMAGE_SRCSET}">`
  );
}

/**
 * Drop any existing hero image preload (any attribute order).
 * @param {string} html
 */
export function stripHeroLcpImagePreloads(html) {
  return html.replace(/<link\b(?=[^>]*\bas=(["'])image\1)(?=[^>]*me\.jpg)[^>]*>/gi, '');
}

/**
 * Place the LCP image preload immediately after <head> so discovery is not
 * blocked by theme-init + inlined CSS.
 * @param {string} html
 * @returns {{ html: string, changed: boolean }}
 */
export function injectHeroLcpImagePreload(html) {
  if (!/<head[^>]*>/i.test(html)) return { html, changed: false };

  const stripped = stripHeroLcpImagePreloads(html);
  const tag = buildHeroLcpPreloadTag();
  const next = stripped.replace(/<head[^>]*>/i, (open) => `${open}${tag}`);
  return { html: next, changed: next !== html };
}
