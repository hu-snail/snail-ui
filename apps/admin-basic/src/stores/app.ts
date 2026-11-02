import { defineStore } from 'pinia';
import {
  DEFAULT_PRESET_ID,
  findPreset,
  type ThemeMode,
} from '../theme/presets';
import { isAppLocale, readLocale, type AppLocale } from '../i18n';

const MODE_KEY = 'admin_basic_theme_mode';
const PRIMARY_KEY = 'admin_basic_primary';
const LOCALE_KEY = 'admin_basic_locale';

function restoreMode(): ThemeMode {
  return localStorage.getItem(MODE_KEY) === 'dark' ? 'dark' : 'light';
}

function restorePrimary(): string {
  return localStorage.getItem(PRIMARY_KEY) ?? DEFAULT_PRESET_ID;
}

function persist(key: string, value: string): void {
  localStorage.setItem(key, value);
}

/**
 * App-shell preferences: theme mode, primary color preset, sidebar state.
 * Locale lives here too so the header controls share one store; the vue-i18n
 * instance is synced by `setLocale`.
 */
export const useAppStore = defineStore('app', {
  state: () => ({
    mode: restoreMode(),
    primaryId: restorePrimary(),
    locale: readLocale(),
    siderCollapsed: false,
  }),

  getters: {
    primaryPreset: (state) => findPreset(state.primaryId),
  },

  actions: {
    setMode(mode: ThemeMode): void {
      this.mode = mode;
      persist(MODE_KEY, mode);
    },
    toggleMode(): void {
      this.setMode(this.mode === 'dark' ? 'light' : 'dark');
    },
    setPrimary(id: string): void {
      this.primaryId = findPreset(id).id;
      persist(PRIMARY_KEY, this.primaryId);
    },
    setLocale(locale: AppLocale): void {
      if (!isAppLocale(locale)) return;
      this.locale = locale;
      persist(LOCALE_KEY, locale);
    },
    toggleSider(): void {
      this.siderCollapsed = !this.siderCollapsed;
    },
  },
});
