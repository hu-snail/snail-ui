/**
 * sn-tabs contract — shared types for `sn-tabs` / `sn-tab`.
 *
 * The container provides this context through `provide()`; panes read it with
 * `inject()` and derive their own visibility. Registration order is DOM order,
 * which is what the index-based `v-model` resolves against.
 */

import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type { IconData } from '../sn-icon/sn-icon.vue';

/** Value shared by the container's selection and each pane's `name`. */
export type SnTabsValue = number | string;

/** Active-bar style — mirrors `wd-tabs` `line-theme`. */
export type SnTabsLineTheme = 'normal' | 'text' | 'underline' | 'dot';

/** Scroll-navigation mode — mirrors `wd-tabs` `slidable`. */
export type SnTabsSlidable = 'auto' | 'always';

/**
 * Nav-strip visual form (AUI-OPT-10, AGENTS.md §112.3a):
 *   - `line` 下划线底部条（默认，wd-tabs 原生形态）
 *   - `card` 卡片分段（描边分段，选中项浮起）
 *   - `tag`  独立胶囊标签（选中项实心填充）
 */
export type SnTabsType = 'line' | 'card' | 'tag';

/**
 * Active-item emphasis, independent of `type` (AUI-OPT-10, §112.3a):
 *   - `text` 仅文字强调（含底部条）
 *   - `fill` 选中项浅色圆角底
 *   - `pill` 选中项实心胶囊底
 */
export type SnTabsActiveTheme = 'text' | 'fill' | 'pill';

/** Content-area `<swiper>` easing — mirrors uni-app `swiper` `easing-function`. */
export type SnTabsSwiperEasing =
  'default' | 'linear' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic';

/**
 * Badge config for a tab title — mirrors wd-tab `badge-props`
 * (`Partial<BadgeProps>`). The container spreads it onto `sn-badge`, so the
 * field names / optionality mirror the badge component's own props.
 */
export interface SnTabBadgeProps {
  /** Display value; a number above `max` shows `{max}+`. */
  value?: string | number | undefined;
  /** Overflow cap for numeric values. */
  max?: number | undefined;
  /** Positive values nudge the marker down (numbers are px). */
  top?: string | number | undefined;
  /** Positive values nudge the marker left (numbers are px). */
  right?: string | number | undefined;
  /** Render a dot instead of a value. */
  isDot?: boolean;
  /** Hide the badge entirely. */
  hidden?: boolean;
  /** Colour preset. */
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | undefined;
  /** Inline background override. */
  bgColor?: string;
  /** Render `0` instead of suppressing it. */
  showZero?: boolean;
  /** Marker shape. */
  shape?: 'circle' | 'square' | 'bubble';
  /** Draw the surface-coloured separator ring. */
  border?: boolean;
  /** Extra class on the badge root. */
  customClass?: string;
  /** Inline style on the badge root. */
  customStyle?: string;
}

/** One registered pane. Getters keep the container's render reactive. */
export interface SnTabEntry {
  /** Stable registration id (DOM order). */
  uid: number;
  /** Pane name, `undefined` when the pane relies on its index. */
  getName: () => SnTabsValue | undefined;
  /** Pane title. */
  getTitle: () => string;
  /** Pane disabled flag. */
  getDisabled: () => boolean;
  /** Tab icon: `IconData` object or a registered / provider icon name. */
  getIcon: () => IconData | string | undefined;
  /** Tab icon image address (URL / base64); wins over `getIcon`. */
  getIconImage: () => string;
  /** Badge config for the title, `undefined` when no badge is wanted. */
  getBadge: () => SnTabBadgeProps | undefined;
}

/** Context injected by `SnTabs` into child `SnTab` instances. */
export interface SnTabsContext {
  /** Currently active value (name or index). */
  activeValue: Ref<SnTabsValue>;
  /** Whether the pane at `index` (or with `name`) is the active one. */
  isActive: (index: number, name: SnTabsValue | undefined) => boolean;
  /** Register a pane; returns its index inside the container. */
  registerTab: (entry: SnTabEntry) => number;
  /** Drop a pane when it unmounts. */
  unregisterTab: (uid: number) => void;
  /** True while the content area renders as a `<swiper>` (AUI-OPT-10). */
  swiperMode: ComputedRef<boolean>;
}

export const SN_TABS_KEY: InjectionKey<SnTabsContext> = Symbol('sn-tabs');
