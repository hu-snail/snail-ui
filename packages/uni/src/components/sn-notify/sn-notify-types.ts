/**
 * sn-notify 公共类型契约 — 独立成纯 ts 模块（sn-icon-types 模式）：
 * uni-app x 产物（@snui/uni-x）里只有 .uvue，场景源从 `.vue` 导入类型会因
 * 无实体可挂而失败，因此类型本体放这里，SFC 从这里 import / re-export。
 */

import type { IconData } from '../sn-icon/sn-icon-types';

/** Semantic color of a card: title, glyph and close pill. */
export type NotifyType = 'default' | 'primary' | 'success' | 'warning' | 'danger';

/** Anchor of the stack. */
export type NotifyPosition = 'top' | 'bottom';

/** Options for one queued message. */
export interface SnNotifyOptions {
  /** Bold headline line. */
  title: string;
  /** Secondary description line; `\n` renders as a line break. */
  description?: string;
  /** Semantic color; drives the default glyph, title and close pill. */
  type?: NotifyType;
  /** Custom glyph (`IconData`); `null` hides the icon. Default per `type`. */
  icon?: IconData | null;
  /** Auto-dismiss delay in ms; `0` keeps the card until dismissed. */
  duration?: number;
  /** Render the close pill. */
  closable?: boolean;
  /** Close pill label; `''` renders an icon-only (X) pill. */
  closeText?: string;
  /** Card background color override (any CSS color). */
  background?: string;
  /** Title color override (any CSS color). */
  color?: string;
  /** Card corner radius (bare number = rpx). */
  radius?: number | string;
  /** Custom class for this card. */
  customClass?: string;
  /** Custom inline style for this card. */
  customStyle?: string;
}

/** Payload of the `open` / `click` events. */
export interface SnNotifyOpenPayload {
  id: string;
  title: string;
  description: string;
  type: NotifyType;
}

/** Payload of the `close` event. */
export interface SnNotifyClosePayload {
  id: string;
  /** Why the card left: timer, close pill, swipe, ref API or queue overflow. */
  reason: 'auto' | 'close' | 'swipe' | 'api' | 'overflow';
}

/** Imperative handle exposed through the template ref. */
export interface SnNotifyInstance {
  /** Queue a message; returns its id. */
  show(options: SnNotifyOptions): string;
  /** Dismiss a message by id (reason `api`). */
  hide(id: string): void;
  /** Dismiss every queued message (reason `api`). */
  hideAll(): void;
}
