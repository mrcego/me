export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const baseURL = config.app.baseURL;

  useHead({
    link: [
      { rel: 'manifest', href: `${baseURL}/manifest.json` },
      { rel: 'apple-touch-icon', sizes: '180x180', href: `${baseURL}/apple-touch-icon.png` },
      { rel: 'icon', type: 'image/svg+xml', href: `${baseURL}/favicon.svg` },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${baseURL}/favicon-16x16.png` },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${baseURL}/favicon-32x32.png` },
      { rel: 'icon', type: 'image/x-icon', href: `${baseURL}/favicon.ico` },
    ],
    meta: [{ name: 'msapplication-TileImage', content: `${baseURL}/apple-touch-icon.png` }],
  });
});
