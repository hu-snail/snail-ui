import { defineStore } from 'pinia';
import {
  DEFAULT_PRESET_ID,
  findPreset,
  type ThemeMode,
} from '../theme/presets';
import { isAppLocale, readLocale, type AppLocale } from '../i18n';
import type { SnProLayoutMode, SnProTabType } from '@snui/admin-layout';

const MODE_KEY = 'admin_basic_theme_mode';
const PRIMARY_KEY = 'admin_basic_primary';
const LOCALE_KEY = 'admin_basic_locale';
const LAYOUT_KEY = 'admin_basic_layout';
const TAB_TYPE_KEY = 'admin_basic_tab_type';
const TABS_KEY = 'admin_basic_visited_tabs';

/** Routes pinned in the tab bar — always present, never closable. */
export const AFFIX_TAB_KEY = 'home';

const LAYOUT_MODES: readonly SnProLayoutMode[] = ['side', 'top', 'mix', 'dual'];
const TAB_TYPES: readonly SnProTabType[] = ['line', 'card', 'bar', 'segment', 'chrome'];

function restoreMode(): ThemeMode {
  return localStorage.getItem(MODE_KEY) === 'dark' ? 'dark' : 'light';
}

function restorePrimary(): string {
  return localStorage.getItem(PRIMARY_KEY) ?? DEFAULT_PRESET_ID;
}

/** Layout / tab-type prefs tolerate stale or hand-edited values. */
function restoreFromList<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  const saved = localStorage.getItem(key);
  return saved !== null && (allowed as readonly string[]).includes(saved) ? (saved as T) : fallback;
}

function restoreVisitedKeys(): string[] {
  try {
    const raw = localStorage.getItem(TABS_KEY);
    if (raw === null) return [AFFIX_TAB_KEY];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [AFFIX_TAB_KEY];
    const keys = parsed.filter((key): key is string => typeof key === 'string' && key.length > 0);
    return keys.includes(AFFIX_TAB_KEY) ? keys : [AFFIX_TAB_KEY, ...keys];
  } catch {
    return [AFFIX_TAB_KEY];
  }
}

function persist(key: string, value: string): void {
  localStorage.setItem(key, value);
}

/**
 * App-shell preferences: theme mode, primary color preset, layout shape,
 * tab-bar style and the visited-route tab list. Locale lives here too so
 * the header controls share one store; the vue-i18n instance is synced by
 * `setLocale`.
 */
export const useAppStore = defineStore('app', {
  state: () => ({
    mode: restoreMode(),
    primaryId: restorePrimary(),
    locale: readLocale(),
    siderCollapsed: false,
    layout: restoreFromList(LAYOUT_KEY, LAYOUT_MODES, 'side'),
    tabType: restoreFromList(TAB_TYPE_KEY, TAB_TYPES, 'chrome'),
    visitedKeys: restoreVisitedKeys(),
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
    setLayout(layout: SnProLayoutMode): void {
      this.layout = layout;
      persist(LAYOUT_KEY, layout);
    },
    setTabType(tabType: SnProTabType): void {
      this.tabType = tabType;
      persist(TAB_TYPE_KEY, tabType);
    },
    /** Record a visit; affix home stays first, duplicates move nothing. */
    addVisited(key: string): void {
      if (this.visitedKeys.includes(key)) return;
      if (key === AFFIX_TAB_KEY) {
        this.visitedKeys = [key, ...this.visitedKeys.filter((k) => k !== AFFIX_TAB_KEY)];
      } else {
        this.visitedKeys = [...this.visitedKeys, key];
      }
      persist(TABS_KEY, JSON.stringify(this.visitedKeys));
    },
    removeVisited(key: string): void {
      if (key === AFFIX_TAB_KEY) return;
      this.visitedKeys = this.visitedKeys.filter((k) => k !== key);
      persist(TABS_KEY, JSON.stringify(this.visitedKeys));
    },
    clearVisited(): void {
      this.visitedKeys = [AFFIX_TAB_KEY];
      persist(TABS_KEY, JSON.stringify(this.visitedKeys));
    },
  },
});
