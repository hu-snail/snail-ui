<script setup lang="ts">
/**
 * SnEquation — web-end LaTeX equation renderer (AUI-WEB-DD-007).
 *
 * Reference library: naive-ui `n-equation`
 *   (https://www.naiveui.com/zh-CN/light/components/equation)
 * Per AGENTS.md §112, props + semantics mirror n-equation 1:1:
 *   value / katex / katexOptions (no events, no slots). The rendered
 *   wrapper tag/class is extracted from katex output exactly like
 *   n-equation does (`span.katex` inline, `span.katex-display` block).
 *
 * Documented divergences (not §112 violations):
 *   - `katex` ships as a dependency of @snui/vue-web, so rendering works
 *     out of the box. naive-ui carries no katex dependency and requires
 *     the instance via prop or config-provider injection; the `katex`
 *     prop here is an override hook (same name, same semantics).
 *   - KaTeX CSS + fonts are delivered through the `@snui/vue-web/styles`
 *     barrel (copy-styles pipeline), not through this SFC.
 *   - naive resolves katex via config-provider; we resolve the bundled
 *     import directly (config-provider-independent).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web. No own
 * visual styles — the rendered markup is KaTeX's own (`.katex`).
 *
 * Usage:
 *   <SnEquation value="c = \\pm\\sqrt{a^2+b^2}" />
 *   <SnEquation :value="expr" :katex-options="{ displayMode: true }" />
 */

import { computed } from 'vue';
import * as katexNamespace from 'katex';
import type { SnEquationKatex } from './sn-equation-types';

defineOptions({ name: 'SnEquation' });

const props = withDefaults(
  defineProps<{
    /** LaTeX expression string. Mirrors n-equation `value`. */
    value?: string;
    /** Custom katex-like renderer; overrides the bundled one. Mirrors n-equation `katex`. */
    katex?: SnEquationKatex | undefined;
    /** Options forwarded to renderToString (e.g. displayMode / macros). Mirrors n-equation `katexOptions`. */
    katexOptions?: Record<string, unknown> | undefined;
  }>(),
  {
    value: '',
    katex: undefined,
    katexOptions: undefined,
  },
);

/**
 * Resolve the renderToString entry across interop shapes (ESM namespace
 * import, CJS default export). Returns undefined when nothing usable is
 * found — the component then renders the 'no katex provided' placeholder
 * like n-equation does.
 */
function resolveKatex(ns: unknown): SnEquationKatex | undefined {
  if (typeof (ns as SnEquationKatex | undefined)?.renderToString === 'function') {
    return ns as SnEquationKatex;
  }
  const fallback = (ns as { default?: unknown } | undefined)?.default;
  if (typeof (fallback as SnEquationKatex | undefined)?.renderToString === 'function') {
    return fallback as SnEquationKatex;
  }
  return undefined;
}

const bundledKatex: SnEquationKatex | undefined = resolveKatex(katexNamespace);

const rendered = computed(() => {
  const lib = props.katex ?? bundledKatex;
  if (!lib) {
    return {
      wrapperTag: 'span',
      wrapperClass: undefined as string | undefined,
      innerHtml: 'no katex provided',
    };
  }
  const outerHtml = lib.renderToString(props.value, {
    throwOnError: false,
    ...props.katexOptions,
  });
  const matchResult = outerHtml.match(/^<([a-z]+)[^>]+class="([^"]+)"[^>]*>/);
  const wrapperTag = matchResult?.[1] || 'span';
  const wrapperClass = matchResult?.[2];
  const innerHtml = outerHtml.replace(/^<[a-z]+[^>]*>/, '').replace(/<\/[a-z]+>$/, '');
  return { wrapperTag, wrapperClass, innerHtml };
});
</script>

<template>
  <component
    :is="rendered.wrapperTag"
    data-snui-component="equation"
    :class="rendered.wrapperClass"
    v-html="rendered.innerHtml"
  />
</template>
