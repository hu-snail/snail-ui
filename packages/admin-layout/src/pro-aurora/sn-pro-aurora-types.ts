/**
 * Public types of the `aurora` admin layout style (@snui/admin-layout).
 *
 * Same contract-file convention as `sn-pro-classic-types.ts`: each layout style
 * owns its own type module so a host importing
 * `@snui/admin-layout/layouts/aurora` pulls only what that style needs. The
 * shared payload shapes (`SnProNoticeItem` / `SnProUserProfile`) are
 * re-exported here for convenience.
 */

import type { SnProNoticeItem } from '../pro-notice/sn-pro-notice-types';
import type { SnProUserProfile } from '../pro-user/sn-pro-user-types';

export type { SnProNoticeItem, SnProUserProfile };

/**
 * Full-bleed background preset of the aurora style.
 *
 * | type       | 效果                         | 需要的配置            |
 * | ---------- | ---------------------------- | --------------------- |
 * | `solid`    | 纯色（token 面，暗色自动翻转） | —                     |
 * | `image`    | 背景图（cover，居中）         | `backgroundImage`     |
 * | `gradient` | 两处渐变光晕                  | `backgroundColors?`   |
 * | `mesh`     | 弥散（四向模糊色斑）          | `backgroundColors?`   |
 */
export type SnProLayoutAuroraBackground = 'solid' | 'image' | 'gradient' | 'mesh';

/** Light/dark appearance the header toggle switches between. */
export type SnProLayoutAuroraMode = 'light' | 'dark';

/** Locale the header switch toggles between. Host-owned — the layout never translates. */
export type SnProLayoutAuroraLocale = 'zh' | 'en';

/** Geometry of the aurora style — px. */
export interface SnProLayoutAuroraGeometry {
  /** Width of the floating primary-icon rail. Default 64. */
  railWidth?: number | undefined;
  /** Minimum height of the top bar. Default 64. */
  headerHeight?: number | undefined;
}

/** Glyphs shown by the built-in locale switch (the label of the *other* locale). */
export interface SnProLayoutAuroraLocaleLabels {
  /** Shown while the layout is in the `en` locale. Default '中'. */
  zh?: string | undefined;
  /** Shown while the layout is in the `zh` locale. Default 'EN'. */
  en?: string | undefined;
}
