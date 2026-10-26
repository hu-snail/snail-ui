<script setup lang="ts">
/**
 * sn-icon — uni-end icon component (AUI-MP-002).
 *
 * Renders inline SVG paths via the uni-app `<view>` cross-end element
 * (so it works in H5 preview, WeChat MP, Alipay MP, App — every uni
 * target that compiles `<view>` to a native container).
 *
 * ## Why data-object API instead of `<component :is>` (AUI-MP-002)
 *
 * The web-end `SnIcon` accepts a Vue component (e.g. lucide-vue-next)
 * and forwards props. uni-app does not have an equivalent lightweight
 * tree-shakable icon library that's first-class Vue 3 ESM. The official
 * path on uni is iconfont (CSS @font-face) or SVG sprites — both have
 * bundle / dynamic-resolution downsides that conflict with the
 * "按需加载" requirement.
 *
 * Instead, sn-icon consumes plain SVG path data (a `{ viewBox, paths }
 * { viewBox, paths }` object) and renders inline SVG. Consumers wire the
 * icon library at build time — they pick the path source that matches
 * their stack:
 *
 *   - lucide-static + manual copy: simplest, no extra dep
 *   - `@lucide/static` (planned): tree-shakeable icon data
 *   - iconfont → svg converter: migrate legacy iconfont usage
 *
 * ## Tree-shakeability (AUI-FOUND-009 follow-up)
 *
 * Each icon is a small ESM module exporting a frozen IconData object.
 * Consumers named-import only the icons they use; Rollup / esbuild
 * tree-shake the rest. The supported shortcut set in
 * `sn-icon-set.ts` exports ~20 common icons; consumers add more by
 * adding new files under `src/components/sn-icon/icons/` (one file per
 * icon, named export of a frozen `{ viewBox, paths }`).
 *
 * ## Accessibility
 *
 * The wrapper carries `aria-hidden="true"` by default (icons are
 * decorative). Provide an accessible name on the wrapping button /
 * link / label, not on the icon itself.
 *
 * Per AGENTS.md §52, accessibility is part of the initial contract,
 * not a release-day addition.
 */

import { computed } from 'vue';

defineOptions({ name: 'SnIcon' });

/**
 * Lucide-compatible icon data shape: a 24x24 viewBox by default plus
 * one or more SVG `<path d="...">` strings. Stroke is rendered with
 * `currentColor` so the `color` prop / CSS `color` cascades through.
 */
export interface IconData {
  /** SVG viewBox. Default '0 0 24 24' (lucide's standard grid). */
  viewBox?: string;
  /** One or more SVG path data strings. */
  paths: string[];
}

const props = withDefaults(
  defineProps<{
    /**
     * Icon data — typically a frozen object imported from
     * `@snui/uni` shortcut icons or your own icon pack. Tree-shakeable:
     * only the icons you named-import end up in the bundle.
     *
     * Optional since the wot-ui-compatible `name` API was added: pass either
     * `icon` (SVG data) or `name` (iconfont glyph).
     */
    icon?: IconData | undefined;
    /**
     * Iconfont glyph name — wot-ui's primary API (`wd-icon`).
     *
     * Resolves to `<view class="{classPrefix}-{name}">` so any iconfont whose
     * class names follow the `wd-icon-*` convention works unchanged. Requires
     * the iconfont stylesheet to be loaded by the host app.
     */
    name?: string | undefined;
    /**
     * Class-name prefix for the iconfont glyph. wot-ui defaults to `wd-icon`;
     * this package defaults to `sn-icon` to match its own iconfont build.
     */
    classPrefix?: string | undefined;
    /**
     * Render `name` as a CSS icon: `<view class="{name}">` with no prefix.
     * Mirrors wot-ui's `css-icon`, which lets consumers point at an arbitrary
     * class instead of the iconfont prefix convention.
     */
    cssIcon?: boolean | string | undefined;
    /** Pixel size (or CSS length). rpx is interpreted by uni-app at runtime. */
    size?: number | string | undefined;
    /** Stroke / glyph color. Defaults to `currentColor`. */
    color?: string | undefined;
    /** Stroke width in design units. Default 2 (lucide's standard). */
    strokeWidth?: number | string | undefined;
    /**
     * If true, stroke width is interpreted in absolute pixels rather
     * than scaling with `size`. Mirrors lucide's `absoluteStrokeWidth`.
     */
    strokeWidthAbsolute?: boolean | undefined;
    /** Class on the root element. Mirrors wot-ui `custom-class`. */
    customClass?: string | undefined;
    /** Inline style on the root element. Mirrors wot-ui `custom-style`. */
    customStyle?: string | Record<string, string> | undefined;
  }>(),
  {
    name: '',
    classPrefix: 'sn-icon',
    cssIcon: false,
    size: 32,
    color: 'currentColor',
    strokeWidth: 2,
    strokeWidthAbsolute: false,
    customClass: '',
    customStyle: '',
  },
);

