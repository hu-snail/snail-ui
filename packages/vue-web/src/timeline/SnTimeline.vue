<script setup lang="ts">
/**
 * SnTimeline — vertical/horizontal event rail (AUI-WEB-DD-020).
 *
 * Reference libraries: naive-ui `n-timeline` (props mirror, §112) plus
 * arco-design timeline display modes (`direction` / `mode` /
 * `label-position`, documented divergences).
 *
 * Items (`<SnTimelineItem>`) read the shared config through
 * timeline-context.ts, register to learn their index (alternate parity)
 * and draw their own rail segment (node + line) inside a per-item grid:
 * `[opposite][rail][main]` columns (vertical) or rows (horizontal). The
 * last item's line is hidden via CSS (`:last-child`), like the reference.
 *
 * Legacy props `horizontal` / `item-placement` keep working; the new
 * `direction` / `mode` win when set.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnTimeline>
 *     <SnTimelineItem type="success" title="成功" content="已发布" time="10:00" />
 *     <SnTimelineItem type="error" content="构建失败" time="10:05" />
 *   </SnTimeline>
 */

import { computed, provide, reactive, toRef } from 'vue';
import { SN_TIMELINE_INJECTION_KEY } from './timeline-context';
import type { SnTimelineResolvedMode } from './timeline-context';

defineOptions({ name: 'SnTimeline' });

const props = withDefaults(
  defineProps<{
    /** Layout axis. Wins over the legacy `horizontal` flag when set. */
    direction?: 'vertical' | 'horizontal';
    /**
     * Which side of the axis the content sits on, or `alternate` to flip
     * per item (an item `position` overrides its parity). Vertical reads
     * left / right, horizontal reads top / bottom; off-axis values are
     * normalized. Wins over the legacy `item-placement`.
     */
    mode?: 'left' | 'right' | 'top' | 'bottom' | 'alternate';
    /**
     * Where item labels render: across the axis from the content
     * (`relative`, default) or on the content side next to the rail
     * (`same`).
     */
    labelPosition?: 'same' | 'relative';
    /** Legacy flag: lay the items out horizontally (`direction="horizontal"` preferred). */
    horizontal?: boolean;
    /** Legacy: which side the rail sits on (vertical mode only). `mode` preferred. */
    itemPlacement?: 'left' | 'right';
    /** Title scale of the items. */
    size?: 'medium' | 'large';
    /** Node/icon edge length in px. */
    iconSize?: number;
  }>(),
  {
    labelPosition: 'relative',
    horizontal: false,
    itemPlacement: 'left',
    size: 'medium',
  },
);

defineSlots<{
  /** `<SnTimelineItem>` entries (direct children). */
  default?(): unknown;
}>();

const isHorizontal = computed(
  () => props.direction === 'horizontal' || (props.direction === undefined && props.horizontal),
);

/**
 * Normalize the mode per direction: vertical reads left / right /
 * alternate, horizontal reads top / bottom / alternate; an off-axis value
 * degrades to the direction's default instead of producing a broken grid.
 * Legacy `item-placement` maps onto the vertical mode; `mode` wins.
 */
const resolvedMode = computed<SnTimelineResolvedMode>(() => {
  if (props.mode !== undefined) {
    if (isHorizontal.value) {
      return props.mode === 'bottom' || props.mode === 'alternate' ? props.mode : 'top';
    }
    return props.mode === 'right' || props.mode === 'alternate' ? props.mode : 'left';
  }
  if (isHorizontal.value) return 'top';
  return props.itemPlacement === 'right' ? 'right' : 'left';
});

// ---- item registry (alternate parity) ------------------------------------

const itemIds = reactive<number[]>([]);
let nextItemId = 1;

provide(SN_TIMELINE_INJECTION_KEY, {
  direction: computed(() => (isHorizontal.value ? 'horizontal' : 'vertical')),
  mode: resolvedMode,
  labelPosition: toRef(props, 'labelPosition'),
  size: toRef(props, 'size'),
  iconSize: toRef(props, 'iconSize'),
  registerItem: () => {
    const id = nextItemId;
    nextItemId += 1;
    itemIds.push(id);
    return {
      id,
      index: computed(() => {
        const at = itemIds.indexOf(id);
        return at === -1 ? 0 : at;
      }),
      unregister: () => {
        const at = itemIds.indexOf(id);
        if (at >= 0) itemIds.splice(at, 1);
      },
    };
  },
});
</script>

<template>
  <div
    data-snui-component="timeline"
    class="sn-timeline"
    :class="[
      isHorizontal ? 'sn-timeline--horizontal' : 'sn-timeline--vertical',
      `sn-timeline--mode-${resolvedMode}`,
      !isHorizontal && resolvedMode === 'left' ? 'sn-timeline--left-placement' : '',
      !isHorizontal && resolvedMode === 'right' ? 'sn-timeline--right-placement' : '',
      `sn-timeline--${size}-size`,
    ]"
    :style="{ '--sn-timeline-icon-size': `${iconSize ?? 14}px` }"
  >
    <slot />
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-timeline {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  /* Reference titleMargin / titleFontSize / iconSize per size.
   * Rail = naive lineColor → rendered as the ≈6%-ink hairline mix
   * (--sn-web-color-border-subtle reads one step heavier). */
  --sn-timeline-title-margin: 0 0 6px 0;
  --sn-timeline-title-font-size: 14px;
  --sn-timeline-line-color: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 6%,
    var(--sn-web-color-background-surface)
  );
  /* Rail cell edge (the node + gutter zone) and the axis position within
   * it. The axis is consumed by the item's absolutely positioned node and
   * line; `100%` / `50%` resolve against the rail cell box. */
  --sn-timeline-rail-w: calc(var(--sn-timeline-icon-size) + 12px);
  --sn-timeline-rail-h: calc(var(--sn-timeline-icon-size) + 12px);
  --sn-timeline-axis: calc(var(--sn-timeline-icon-size) / 2);
  /* Where the node's top edge sits: centered on the title line. */
  --sn-timeline-node-top: calc(
    var(--sn-timeline-title-font-size) * 1.25 / 2 - var(--sn-timeline-icon-size) / 2
  );
}

.sn-timeline--large {
  --sn-timeline-title-margin: -2px 0 6px 0;
  --sn-timeline-title-font-size: 16px;
}

/* Vertical modes: right-side rail centers the axis in its wider cell. */
.sn-timeline--mode-right {
  --sn-timeline-axis: calc(100% - var(--sn-timeline-icon-size) / 2);
}

.sn-timeline--mode-alternate {
  --sn-timeline-axis: 50%;
}

/* Horizontal modes: the rail is a horizontal band; the axis is its y. */
.sn-timeline--horizontal {
  flex-direction: row;
  /* Items stay gap-separated so the per-item line can bridge through the
   * gap (the line extends by the same amount). */
  column-gap: 40px;
  --sn-timeline-axis-y: calc(var(--sn-timeline-icon-size) / 2);
}

.sn-timeline--horizontal.sn-timeline--mode-bottom {
  --sn-timeline-axis-y: calc(100% - var(--sn-timeline-icon-size) / 2);
}

.sn-timeline--horizontal.sn-timeline--mode-alternate {
  --sn-timeline-axis-y: 50%;
}
</style>
