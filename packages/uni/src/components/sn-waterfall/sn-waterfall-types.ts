/**
 * sn-waterfall contract — context injected by `sn-waterfall` into descendant
 * `sn-img` instances: the container-level lazy-load config that an image
 * inherits when it does not set `lazyLoad` itself.
 *
 * Mirrors the provide/inject shape of `sn-grid-types` (SnGridContext): the
 * container publishes flags through `provide()`, items read them back so a
 * single prop on the container drives every nested image.
 */

import type { InjectionKey, Ref } from 'vue';

/** Context injected by `SnWaterfall` into child `SnImg` instances. */
export interface SnWaterfallContext {
  /** Container-level image lazy-load config (native `<image lazy-load>`). */
  lazyLoad: Ref<boolean>;
}

export const SN_WATERFALL_KEY: InjectionKey<SnWaterfallContext> = Symbol('sn-waterfall');
