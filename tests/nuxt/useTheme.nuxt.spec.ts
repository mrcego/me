import { mountSuspended } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import { DEFAULT_THEME_ID } from '~/utils/themePresets';
import { useTheme } from '~/composables/useTheme';

async function mountTheme() {
  let api!: ReturnType<typeof useTheme>;
  await mountSuspended(
    defineComponent({
      setup() {
        api = useTheme();
        return {};
      },
      template: '<div />',
    }),
  );
  return api;
}

describe('useTheme', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    document.documentElement.removeAttribute('style');
  });

  it('applies a known preset (happy path)', async () => {
    const api = await mountTheme();
    api.setThemePreset('dracula');
    expect(api.currentThemeId.value).toBe('dracula');
    expect(document.documentElement.style.getPropertyValue('--primary')).toBeTruthy();
    expect(document.documentElement.classList.contains('app-dark')).toBe(true);
  });

  it('ignores unknown preset ids (bad path)', async () => {
    const api = await mountTheme();
    const before = api.currentThemeId.value || DEFAULT_THEME_ID;
    api.setThemePreset('not-a-real-theme');
    expect(api.currentThemeId.value).toBe(before);
  });

  it('previews then cancels back to the persisted theme', async () => {
    const api = await mountTheme();
    api.setThemePreset('github-dark');
    api.previewTheme('github-light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    api.cancelThemePreview();
    expect(document.documentElement.classList.contains('app-dark')).toBe(true);
  });

  it('toggles between dark and light families', async () => {
    const api = await mountTheme();
    api.setThemePreset('github-dark');
    api.toggleTheme();
    expect(api.currentTheme.value.isDark).toBe(false);
    api.toggleTheme();
    expect(api.currentTheme.value.isDark).toBe(true);
  });
});
