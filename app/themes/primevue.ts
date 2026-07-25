/**
 * Slim Aura preset — only tokens for components we actually mount.
 * Full `@primeuix/themes/aura` pulls every component (DataTable, Galleria, …)
 * into the Nuxt entry chunk (~100KB+ of unused theme).
 */
import base from '@primeuix/themes/aura/base';
import button from '@primeuix/themes/aura/button';
import css from '@primeuix/themes/aura/css';
import dialog from '@primeuix/themes/aura/dialog';
import inputtext from '@primeuix/themes/aura/inputtext';
import textarea from '@primeuix/themes/aura/textarea';

export default {
  preset: {
    ...base,
    components: {
      button,
      dialog,
      inputtext,
      textarea,
    },
    css,
  },
  options: {
    darkModeSelector: '.app-dark',
  },
};
