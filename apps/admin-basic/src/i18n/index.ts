import { createI18n } from 'vue-i18n';
import zhCN from './zh-CN';
import enUS from './en-US';

export type AppLocale = 'zh-CN' | 'en-US';

export const LOCALE_KEY = 'admin_basic_locale';
export const LOCALES: readonly AppLocale[] = ['zh-CN', 'en-US'];
export type I18nMessages = typeof zhCN;

function readStoredLocale(): AppLocale {
  const saved = localStorage.getItem(LOCALE_KEY);
  return saved === 'en-US' || saved === 'zh-CN' ? saved : 'zh-CN';
}

export const i18n = createI18n({
  legacy: false,
  locale: readStoredLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN as unknown as I18nMessages,
    'en-US': enUS as unknown as I18nMessages,
  },
  missingWarn: false,
  fallbackWarn: false,
});

export function isAppLocale(value: unknown): value is AppLocale {
  return value === 'zh-CN' || value === 'en-US';
}

/** Read the persisted locale preference (shared with the app store). */
export function readLocale(): AppLocale {
  return readStoredLocale();
}
