import { writeFileSync } from 'node:fs';
import { buildThemeInitScript } from '../app/utils/themeInitScript';

writeFileSync(new URL('../public/theme-init.js', import.meta.url), `${buildThemeInitScript()}\n`);
console.log('Wrote public/theme-init.js');
