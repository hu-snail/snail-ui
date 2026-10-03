<script setup lang="ts">
/**
 * Demo — wrapper that mounts a per-component demo .vue file.
 *
 * Per AUI-DOCS-016 + Spec-05 §5: each component has a standalone
 * `apps/docs/.vitepress/demo/<name>.vue` file that imports the real
 * `@snui/vue-web` or `@snui/uni` component. This wrapper does:
 *
 *   1. Dynamic import of the demo file (async chunk split)
 *   2. ClientOnly gating so vitepress prerender never touches it
 *   3. Error fallback when the named demo file is missing
 *
 * Why this works (vs v3.0 placeholder):
 *   .vue files are compiled via @vue/compiler-sfc — compile-time macros
 *   (defineOptions / defineProps / withDefaults) are transformed before
 *   reaching the browser. Markdown top-level `<script setup>` blocks were
 *   processed as raw ESM during vitepress prerender, which strips the
 *   macros and breaks the build. Per-component demo .vue files bypass
 *   that pipeline.
 *
 * Usage in .md:
 *   <Demo name="button-web" />
 *   <Demo name="divider-mp" card-class="compact" />
 */

import { computed, defineAsyncComponent, h } from 'vue'

interface Props {
  /** Demo file basename (without .vue) under apps/docs/.vitepress/demo/. */
  name: string
  /** Optional CSS class on the wrapping card. */
  cardClass?: string
  /** Hide the wrapping card chrome (used inside docs prose). */
  bare?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cardClass: '',
  bare: false,
})

const fallbackRender = (msg: string) => () => h('div', { class: 'sn-demo-error' }, msg)

// `import.meta.glob` lets Vite discover all demo files at build time so the
// dynamic import path stays static and tree-shakable. We list every demo
// name explicitly (no directory scan) to keep type safety.
const demoModules = import.meta.glob('../demo/*.vue')

const AsyncDemo = defineAsyncComponent({
  loader: () => {
    const key = `../demo/${props.name}.vue`
    const mod = demoModules[key]
    if (!mod) {
      return Promise.resolve(fallbackRender(`demo not found: ${props.name}`))
    }
    return mod().then((m: { default: unknown }) => m).catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error(`[Demo] failed to load ${props.name}:`, err)
      return fallbackRender(`demo failed to load: ${props.name}`)
    })
  },
  delay: 0,
  errorComponent: { render: () => null },
})

const wrapperClass = computed(() => [
  'sn-demo-host',
  props.bare ? 'sn-demo-host--bare' : '',
  props.cardClass,
])
</script>

<template>
  <ClientOnly>
    <div :class="wrapperClass">
      <component :is="AsyncDemo" />
    </div>
    <template #fallback>
      <div class="sn-demo-host sn-demo-host--loading">
        <span class="sn-demo-spinner" aria-hidden="true" />
        <span>Loading {{ name }} …</span>
      </div>
    </template>
  </ClientOnly>
</template>

<style scoped>
.sn-demo-host {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
  background: var(--vp-c-bg-soft);
}
.sn-demo-host--bare {
  border: 0;
  padding: 0;
  background: transparent;
}
.sn-demo-host--loading {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}
.sn-demo-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: sn-demo-spin 0.8s linear infinite;
}
@keyframes sn-demo-spin {
  to { transform: rotate(360deg); }
}
.sn-demo-error {
  color: var(--vp-c-danger-1);
  font-size: 13px;
  padding: 8px 12px;
  border: 1px dashed var(--vp-c-danger-1);
  border-radius: 4px;
}
</style>