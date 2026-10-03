<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useData } from 'vitepress';

/**
 * ComponentPreview — runtime mount of a single AUI component into a
 * preview slot inside the docs. Each preview mounts its own Vue renderer
 * (and disposes on unmount) so multiple previews on the same page stay
 * isolated.
 *
 * Loading model:
 *   - The framework bundle is shipped as IIFE (apps/docs/public/framework-{web,uni}.js)
 *   - We inject a <script src="..."> tag ONCE per end and wait for the global
 *     (window.AUI_WEB / window.AUI_UNI) to appear. Cached per-end via Promise.
 *   - This is the only approach that works in VitePress dev (vite rejects
 *     `import()` of /public/* files because they bypass the plugin pipeline).
 *
 * Per AGENTS.md #110, every component page must include at least one preview
 * — this component is the only sanctioned way to add one.
 */

interface Props {
  end?: 'web' | 'uni';
  name: string;
  variant?: string;
  size?: string;
  disabled?: boolean;
  loading?: boolean;
  text?: string;
  dark?: boolean;
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

const { page } = useData();

const effectiveEnd = (): 'web' | 'uni' => {
  if (props.end === 'uni') return 'uni';
  if (props.end === 'web') return 'web';
  if (page.value.relativePath.startsWith('components/uni')) return 'uni';
  return 'web';
};

let mountedApp: { unmount: () => void } | null = null;
let lastEnd = '';

/** Per-end load promise — caches the global module across previews. */
const loadCache = new Map<'web' | 'uni', Promise<unknown>>();

function loadFramework(end: 'web' | 'uni'): Promise<unknown> {
  if (loadCache.has(end)) return loadCache.get(end)!;
  const globalKey = end === 'uni' ? 'AUI_UNI' : 'AUI_WEB';
  const scriptSrc = end === 'uni' ? '/framework-uni.js' : '/framework-web.js';

  const promise = new Promise((resolve, reject) => {
    const w = window as unknown as Record<string, unknown>;
    if (w[globalKey]) {
      resolve(w[globalKey]);
      return;
    }
    const existing = document.querySelector(`script[data-aui-end="${end}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(w[globalKey]));
      existing.addEventListener('error', () =>
        reject(new Error(`failed to load ${scriptSrc}`)),
      );
      return;
    }
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = false;
    script.dataset.auiEnd = end;
    script.addEventListener('load', () => resolve(w[globalKey]));
    script.addEventListener('error', () =>
      reject(new Error(`failed to load ${scriptSrc}`)),
    );
    document.head.appendChild(script);
  });
  loadCache.set(end, promise);
  return promise;
}

async function mountPreview() {
  if (!target.value) return;
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

  try {
    const mod = (await loadFramework(end)) as Record<string, unknown>;

    const createRegistry = (mod.createComponentRegistry ?? mod.createUniRegistry) as () => {
      register: (type: string, component: unknown) => void;
    };
    const createRenderer = (mod.createVueRenderer ?? mod.createUniRenderer) as (opts: unknown) => {
      mount: (schema: unknown, target: Element) => { unmount: () => void };
    };

    if (!createRegistry || !createRenderer) {
      throw new Error(`framework bundle (${end}) missing createComponentRegistry / createVueRenderer`);
    }

    const registry = createRegistry();
    const buttonCtor = (mod as Record<string, unknown>)['Button'];
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