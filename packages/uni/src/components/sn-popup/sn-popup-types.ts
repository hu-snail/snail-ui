/**
 * sn-popup — shared inject contract (uni-end).
 *
 * Lives beside the SFC because `<script setup>` cannot export values. The
 * popup provides the drag-lock signal so a scrolled panel body can stand down
 * while the grabber owns the gesture: without it the inner `scroll-view` keeps
 * consuming touchmove and the drag fights the scroll (the sheet stutters, or
 * the list scrolls instead of the sheet following the finger).
 */

import type { InjectionKey, Ref } from 'vue';

/** Provided by `sn-popup`; consumed by panels that scroll their own content. */
export interface SnPopupDragContext {
  /**
   * `true` while the grabber is being dragged (from touchstart to the release
   * that either closes the sheet or settles it back). A consumer should stop
   * scrolling its content for the duration.
   */
  isDragging: Ref<boolean>;
}

export const SN_POPUP_DRAG_KEY: InjectionKey<SnPopupDragContext> = Symbol('sn-popup-drag');
