<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useData } from 'vitepress';

/**
 * ComponentPreview — runtime mount of AUI components into a preview slot
 * inside the docs. Each preview mounts its own Vue renderer (and disposes
 * on unmount) so multiple previews on the same page stay isolated.
 *
 * Loading model:
 *   - The framework bundle is shipped as IIFE (apps/docs/public/framework-{web,uni}.js)
 *   - We inject a <script src="..."> tag ONCE per end and wait for the global
 *     (window.AUI_WEB / window.AUI_UNI) to appear. Cached per-end via Promise.
 *   - This is the only approach that works in VitePress dev (vite rejects
 *     `import()` of /public/* files because they bypass the plugin pipeline).
 *
 * Phase 2 (AUI-WEB-004..007) components are auto-discovered from the bundle:
 * the bundle exposes Button / Input / Form / FormItem / Card on the global
 * (more may be added in future phases without touching this file).
 *
 * Schema source code is auto-rendered alongside the live mount, with a
 * one-click copy button. Authors can supply extra code snippets via the
 * `snippet` prop (raw text shown verbatim under the schema) and the
 * `usage` prop (Vue SFC `<template>` snippet).
 *
 * Per AGENTS.md §110, every component page must include at least one
 * preview — this component is the only sanctioned way to add one.
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
  /**
   * Free-form props (e.g. `placeholder`, `name`, `type`, `title`, `description`,
   * `clearable`). Object-spread over (string | number | boolean).
   */
  rawProps?: Record<string, unknown>;
  /**
   * JSON-encoded UINode[] tree — used when a preview needs nested children
   * (FormItem > Input, Card with body, etc.). Parsed via JSON.parse.
   */
  children?: string;
  /**
   * Hide the auto-generated schema code block (use when authors prefer to
   * keep the page tidy — schema is still emitted to the schema-only data attr).
   */
  hideSchema?: boolean;
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
  children: undefined,
  hideSchema: false,
});

const target = ref<HTMLDivElement | null>(null);
const status = ref<'booting' | 'mounted' | 'error'>('booting');
const errorMsg = ref('');
const copiedKey = ref<'schema' | null>(null);

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

/** Components exposed by every official framework bundle (web + uni). */
const BUNDLED_COMPONENTS = [
  'Button',
  'Input',
  'Form',
  'FormItem',
  'Card',
] as const;

function buildSchema(): { version: string; root: Record<string, unknown> } {
  const componentProps: Record<string, unknown> = { ...(props.rawProps ?? {}) };
  if (props.variant !== undefined) componentProps.variant = props.variant;
  if (props.size !== undefined) componentProps.size = props.size;
  if (props.disabled) componentProps.disabled = true;
  if (props.loading) componentProps.loading = true;
  if (props.text !== undefined) componentProps.text = props.text;

  const root: Record<string, unknown> = {
    id: `${props.name}-preview`,
    type: props.name,
    props: componentProps,
  };

  if (props.children) {
    try {
      const parsed = JSON.parse(props.children);
      if (Array.isArray(parsed)) {
        root.children = parsed;
      } else {
        throw new Error('children must be a JSON array of UINode objects');
      }
    } catch (err) {
      throw new Error(
        `ComponentPreview: invalid children JSON — ${(err as Error).message}`,
      );
    }
  }

  return { version: '1.0.0', root };
}

const schemaJson = computed<string>(() => {
  try {
    const s = buildSchema();
    return JSON.stringify(s, null, 2);
  } catch {
    return '/* schema build error */';
  }
});

async function mountPreview() {
  if (!target.value) return;
  if (mountedApp) {
    try {
      mountedApp.unmount();
    } catch {
      // ignore
    }
    mountedApp = null;
  }

  const end = effectiveEnd();
  lastEnd = end;

  try {
    const mod = (await loadFramework(end)) as Record<string, unknown>;

    const createRegistry = (mod.createComponentRegistry ??
      mod.createUniRegistry) as () => {
      register: (type: string, component: unknown) => void;
    };
    const createRenderer = (mod.createVueRenderer ??
      mod.createUniRenderer) as (opts: unknown) => {
      mount: (
        schema: unknown,
        target: Element,
      ) => { unmount: () => void };
    };

    if (!createRegistry || !createRenderer) {
      throw new Error(
        `framework bundle (${end}) missing createComponentRegistry / createVueRenderer`,
      );
    }

    const registry = createRegistry();
    // Auto-register every bundled official component. Authors can reference
    // any of them in `name` or as a nested type inside `children`.
    for (const ctorName of BUNDLED_COMPONENTS) {
      const ctor = mod[ctorName];
      if (ctor) registry.register(ctorName.toLowerCase(), ctor);
    }

    const renderer = createRenderer({ registry });

    const schema = buildSchema();
    mountedApp = renderer.mount(schema, target.value);
    status.value = 'mounted';
  } catch (e) {
    errorMsg.value = (e as Error).message ?? String(e);
    status.value = 'error';
  }
}

/** Copy a code block to the clipboard and briefly show a "Copied" chip. */
async function copyToClipboard(key: 'schema', text: string) {
  try {
    await navigator.clipboard.writeText(text);
    copiedKey.value = key;
    setTimeout(() => {
      if (copiedKey.value === key) copiedKey.value = null;
    }, 1400);
  } catch {
    // Fallback for environments where clipboard API is unavailable.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      copiedKey.value = key;
      setTimeout(() => {
        if (copiedKey.value === key) copiedKey.value = null;
      }, 1400);
    } finally {
      document.body.removeChild(ta);
    }
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

watch(
  () => [props.name, props.variant, props.size, props.disabled, props.loading, props.text, props.rawProps, props.children, props.end],
  () => {
    if (target.value) mountPreview();
  },
);
</script>

<template>
  <div class="aui-preview">
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

    <!-- Source code: auto-generated schema block with copy button -->
    <div v-if="!hideSchema" class="preview-source">
      <details class="aui-source-block" open>
        <summary>
          <span class="aui-source-label">UISchema</span>
          <button
            type="button"
            class="aui-copy-btn"
            :class="{ 'is-copied': copiedKey === 'schema' }"
            @click.stop.prevent="copyToClipboard('schema', schemaJson)"
          >
            {{ copiedKey === 'schema' ? '✓ Copied' : 'Copy' }}
          </button>
        </summary>
        <pre class="aui-source-pre"><code>{{ schemaJson }}</code></pre>
      </details>
    </div>
  </div>
</template>