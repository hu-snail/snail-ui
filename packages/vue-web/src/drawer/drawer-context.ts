/**
 * SnDrawer ↔ SnDrawerContent contract (AUI-WEB-FB-003).
 *
 * Mirrors upstream naive-ui's `drawerInjectionKey`: `<SnDrawerContent>` must
 * find its parent drawer to close itself, while the drawer owns the
 * visibility state. `undefined` from `inject` means the content was rendered
 * outside a drawer, which is a usage error.
 */
export const SN_DRAWER_INJECTION_KEY = 'sn-drawer-api'

/** What `SnDrawer` exposes to a descendant `SnDrawerContent`. */
export interface SnDrawerApi {
  /** Ask the parent drawer to change visibility. */
  doUpdateShow: (show: boolean) => void
}
