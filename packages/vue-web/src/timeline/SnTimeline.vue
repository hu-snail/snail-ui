<script setup lang="ts">
/**
 * SnTimeline — vertical/horizontal event rail (AUI-WEB-DD-020).
 *
 * Reference library: naive-ui `n-timeline`
 *   (https://www.naiveui.com/zh-CN/light/components/timeline)
 * Per AGENTS.md §112, props mirror n-timeline 1:1:
 *   horizontal / item-placement / size / icon-size.
 *
 * Items (`<SnTimelineItem>`) read the shared config through
 * timeline-context.ts and draw their own rail segment (node circle + line).
 * The last item's line is hidden via CSS (`:last-child`), like the
 * reference.
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

import { provide, toRef } from 'vue'
import { SN_TIMELINE_INJECTION_KEY } from './timeline-context'

defineOptions({ name: 'SnTimeline' })

const props = withDefaults(
  defineProps<{
    /** Lay the items out horizontally. */
    horizontal?: boolean
    /** Which side the rail sits on (ignored while horizontal). */
    itemPlacement?: 'left' | 'right'
    /** Title scale of the items. */
    size?: 'medium' | 'large'
    /** Node/icon edge length in px. */
    iconSize?: number
  }>(),
  {
    horizontal: false,
    itemPlacement: 'left',
    size: 'medium',
  },
)

defineSlots<{
  /** `<SnTimelineItem>` entries. */
  default?(): unknown
}>()

provide(SN_TIMELINE_INJECTION_KEY, {
  horizontal: toRef(props, 'horizontal'),
  itemPlacement: toRef(props, 'itemPlacement'),
  size: toRef(props, 'size'),
  iconSize: toRef(props, 'iconSize'),
})
</script>

<template>
  <div
    data-snui-component="timeline"
    class="sn-timeline"
    :class="[
      horizontal ? 'sn-timeline--horizontal' : '',
      !horizontal ? `sn-timeline--${itemPlacement}-placement` : '',
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
}

.sn-timeline--large {
  --sn-timeline-title-margin: -2px 0 6px 0;
  --sn-timeline-title-font-size: 16px;
}

.sn-timeline--horizontal {
  flex-direction: row;
}
</style>
