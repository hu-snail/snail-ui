/**
 * Layout provide/inject contract — internal to `src/layout/`.
 *
 * Kept inside the layout folder so no shared wiring (install.ts /
 * index.ts / resolver.ts) is touched; the InjectionKey + Symbol pattern
 * mirrors `src/checkbox/sn-checkbox-types.ts` (string-key convention used
 * by tabs would also work, but Symbol avoids cross-version collisions).
 */

import type { InjectionKey, Ref } from 'vue';

/** Vertical anchoring of the layout root. Mirrors naive-ui `position`. */
export type SnLayoutPosition = 'static' | 'absolute';

/** Style value accepted by the layout style-passthrough props. */
export type SnLayoutStyleValue = string | Record<string, string>;

/** Context provided by SnLayout into Header / Content / Footer / Sider. */
export interface SnLayoutContext {
  /** Whether the layout arranges children in a row (sider present). */
  hasSider: Ref<boolean>;
  /** Layout root positioning mode. */
  position: Ref<SnLayoutPosition>;
  /** Style passthrough applied to SnLayoutContent. */
  contentStyle: Ref<SnLayoutStyleValue | undefined>;
  /** Style passthrough applied to SnLayoutHeader. */
  headerStyle: Ref<SnLayoutStyleValue | undefined>;
  /** Style passthrough applied to SnLayoutFooter. */
  footerStyle: Ref<SnLayoutStyleValue | undefined>;
  /** Style passthrough applied to SnLayoutSider. */
  siderStyle: Ref<SnLayoutStyleValue | undefined>;
  /** Whether the child is registered inside a layout. */
  isInsideLayout: true;
}

export const SN_LAYOUT_KEY: InjectionKey<SnLayoutContext> = Symbol('sn-layout');
