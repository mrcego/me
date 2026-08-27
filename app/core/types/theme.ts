/** Display font stacks. Fira Code max Google weight is 700 — see CSS clamp in main.css. */
export type ThemeFont = 'Sans' | 'Fira Code';

export interface ThemePreset {
  id: string;
  name: string;
  background: string;
  surface: string;
  primary: string;
  font: ThemeFont;
  isDark: boolean;
}
