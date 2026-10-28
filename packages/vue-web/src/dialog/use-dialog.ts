/**
 * useDialog — imperative dialog API (naive `useDialog` parity, AUI-WEB-FB-001).
 *
 * Wrap the subtree in `<SnDialogProvider>` and call `useDialog()` anywhere
 * below it to open typed dialogs programmatically:
 *
 *   const dialog = useDialog();
 *   dialog.success({ title: '成功', content: '厉害', positiveText: '哇' });
 *   dialog.warning({
 *     title: '警告',
 *     content: '你确定?',
 *     positiveText: '确定',
 *     negativeText: '不确定',
 *     onPositiveClick() { … },          // return false to keep it open
 *   });
 *
 * Each call returns a `DialogReactive` — a reactive options object whose
 * fields can be mutated live (`d.title = '…'`) and which carries
 * `destroy()` for programmatic dismissal.
 */
import { inject } from 'vue';
import type { InjectionKey, VNodeChild } from 'vue';
import type { IconComponent } from '../icon/sn-icon-registry';

/** Options accepted by every `useDialog` factory method (naive parity subset). */
export interface SnDialogOptions {
  /** Semantic type — drives the icon badge colour and glyph. */
  type?: 'info' | 'success' | 'warning' | 'error' | 'default';
  /** Panel title. */
  title?: string;
  /** Body text, or a render function producing the body. */
  content?: string | (() => VNodeChild);
  /** Custom icon glyph (rendered inside the coloured badge). */
  icon?: IconComponent;
  /** Show the type icon badge. Default `true`. */
  showIcon?: boolean;
  /** Show the close button. Default `true`. */
  closable?: boolean;
  /** Icon above the title (`'top'`) or inline before it (`'left'`, default). */
  iconPlacement?: 'left' | 'top';
  /** Confirm button label. Omit to hide the button. */
  positiveText?: string;
  /** Cancel button label. Omit to hide the button. */
  negativeText?: string;
  /** Extra props forwarded to the confirm button. */
  positiveButtonProps?: Record<string, unknown>;
  /** Extra props forwarded to the cancel button. */
  negativeButtonProps?: Record<string, unknown>;
  /** Draw a border around the panel. Default `false`. */
  bordered?: boolean;
  /**
   * Confirm handler. Returning `false` keeps the dialog open; returning a
   * Promise shows the confirm button's loading state and closes when the
   * promise settles (unless it resolves to `false`) — naive parity.
   */
  onPositiveClick?: () => boolean | void | Promise<boolean | void>;
  /** Cancel handler. Returning `false` keeps the dialog open. */
  onNegativeClick?: () => boolean | void | Promise<boolean | void>;
  /** Close-button handler, fired before the dialog hides. */
  onClose?: () => void;
}

/** A live dialog instance: reactive options plus `destroy()`. */
export interface DialogReactive extends SnDialogOptions {
  /** Internal instance id. */
  readonly id: number;
  /** Internal visibility flag (drives the overlay transition). */
  show: boolean;
  /** Internal loading mirror for the async confirm flow. */
  loading: boolean;
  /** Close and remove the dialog. */
  destroy: () => void;
}

/** API returned by `useDialog()` (naive `DialogApiInjection` parity). */
export interface DialogApiInjection {
  info: (options: SnDialogOptions) => DialogReactive;
  success: (options: SnDialogOptions) => DialogReactive;
  warning: (options: SnDialogOptions) => DialogReactive;
  error: (options: SnDialogOptions) => DialogReactive;
  /** Open a dialog with an explicit `type` (default `'default'`). */
  create: (options: SnDialogOptions) => DialogReactive;
  /** Hide and remove every dialog opened through this provider. */
  destroyAll: () => void;
}

export const snDialogApiInjectionKey: InjectionKey<DialogApiInjection> = Symbol('sn-dialog-api');

/**
 * Imperative dialog API. Must be called inside a `<SnDialogProvider>`
 * subtree — the provider owns the overlay rendering and lifetime.
 */
export function useDialog(): DialogApiInjection {
  const api = inject(snDialogApiInjectionKey, null);
  if (!api) {
    throw new Error('[snui] useDialog() requires a <SnDialogProvider> ancestor.');
  }
  return api;
}
