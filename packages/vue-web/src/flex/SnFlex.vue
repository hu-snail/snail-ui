<script setup lang="ts">
/**
 * SnFlex — web-end generic flex container primitive (AUI-WEB-LAYOUT-004).
 *
 * Reference library: naive-ui `n-flex`
 *   (https://www.naiveui.com/zh-CN/light/components/flex)
 * Per AGENTS.md §112, props + semantics mirror n-flex 1:1 on the props
 * implemented here. `reverse` is a §112 future marker (see
 * ai-description.md).
 *
 * Difference vs SnSpace (AUI-WEB-LAYOUT-003): Space is the "gap between
 * children" semantic component; Flex is the raw flex container primitive —
 * the gap prop is a direct px value / preset / tuple with no further
 * semantics attached.
 *
 * `expand` is a snail extension (n-flex main has no such prop): when true,
 * direct children get `flex: 1 1 auto` so they grow to fill the free main
 * axis space.
 *
 * 1:1 parity (this version): vertical / gap(size) / wrap / justify / align /
 * inline. Snail extensions beyond n-flex: expand / customClass / customStyle.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnFlex>...</SnFlex>
 *   <SnFlex vertical :gap="16">...</SnFlex>
 *   <SnFlex justify="space-between" align="center" expand>...</SnFlex>
 */

import { computed } from 'vue';

defineOptions({ name: 'SnFlex' });

/** Gap preset, mirroring n-flex `size` presets (theme gaps: 8/12/16 px). */
export type SnFlexGapPreset = 'small' | 'medium' | 'large';

/**
 * Gap value: px number, preset, or `[horizontal, vertical]` px tuple —
 * same value domain as n-flex `size`.
 */
export type SnFlexGap = number | SnFlexGapPreset | [number, number];

/** Mirrors n-flex `justify` (FlexJustify) values. */
export type SnFlexJustify =
  'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';

/** Mirrors n-flex `align` (FlexAlign) values. */
export type SnFlexAlign =
  'stretch' | 'baseline' | 'start' | 'end' | 'center' | 'flex-start' | 'flex-end';

// Reference: naive-ui flexProps
//   (https://github.com/tusen-ai/naive-ui/blob/main/src/flex/src/Flex.tsx)
const props = withDefaults(
  defineProps<{
    /** Stack children vertically (column). Default false (row). */
    vertical?: boolean;
    /** Gap between children: px number, preset, or [horizontal, vertical] tuple. Default 'medium'. */
    gap?: SnFlexGap;
    /** Let horizontal children wrap across lines. Default true. */
    wrap?: boolean;
    /** Main-axis distribution, passed through as-is (like n-flex). Default 'start'. */
    justify?: SnFlexJustify;
    /** Cross-axis alignment. Default undefined (CSS 'normal', like n-flex). */
    align?: SnFlexAlign;
    /** Render as inline-flex. Default false. */
    inline?: boolean;
    /** Grow direct children to fill the free main-axis space (snail extension). Default false. */
    expand?: boolean;
    /** Extra class appended to the container (snail extension). Default ''. */
    customClass?: string;
    /** Inline style appended to the container (snail extension). Default ''. */
    customStyle?: string | Record<string, string>;
  }>(),
  {
    vertical: false,
    gap: 'medium',
    wrap: true,
    justify: 'start',
    // `align` stays optional (undefined default = CSS 'normal'); an explicit
    // `align: undefined` entry is rejected under exactOptionalPropertyTypes.
    inline: false,
    expand: false,
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** Direct children are flex items of the container. */
  default?(): unknown;
}>();

/** Preset fallbacks (px) — mirror the n-flex theme gap tokens. */
const GAP_PRESET_FALLBACK: Record<SnFlexGapPreset, number> = {
  small: 8,
  medium: 12,
  large: 16,
};

const isGapPreset = (value: unknown): value is SnFlexGapPreset =>
  value === 'small' || value === 'medium' || value === 'large';

/**
 * Resolve a single gap element to a CSS length. Presets map to
 * `--sn-web-space-gap-*` tokens (shared spacing tokens with SnSpace) with
 * literal fallbacks, the sanctioned override-hook shape per the tokens-web
 * alias guard. Invalid numbers fall back to the medium preset so a bad
 * binding degrades predictably instead of emitting `NaNpx`.
 */
const resolveGapValue = (value: number | SnFlexGapPreset): string => {
  if (isGapPreset(value)) {
    return `var(--sn-web-space-gap-${value}, ${GAP_PRESET_FALLBACK[value]}px)`;
  }
  const n = Number(value);
  if (Number.isFinite(n)) return `${n}px`;
  return `var(--sn-web-space-gap-medium, ${GAP_PRESET_FALLBACK.medium}px)`;
};

const gapStyle = computed<{ rowGap: string; columnGap: string }>(() => {
  const gap = props.gap;
  // Tuple is [horizontal, vertical] → column-gap / row-gap (n-flex `size`).
  if (Array.isArray(gap)) {
    const [horizontal, vertical] = gap;
    return {
      columnGap: resolveGapValue(horizontal),
      rowGap: resolveGapValue(vertical),
    };
  }
  const resolved = resolveGapValue(gap);
  return { columnGap: resolved, rowGap: resolved };
});

const containerStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {
    display: props.inline ? 'inline-flex' : 'flex',
    flexDirection: props.vertical ? 'column' : 'row',
    // n-flex passes justify through as-is ('start'/'end' are valid CSS
    // Box Alignment values) — unlike n-space which normalizes to flex-*.
    justifyContent: props.justify,
    // Reference (n-flex): `!wrap || vertical` forces nowrap — a vertical
    // stack never wraps across columns even with wrap=true.
    flexWrap: !props.wrap || props.vertical ? 'nowrap' : 'wrap',
    rowGap: gapStyle.value.rowGap,
    columnGap: gapStyle.value.columnGap,
  };
  if (props.align) style.alignItems = props.align;
  return style;
});

const classList = computed(() => [
  'sn-flex',
  {
    'sn-flex--vertical': props.vertical,
    'sn-flex--inline': props.inline,
    'sn-flex--expand': props.expand,
    'sn-flex--nowrap': !props.wrap,
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
.sn-flex {
  box-sizing: border-box;
}

/* expand (snail extension): direct children grow to fill the free
 * main-axis space. Flex shrink/basis stay at the CSS default so content
 * can still shrink below its basis when space is tight. */
.sn-flex--expand > :deep(*) {
  flex: 1 1 auto;
}
</style>
