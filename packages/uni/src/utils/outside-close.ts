/**
 * Outside-tap close queue (wot-ui `useQueue` / `closeOutside` parity).
 *
 * uni-app components cannot listen to taps outside their own subtree, so the
 * library cannot self-contain "tap outside closes me". Instead every overlay
 * component (tooltip, popover, drop-menu, toast, swipe-action, fab) registers
 * an idempotent close here while mounted, and the page root — or any wrapper —
 * binds the tap-bubbling handler:
 *
 *   <view @tap="closeOutside"> … page content … </view>
 *
 *   import { useQueue } from '@snui/uni';
 *   const { closeOutside } = useQueue();
 *
 * A tap anywhere that is not stopped bubbles to that root and closes every
 * open overlay at once; triggers bind `@tap.stop` so opening a bubble never
 * immediately closes it again. Tapping a second trigger therefore switches
 * bubbles in one gesture: the first tap bubbles (closing the first bubble)
 * only where it is not stopped.
 */

interface OutsideClosable {
  /** Stable per-instance id (component `uid`). */
  id: number;
  /** Idempotent close — must no-op when the overlay is already closed. */
  close: () => void;
}

/** All mounted overlay instances, keyed by instance id (dedup safe). */
const queue = new Map<number, OutsideClosable>();

/** Register an overlay instance (call from `onMounted`). */
export function registerOutsideClosable(id: number, close: () => void): void {
  queue.set(id, { id, close });
}

/** Remove an overlay instance (call from `onBeforeUnmount`). */
export function unregisterOutsideClosable(id: number): void {
  queue.delete(id);
}

/** Close every registered overlay. Each close is idempotent. */
export function closeOutside(): void {
  for (const entry of [...queue.values()]) entry.close();
}

/** wot-ui `useQueue` parity — returns the outside-close dispatcher. */
export function useQueue(): { closeOutside: () => void } {
  return { closeOutside };
}
