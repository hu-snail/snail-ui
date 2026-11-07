/**
 * Public types of the `classic` admin layout style (@snui/admin-layout).
 *
 * Each layout style owns its own contract file, so a host importing
 * `@snui/admin-layout/layouts/classic` pulls only what that style needs. The
 * shared payload shapes are re-exported here for convenience — a host typing
 * the layout's `user` / `noticeItems` props should not have to know which
 * shared piece they came from.
 */

import type { SnProNoticeItem } from '../pro-notice/sn-pro-notice-types';
import type { SnProUserProfile } from '../pro-user/sn-pro-user-types';

export type { SnProNoticeItem, SnProUserProfile };

/** Geometry of the classic style — sidebar widths in px. */
export interface SnProLayoutClassicGeometry {
  /** Expanded sidebar width. Default 224. */
  siderWidth?: number | undefined;
  /** Folded sidebar width (icon rail). Default 56. */
  siderCollapsedWidth?: number | undefined;
}
