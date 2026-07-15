import type { RouterConfig } from '@nuxt/schema';
import { consumeLocaleSwitchScroll, isHomeLocalePath } from '~/utils/locale-switch-scroll';

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    const localeSwitchTop = consumeLocaleSwitchScroll();
    if (localeSwitchTop !== null) {
      return { top: localeSwitchTop, left: 0, behavior: 'auto' };
    }

    const localeOnlySwitch =
      isHomeLocalePath(to.path) && isHomeLocalePath(from.path) && to.path !== from.path;

    if (localeOnlySwitch) {
      return false;
    }

    if (savedPosition) {
      return savedPosition;
    }

    if (to.hash) {
      return {
        el: to.hash,
        top: 96,
        behavior: 'auto',
      };
    }

    return { top: 0, left: 0 };
  },
};
