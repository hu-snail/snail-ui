/**
 * Resolve the host uni API object.
 *
 * ## Why the free identifier, never `globalThis.uni` (AUI-UNI-FB-012)
 *
 * The uni-app / uni-app x compilers rewrite the free identifier `uni` into
 * their injected API module (`common_vendor.index` in compiled output). That
 * rewrite is the ONLY channel that resolves on classic uni-app mini-programs:
 * there the app-service global never receives a `uni` property (verified in
 * the WeChat app-service), so `(globalThis as { uni?... }).uni` returns null
 * and every canvas / navigate / measure call silently no-ops. H5 and uni-app x
 * hosts do expose a global, which is why the broken pattern hid for so long.
 *
 * The global slot stays as the fallback because an unbound free identifier
 * throws in plain vitest — where the tests stub precisely that slot.
 */

declare const uni: unknown;

export function resolveUniHost<T>(): T | null {
  try {
    return uni as T;
  } catch {
    const host = globalThis as { uni?: T };
    return host.uni ?? null;
  }
}

/** The chainable selector-query subset the callers need (mp / uni / x shapes). */
export interface UniSelectorQuery {
  in?: (scope: unknown) => UniSelectorQuery;
  select?: (selector: string) => {
    boundingClientRect?: (cb: (rect: { width?: number } | null) => void) => UniSelectorQuery;
  };
  exec?: (cb?: () => void) => void;
}

/** A host that can create selector queries: the mp Component `$scope` or the uni API object. */
export type UniSelectorQueryHost = { createSelectorQuery?: () => UniSelectorQuery };

/**
 * Pick the host for a scoped selector query.
 *
 * **Prefer the mp component's own `$scope.createSelectorQuery`** — the WeChat
 * Component instance natively owns it, and `.in($scope)` scopes the selector
 * to this component's subtree. The page-level `uni.createSelectorQuery` with
 * `.in(Vue proxy)` is unreliable inside nested custom components: the selector
 * resolved against the PAGE and matched the first node in document order —
 * sn-icon read the wrong cascade color (§118.3, fix 232331e5) and
 * sn-swipe-action measured every row with the FIRST row's action width, so
 * right-side pills stayed covered past a ~80px clamp on mp devices.
 * The uni host is the fallback for hosts without a `$scope` (H5 / uni-app x),
 * where `queryScope` can only be the component proxy, best effort.
 */
export function pickSelectorQueryHost(
  scope: UniSelectorQueryHost | null | undefined,
  globalHost: UniSelectorQueryHost | null | undefined,
  fallbackQueryScope: unknown,
): { createQuery: () => UniSelectorQuery; queryScope: unknown } | null {
  if (typeof scope?.createSelectorQuery === 'function') {
    return { createQuery: scope.createSelectorQuery, queryScope: scope };
  }
  if (typeof globalHost?.createSelectorQuery === 'function') {
    return { createQuery: globalHost.createSelectorQuery, queryScope: fallbackQueryScope };
  }
  return null;
}
