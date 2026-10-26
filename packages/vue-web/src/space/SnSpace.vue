<script setup lang="ts">
/**
 * SnSpace — web-end child-spacing container (AUI-WEB-LAYOUT-003).
 *
 * Reference library: naive-ui `n-space`
 *   (https://www.naiveui.com/zh-CN/light/components/space)
 * Per AGENTS.md §112, props + semantics mirror n-space 1:1 on the props
 * implemented here. `reverse` / `wrapItem` / `itemClass` / `itemStyle` are
 * §112 future markers (see ai-description.md).
 *
 * Implementation note (why CSS gap instead of the n-space margin chain):
 * flex-gap support is guaranteed on the web targets we ship, and gap keeps
 * the DOM flat — children render as-is without the per-item wrapper divs
 * `wrapItem` would otherwise require. `wrapItem` is therefore omitted for
 * good, not cut for scope.
 *
 * 1:1 parity (this version): vertical / size / wrap / justify / align /
 * inline. Snail extensions beyond n-space: customClass / customStyle.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnSpace>...</SnSpace>
 *   <SnSpace vertical :size="24">...</SnSpace>
 *   <SnSpace :size="[4, 8]" justify="space-between">...</SnSpace>
 */

import { computed } from 'vue';

defineOptions({ name: 'SnSpace' });

/** Gap preset, mirroring n-space `size` presets (theme gaps: 8/12/16 px). */
export type SnSpaceGapPreset = 'small' | 'medium' | 'large';

/**
 * Gap value: px number, preset, or `[horizontal, vertical]` px tuple —
 * matches n-space `size` (SpaceSize).
 */
export type SnSpaceGap = number | SnSpaceGapPreset | [number, number];

/** Mirrors n-space `justify` (Justify) values + raw flex keywords. */
export type SnSpaceJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly'
  | 'flex-start'
  | 'flex-end';

/** Mirrors n-space `align` (Align) values. */
export type SnSpaceAlign =
  'stretch' | 'baseline' | 'start' | 'end' | 'center' | 'flex-start' | 'flex-end';

// Reference: naive-ui spaceProps
//   (https://github.com/tusen-ai/naive-ui/blob/main/src/space/src/Space.tsx)
const props = withDefaults(
  defineProps<{
    /** Stack children vertically (column). Default false (row). */
    vertical?: boolean;
    /** Gap between children: px number, preset, or [horizontal, vertical] tuple. Default 'medium'. */
    size?: SnSpaceGap;
    /** Let horizontal children wrap across lines. Default true. */
    wrap?: boolean;
    /** Main-axis distribution. Default 'start' (→ flex-start, like n-space). */
    justify?: SnSpaceJustify;
    /** Cross-axis alignment. Default undefined (CSS 'normal', like n-space). */
    align?: SnSpaceAlign;
    /** Render as inline-flex. Default false. */
    inline?: boolean;
    /** Extra class appended to the container (snail extension). Default ''. */
    customClass?: string;
    /** Inline style appended to the container (snail extension). Default ''. */
    customStyle?: string | Record<string, string>;
  }>(),
  {
    vertical: false,
    size: 'medium',
    wrap: true,
    justify: 'start',
    // `align` stays optional (undefined default = CSS 'normal'); an explicit
    // `align: undefined` entry is rejected under exactOptionalPropertyTypes.
    inline: false,
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** Direct children are spaced by the container gap. */
  default?(): unknown;
}>();

/** Preset fallbacks (px) — mirror the n-space theme gap tokens. */
const GAP_PRESET_FALLBACK: Record<SnSpaceGapPreset, number> = {
  small: 8,
  medium: 12,
  large: 16,
};

const isGapPreset = (value: unknown): value is SnSpaceGapPreset =>
  value === 'small' || value === 'medium' || value === 'large';

/**
 * Resolve a single gap element to a CSS length. Presets map to
 * `--sn-web-space-gap-*` tokens with literal fallbacks (the sanctioned
 * override-hook shape per the tokens-web alias guard). Invalid numbers
 * fall back to the medium preset so a bad binding degrades predictably
 * instead of emitting `NaNpx`.
 */
const resolveGapValue = (value: number | SnSpaceGapPreset): string => {
  if (isGapPreset(value)) {
    return `var(--sn-web-space-gap-${value}, ${GAP_PRESET_FALLBACK[value]}px)`;
  }
  const n = Number(value);
  if (Number.isFinite(n)) return `${n}px`;
  return `var(--sn-web-space-gap-medium, ${GAP_PRESET_FALLBACK.medium}px)`;
};

const gapStyle = computed<{ rowGap: string; columnGap: string }>(() => {
  const size = props.size;
  // n-space tuple is [horizontal, vertical] → column-gap / row-gap.
  if (Array.isArray(size)) {
    const [horizontal, vertical] = size;
    return {
      columnGap: resolveGapValue(horizontal),
      rowGap: resolveGapValue(vertical),
    };
  }
  const gap = resolveGapValue(size);
  return { columnGap: gap, rowGap: gap };
});

/** n-space maps start/end → flex-start/flex-end; other values pass through. */
const justifyStyle = computed<string>(() => {
  if (props.justify === 'start') return 'flex-start';
  if (props.justify === 'end') return 'flex-end';
  return props.justify;
});

const containerStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {
    display: props.inline ? 'inline-flex' : 'flex',
    flexDirection: props.vertical ? 'column' : 'row',
    justifyContent: justifyStyle.value,
    // Reference (n-space): `!wrap || vertical` forces nowrap — a vertical
    // stack never wraps across columns even with wrap=true.
    flexWrap: !props.wrap || props.vertical ? 'nowrap' : 'wrap',
    rowGap: gapStyle.value.rowGap,
    columnGap: gapStyle.value.columnGap,
  };
  if (props.align) style.alignItems = props.align;
  return style;
});

const classList = computed(() => [
  'sn-space',
  {
    'sn-space--vertical': props.vertical,
    'sn-space--inline': props.inline,
    'sn-space--nowrap': !props.wrap,
  },
  props.customClass,
]);

const extraStyle = computed<string | Record<string, string> | undefined>(() => {
  if (typeof props.customStyle === 'string') {
    return props.customStyle === '' ? undefined : props.customStyle;
  }
  return props.customStyle;
});
</script>

<template>
  <div :class="classList" :style="[containerStyle, extraStyle]">
    <slot />
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Gap values are inline styles
 * referencing --sn-web-space-gap-* tokens with literal fallbacks. */
.sn-space {
  box-sizing: border-box;
}
</style>
