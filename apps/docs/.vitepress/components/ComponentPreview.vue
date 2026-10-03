<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useData } from 'vitepress';

/**
 * ComponentPreview — runtime mount of a single AUI component into a
 * preview slot inside the docs. The framework bundle is loaded on demand;
 * each preview mounts its own Vue renderer (and disposes on unmount) so
 * multiple previews on the same page stay isolated.
 *
 * Per AGENTS.md #110, every component page must include at least one preview
 * — this component is the only sanctioned way to add one.
 */

interface Props {
  /** Which end to load — web uses @snui/vue-web, uni uses @snui/uni. */
  end?: 'web' | 'uni';
  /** Component type id (e.g. `button`). Must be registered in the framework. */
  name: string;
  /** Component-specific props (forwarded into the schema). */
  variant?: string;
  size?: string;
  disabled?: boolean;
  loading?: boolean;
  text?: string;
  /** Show on dark surface (demonstrates theme tokens on dark bg). */
  dark?: boolean;
  /** Override the auto-injected props by passing a literal object. */
  rawProps?: Record<string, unknown>;
}

const props = withDefaults(defineProps<Props>(), {
  end: 'web',
  variant: undefined,
  size: undefined,
  disabled: false,
  loading: false,
  text: undefined,
  dark: false,
  rawProps: undefined,
});

const target = ref<HTMLDivElement | null>(null);
const status = ref<'booting' | 'mounted' | 'error'>('booting');
const errorMsg = ref('');

// `useData()` lets us know which end the route is currently documenting;
// we honor an explicit `end` prop first, fall back to the URL.
const { page } = useData();

const effectiveEnd = (): 'web' | 'uni' => {
  if (props.end === 'uni') return 'uni';
  if (props.end === 'web') return 'web';
  if (page.value.relativePath.startsWith('components/uni')) return 'uni';
  return 'web';
};

let mountedApp: { unmount: () => void } | null = null;
let lastEnd = '';

async function mountPreview() {
  if (!target.value) return;
  // Tear down a previous mount if any.
  if (mountedApp) {
    try {
      mountedApp.unmount();
    } catch {
      // ignore secondary errors
    }
    mountedApp = null;
  }

  const end = effectiveEnd();
  lastEnd = end;
  const url = end === 'uni' ? '/framework-uni.js' : '/framework-web.js';

  try {
    const mod = (await import(/* @vite-ignore */ url)) as Record<string, unknown>;
    const AUI = (mod.default ?? mod) as {
      createComponentRegistry?: () => unknown;
      createVueRenderer?: (opts: unknown) => { mount: (schema: unknown, target: Element) => { unmount: () => void } };
      createUniRenderer?: (opts: unknown) => { mount: (schema: unknown, target: Element) => { unmount: () => void } };
      Button?: unknown;
    };

    // Wire registry + renderer — both web and uni expose the same shape.
    const createRegistry = (AUI.createComponentRegistry ?? AUI.createUniRegistry) as () => {
      register: (type: string, component: unknown) => void;
    };
    const createRenderer = (AUI.createVueRenderer ?? AUI.createUniRenderer) as (opts: unknown) => {
      mount: (schema: unknown, target: Element) => { unmount: () => void };
    };

    if (!createRegistry || !createRenderer) {
      throw new Error(`framework bundle (${end}) missing createComponentRegistry / createVueRenderer`);
    }

    const registry = createRegistry();
    // The Button component is exported by both bundles under name 'button'.
    const buttonCtor = (AUI as Record<string, unknown>)['Button'];
    if (buttonCtor) registry.register('button', buttonCtor);

    const renderer = createRenderer({ registry });

    const componentProps: Record<string, unknown> = props.rawProps ?? {};
    if (props.variant !== undefined) componentProps.variant = props.variant;
    if (props.size !== undefined) componentProps.size = props.size;
    if (props.disabled) componentProps.disabled = true;
    if (props.loading) componentProps.loading = true;
    if (props.text !== undefined) componentProps.text = props.text;

    const schema = {
      version: '1.0.0',
      root: {
        id: `${props.name}-preview`,
        type: props.name,
        props: componentProps,
      },
    };

    mountedApp = renderer.mount(schema, target.value);
    status.value = 'mounted';
  } catch (e) {
    errorMsg.value = (e as Error).message ?? String(e);
    status.value = 'error';
  }
}

onMounted(mountPreview);
onBeforeUnmount(() => {
  if (mountedApp) {
    try {
      mountedApp.unmount();
    } catch {
      // ignore
    }
  }
});

// If the user navigates between previews, re-mount.
watch(() => props.name, () => {
  if (target.value) mountPreview();
});
</script>

<template>
  <div>
    <div
      ref="target"
      class="preview-card"
      :class="{ 'is-dark': dark }"
      :data-end="effectiveEnd()"
      :data-status="status"
    />
    <div v-if="status === 'booting'" class="preview-label">
      Booting {{ lastEnd }} framework…
    </div>
    <div v-else-if="status === 'error'" class="preview-label" style="color:var(--vp-c-danger-1)">
      Framework failed: {{ errorMsg }}
    </div>
    <div v-else class="preview-label">
      Mounted via <code>createVueRenderer().mount()</code> · end={{ lastEnd }}
    </div>
  </div>
</template>