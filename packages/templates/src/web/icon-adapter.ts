/**
 * Web-side icon adapter — turns the shared `SnIconData` path objects into Vue
 * components that `SnIcon`'s `:icon` prop accepts.
 *
 * The shared icon module deliberately holds plain path data so the uni bundle
 * never imports `@snui/vue-web`. This module is the web-only bridge: it wraps
 * that data in a functional component. Components are cached per data object so
 * repeated renders of the same icon reuse one component definition instead of
 * allocating a fresh one on every render.
 */
import { defineComponent, h, markRaw } from 'vue';
import type { IconComponent } from '@snui/vue-web';
import type { SnIconData } from '../shared/icons';

const cache = new WeakMap<SnIconData, IconComponent>();

/** Adapt shared icon data into a Vue component for `<SnIcon :icon>`. */
export function toIconComponent(data: SnIconData): IconComponent {
  const cached = cache.get(data);
  if (cached) return cached;

  const component = defineComponent({
    name: 'SnTemplateIcon',
    props: { size: { type: Number, default: 14 } },
    render() {
      return h(
        'svg',
        {
          viewBox: data.viewBox,
          width: String(this.size ?? 14),
          height: String(this.size ?? 14),
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'aria-hidden': 'true',
        },
        data.paths.map((path) => h('path', { d: path })),
      );
    },
  }) as unknown as IconComponent;

  // markRaw keeps the definition out of Vue's reactive proxy — passing a
  // component through props otherwise warns on every render.
  const raw = markRaw(component);
  cache.set(data, raw);
  return raw;
}
