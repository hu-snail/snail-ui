/**
 * useLocale — internal composable that resolves the effective `SnLocale`.
 *
 * Contract (naive-ui style):
 *   - Components call `useLocale()` inside `setup()` and unpack a namespace
 *     via computed, e.g. `const { Upload: uploadLocale } = useLocale()`.
 *   - Without an `<SnConfigProvider :locale>` ancestor the built-in `zhCN`
 *     is returned, so every component keeps its pre-locale rendering.
 *   - A partial locale (an object implementing `Partial<SnLocale>`, e.g.
 *     `{ Log: { loading: '…' } }`) is merged over `zhCN`: whole missing
 *     namespaces fall back to zhCN wholesale. Per AGENTS.md §14 this keeps
 *     the merge predictable — a namespace that IS provided must be complete
 *     (no per-key deep merge), so a component never renders `undefined`
 *     because an unrelated key was forgotten.
 *
 * Internal API: not exported from the package root (`index.ts` exports only
 * the `SnLocale` type and the `zhCN` / `enUS` constants).
 */

import { computed, inject, isRef } from 'vue';
import { zhCN } from './zh-cn';
import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type { SnLocale } from './zh-cn';

/**
 * Provide/inject key for the active locale. `null` (or absence) means "no
 * provider" → built-in zhCN. Exported so `SnConfigProvider` and tests share
 * the exact same contract; normal consumers use `<SnConfigProvider locale>`.
 */
export const SN_LOCALE_KEY: InjectionKey<Partial<SnLocale> | null | Ref<Partial<SnLocale> | null>> =
  Symbol('sn-locale');

/** What a host may pass to `<SnConfigProvider :locale>` — see the merge contract above. */
export type SnLocaleInput = Partial<SnLocale>;

/**
 * Resolve the effective locale: the injected (possibly partial) one merged
 * over zhCN, or zhCN alone when nothing (or `null`) is provided.
 *
 * Returns a computed so a `locale` prop switch on the provider re-renders
 * every consuming component without remounting.
 */
export function useLocale(): ComputedRef<SnLocale> {
  const injected = inject(SN_LOCALE_KEY, null);

  return computed(() => {
    // `SnConfigProvider` provides a reactive ref (so locale switches
    // propagate); a host may also provide a plain object. Unwrap refs here
    // so the merge below always sees the plain locale object.
    const source: Partial<SnLocale> | null = isRef(injected) ? injected.value : injected;
    if (source === null) return zhCN;
    return {
      ...zhCN,
      ...source,
      Common: { ...zhCN.Common, ...source.Common },
      Upload: { ...zhCN.Upload, ...source.Upload },
      Log: { ...zhCN.Log, ...source.Log },
      VideoControls: { ...zhCN.VideoControls, ...source.VideoControls },
      DatePicker: { ...zhCN.DatePicker, ...source.DatePicker },
      Pagination: { ...zhCN.Pagination, ...source.Pagination },
      Calendar: { ...zhCN.Calendar, ...source.Calendar },
      Transfer: { ...zhCN.Transfer, ...source.Transfer },
      DataTable: { ...zhCN.DataTable, ...source.DataTable },
      Tree: { ...zhCN.Tree, ...source.Tree },
      Empty: { ...zhCN.Empty, ...source.Empty },
      QrCode: { ...zhCN.QrCode, ...source.QrCode },
      Heatmap: { ...zhCN.Heatmap, ...source.Heatmap },
      BackTop: { ...zhCN.BackTop, ...source.BackTop },
      Drawer: { ...zhCN.Drawer, ...source.Drawer },
      AvatarGroup: { ...zhCN.AvatarGroup, ...source.AvatarGroup },
      Popconfirm: { ...zhCN.Popconfirm, ...source.Popconfirm },
    };
  });
}
