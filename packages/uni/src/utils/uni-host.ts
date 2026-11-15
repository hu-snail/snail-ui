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
