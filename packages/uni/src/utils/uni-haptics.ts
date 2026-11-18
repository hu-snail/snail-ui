/**
 * Shared haptic helper — short vibration through the host uni API.
 *
 * Mirrors the guard pattern first shipped in `sn-segmented`: H5 hosts have no
 * vibration motor and tests have no `uni` global, so the call is skipped
 * silently unless the runtime exposes `vibrateShort`. A host that rejects the
 * API must never break the interaction that triggered it (vibration is
 * decorative).
 *
 * The host is resolved through `resolveUniHost` (AUI-UNI-FB-012): the free
 * identifier `uni` is the only channel the classic uni-app compilers rewrite,
 * so the helper works unchanged on App / mini-programs / uni-app x.
 */

import { resolveUniHost } from './uni-host';

/** `uni.vibrateShort` intensity — hosts that ignore the field stay default. */
export type VibrateShortType = 'heavy' | 'medium' | 'light';

/** Fire one short haptic tick. No-op when the host cannot vibrate. */
export function vibrateShort(type: VibrateShortType = 'light'): void {
  const host = resolveUniHost<{ vibrateShort?: (opts?: object) => unknown }>();
  if (typeof host?.vibrateShort !== 'function') return;
  try {
    host.vibrateShort({ type });
  } catch {
    /* Vibration is decorative — a host that rejects the API must not break the gesture. */
  }
}