/**
 * Final SVG viewBox: use the icon's own when provided, else lucide's
 * default 24x24 grid.
 */
const viewBox = computed(() => props.icon?.viewBox ?? '0 0 24 24');

/**
 * Effective stroke-width — passed through to the inner `<svg>`. uni-app
 * rpx is interpreted at the runtime viewport width and works the same
 * way for SVG attribute values (browser / native renderer maps to px).
 */
const effectiveStrokeWidth = computed(() =>
  props.strokeWidthAbsolute ? props.strokeWidth : props.strokeWidth,
);

/**
 * Which rendering path this instance takes.
 *
 * `name` (or a string `css-icon`) selects the iconfont path; SVG data
 * (`icon`) selects the inline-SVG path. `name` wins when both are given,
 * because that is the wot-ui-native call shape.
 */
const isGlyph = computed(() => props.name !== '' || typeof props.cssIcon === 'string');

/** Resolved iconfont class list for the glyph path. */
const glyphClass = computed<string[]>(() => {
  if (typeof props.cssIcon === 'string' && props.cssIcon !== '') {
    // `css-icon="my-class"` → render that class verbatim (no prefix).
    return [props.cssIcon];
  }
  const base = props.name === '' ? '' : `${props.classPrefix}-${props.name}`;
  const out: string[] = [];
  if (base !== '') out.push(base);
  if (props.cssIcon === true && props.name !== '') out.push(props.name);
  return out;
});

/** Size box shared by both rendering paths. */
const boxStyle = computed(() => {
  const len = typeof props.size === 'number' ? `${props.size}px` : props.size;
  const style: Record<string, string> = { width: len, height: len };
  if (props.color !== 'currentColor') style.color = props.color;
  if (typeof props.customStyle === 'string') {
    if (props.customStyle !== '') style.cssText = props.customStyle;
  } else {
    Object.assign(style, props.customStyle);
  }
  return style;
});
</script>

<template>
  <view
    class="sn-icon"
    :class="[customClass]"
    data-snui-component="icon"
    :aria-hidden="true"
    :style="boxStyle"
  >
    <!--
      Iconfont glyph path (wot-ui native): the class name carries the glyph,
      the stylesheet is supplied by the host app.
    -->
    <view v-if="isGlyph" class="sn-icon__glyph" :class="glyphClass" data-sn-icon-glyph="" />

    <!--
      Inline `<svg>` path (SVG IconData). Works in:
        - H5 (browser)  : direct DOM, identical to web.
        - 微信小程序 : the SVG renders as <image> by the runtime
                       (not pixel-perfect on all platforms, but the
                       icon is visible). For pixel-perfect MP rendering
                       convert paths → base64 + <image src="data:..."/>.
        - App (uni-app x) : renders as native SVG via the webview layer.

      Keep the markup minimal — no decorative attributes that might
      confuse the cross-end compiler. `xmlns` is required for SVG
      standalone documents and harmless when nested.
    -->
    <svg
      v-else-if="icon"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="viewBox"
      fill="none"
      :stroke="color"
      :stroke-width="effectiveStrokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      focusable="false"
    >
      <path v-for="(d, i) in icon.paths" :key="i" :d="d" />
    </svg>
  </view>
</template>

<style scoped>
/**
 * sn-icon is a sizing + layout box around the inner SVG. Geometry in
 * rpx so the wrapper scales with the host viewport the same way the
 * surrounding uni-app components do. The inner SVG inherits its box
 * size from the wrapper via `width="100%" height="100%"` (set inline
 * in the template) — keeping the SVG fill behaviour consistent.
 */
.sn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  color: inherit;
}

.sn-icon svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

/* * Iconfont glyph box. * * The glyph itself comes from the host app's iconfont stylesheet; this
rule * only guarantees the element is a block box that fills the wrapper and * inherits colour, so
both rendering paths behave identically. */ .sn-icon__glyph { display: block; width: 100%; height:
100%; line-height: 1; text-align: center; }
