<script setup lang="ts">
/**
 * SnIcon — web-end icon component (AUI-WEB-002).
 *
 * Wraps any icon library that exposes individual Vue 3 components
 * (e.g. lucide-vue-next, @vicons/ionicons5, tabler-icons-vue). The
 * canonical pairing is `lucide-vue-next` — see:
 *   https://lucide.dev/guide/packages/lucide-vue-next
 *
 * ## Tree-shakeability (per AGENTS.md §81 + Spec-04 §2.4)
 *
 * Lucide is built with ES Modules and is fully tree-shakeable when each
 * icon is imported as a named export:
 *
 *     import { ChevronRight } from 'lucide-vue-next'   // ✓ tree-shaken
 *     import * as Icons from 'lucide-vue-next'          // ✗ bundles all
 *
 * SnIcon supports BOTH the direct and registry patterns so consumers
 * can pick the one that matches their use case:
 *
 *   1. Direct (best for static usage, fully tree-shakeable):
 *
 *        <SnIcon :icon="ChevronRight" size="20" />
 *
 *   2. Registry (best for data-driven menus / dynamic icon names):
 *
 *        import { ChevronRight, Settings, Search } from 'lucide-vue-next'
 *        import { registerSnIcons } from '@snui/vue-web'
 *        registerSnIcons({ ChevronRight, Settings, Search })
 *
 *        <SnIcon name="ChevronRight" />
 *
 *     The registry map is a plain object literal — Rollup/esbuild can
 *     statically analyze the `import { A, B, C } from 'lucide-vue-next'`
 *     call and only bundle A, B, C into the chunk, even though the
 *     registry is keyed by string. Bundlers do NOT have to enumerate
 *     every possible key. Unused icons stay out of the bundle.
 *
 * We intentionally do NOT support `import * as Icons` style registration
 * because that defeats tree-shaking. Consumers who want a global icon
 * registry should follow pattern 2 (named imports + registry map).
 *
 * ## Icon contract
 *
 * The component passed via `icon` (or looked up via `name`) must be a
 * Vue 3 functional component / SFC that accepts these props (matching
 * lucide-vue-next's public API):
 *   - size?: number | string
 *   - color?: string
 *   - strokeWidth?: number | string
 *   - absoluteStrokeWidth?: boolean
 *   - defaultClass?: string
 *   - plus any SVG presentation attribute (fill, stroke, class, style…)
 *
 * If the icon component does not implement these props, they are
 * silently ignored by Vue (no warning).
 *
 * ## Accessibility
 *
 * Icons are decorative by default and inherit `aria-hidden="true"` from
 * the SnIcon wrapper. Consumers should provide an accessible name on the
 * outer button / link / label, not on the icon itself.
 *
 * Per AGENTS.md §52, accessibility is part of the initial contract, not
 * a release-day addition.
 */

import { computed } from 'vue'
import type { IconComponent, IconComponentProps } from './sn-icon-registry'
import { resolveIconByName } from './sn-icon-registry'

defineOptions({ name: 'SnIcon' })

const props = withDefaults(
  defineProps<{
    /**
     * Pass a lucide-style icon component directly. This is the recommended
     * path — the bundler can statically analyze the named import and
     * tree-shake every icon you didn't reference.
     */
    icon?: IconComponent
    /**
     * Or look up an icon previously registered via `registerSnIcons()`.
     * Use this for data-driven icon resolution (e.g. menu config from
     * a server that ships icon names as strings).
     */
    name?: string
    /** Pixel size (or CSS length). Forwarded to the inner icon component. */
    size?: number | string
    /** Stroke color. Inherits from `currentColor` by default. */
    color?: string
    /** Stroke width in design-units. Default 2 (lucide's standard). */
    strokeWidth?: number | string
    /**
     * If true, stroke width is interpreted in absolute pixels rather
     * than scaling with `size`. Matches lucide's `absoluteStrokeWidth`.
     */
    strokeWidthAbsolute?: boolean
    /** Optional CSS class for the inner SVG element. */
    defaultClass?: string
  }>(),
  {
    size: 16,
    color: 'currentColor',
    strokeWidth: 2,
    strokeWidthAbsolute: false,
  },
)

const resolvedIcon = computed<IconComponent | null>(() => {
  if (props.icon) return props.icon
  if (props.name) return resolveIconByName(props.name) ?? null
  return null
})

const hasIcon = computed(() => resolvedIcon.value !== null)
</script>

<template>
  <span
    v-if="hasIcon"
    class="sn-icon"
    aria-hidden="true"
    data-snui-component="icon"
  >
    <!--
      `<component :is>` resolves the registered icon and forwards the
      props every lucide icon accepts (size / color / stroke-width /
      absolute-stroke-width / default-class). Vue silently drops any
      prop the inner component does not declare.
    -->
    <component
      :is="resolvedIcon"
      :size="size"
      :color="color"
      :stroke-width="strokeWidth"
      :absolute-stroke-width="strokeWidthAbsolute"
      :default-class="defaultClass"
    />
  </span>
  <span
    v-else
    class="sn-icon sn-icon--missing"
    aria-hidden="true"
    data-snui-component="icon"
    role="img"
    aria-label="icon not registered"
  >
    <!--
      Placeholder rendered when neither `icon` nor `name` resolves to a
      component. Helps surface typos in icon names during development
      instead of silently rendering nothing.
    -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 9h.01M9 15h.01M15 9h.01M15 15h.01" />
    </svg>
  </span>
</template>

<style scoped>
/**
 * SnIcon is a sizing + forwarding wrapper. The inner icon renders its
 * own SVG so we don't define any stroke/fill here — we just align the
 * wrapper box with the parent's text baseline and let `font-size` /
 * `color` flow through naturally.
 *
 * `vertical-align: -0.125em` nudges the box down so the SVG sits on the
 * cap-line of surrounding text (matches the behavior of inline icons in
 * most icon fonts, including FontAwesome).
 */
.sn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  vertical-align: -0.125em;
  width: 1em;
  height: 1em;
  color: inherit;
}

/* The placeholder SVG inside the wrapper should inherit `em` sizing
   and `currentColor` from the surrounding text — no overrides here. */

/* When the icon is missing (no icon / unknown name), make it visually
   distinct without screaming. Used for development diagnostics. */
.sn-icon--missing {
  opacity: 0.4;
}
</style>