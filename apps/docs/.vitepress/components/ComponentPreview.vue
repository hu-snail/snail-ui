<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useData } from 'vitepress';
import { createApp, type App as VueAppInstance } from 'vue';
import { SnButton } from '@snui/vue-web';

/**
 * ComponentPreview — runtime mount of real @snui/vue-web components into
 * a preview slot inside the docs.
 *
 * Per AUI-PRD-v3.0 + ADR-0002 (FOUND-002):
 *   - NO schema renderer. We directly import the Vue SFC and mount via createApp().
 *   - framework-{web,uni}.js IIFE bundle is dropped (was v1.x Schema-Runtime era).
 *
 * Per AGENTS.md §110, every component page must include at least one preview —
 * this component is the only sanctioned way to add one.
 *
 * Limitations:
 *   - Only the Web end is supported in this iteration. Uni H5/App preview needs
 *     a real uni-app runtime (out of scope for docs site).
 *   - For uni-app previews, see /en/components/uni/* docs pages (text + screenshot).
 */

interface Props {
  /** Component to render. Default: 'button' (only supported name in M0.5). */
  name?: 'button';
  /** Visual variant passed to <SnButton>. */
  variant?: 'primary' | 'default' | 'success' | 'warning' | 'danger' | 'info';
  /** Size preset passed to <SnButton>. */
  size?: 'tiny' | 'small' | 'medium' | 'large';
  /** Disabled flag. */
  disabled?: boolean;
  /** Loading flag. */
  loading?: boolean;
  /** Button label. */
  text?: string;
  /** Optional CSS class on the preview card. */
  cardClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  name: 'button',
  variant: 'default',
  size: 'medium',
  disabled: false,
  loading: false,
  text: 'Button',
  cardClass: '',
});

const target = ref<HTMLDivElement | null>(null);
const status = ref<'booting' | 'mounted' | 'error'>('booting');
const errorMsg = ref('');

let mountedApp: VueAppInstance | null = null;

function mountPreview() {
  if (!target.value) return;
  if (mountedApp) {
    try {
      mountedApp.unmount();
    } catch {
      // ignore disposal errors
    }
    mountedApp = null;
  }
  try {
    const app = createApp({
      setup() {
        return () =>
          // Only SnButton is supported as a preview target in this iteration.
          // Future components will be added via a lookup table once shipped.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (SnButton as any)({
            type: props.variant,
            size: props.size,
            disabled: props.disabled,
            loading: props.loading,
            onClick: () => undefined,
          }, { default: () => props.text });
      },
    });
    app.mount(target.value);
    mountedApp = app;
    status.value = 'mounted';
  } catch (e) {
    errorMsg.value = (e as Error).message ?? String(e);
    status.value = 'error';
  }
}

const codeSnippet = computed(() => {
  const lines: Array<string> = [];
  lines.push(`<template>`);
  lines.push(`  <SnButton`);
  if (props.variant !== 'default') lines.push(`    type="${props.variant}"`);
  if (props.size !== 'medium') lines.push(`    size="${props.size}"`);
  if (props.disabled) lines.push(`    disabled`);
  if (props.loading) lines.push(`    loading`);
  lines.push(`  >`);
  lines.push(`    ${props.text}`);
  lines.push(`  </SnButton>`);
  lines.push(`</template>`);
  return lines.join('\n');
});

const copied = ref(false);
async function copySnippet() {
  try {
    await navigator.clipboard.writeText(codeSnippet.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 1400);
  } catch {
    // Fallback for environments where clipboard API is unavailable.
    const ta = document.createElement('textarea');
    ta.value = codeSnippet.value;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } finally { document.body.removeChild(ta); }
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 1400);
  }
}

onMounted(mountPreview);
onBeforeUnmount(() => {
  if (mountedApp) {
    try { mountedApp.unmount(); } catch { /* ignore */ }
  }
});

watch(
  () => [props.variant, props.size, props.disabled, props.loading, props.text, props.name],
  () => mountPreview(),
);
</script>

<template>
  <div class="sn-preview">
    <div
      ref="target"
      class="preview-card"
      :class="cardClass"
      :data-status="status"
    />
    <div v-if="status === 'booting'" class="preview-label">Booting…</div>
    <div v-else-if="status === 'error'" class="preview-label preview-label--error">
      {{ errorMsg }}
    </div>

    <details class="sn-source-block" open>
      <summary>
        <span class="sn-source-label">Vue SFC</span>
        <button
          type="button"
          class="sn-copy-btn"
          :class="{ 'is-copied': copied }"
          @click.stop.prevent="copySnippet"
        >
          {{ copied ? '✓ Copied' : 'Copy' }}
        </button>
      </summary>
      <pre class="sn-source-pre"><code>{{ codeSnippet }}</code></pre>
    </details>
  </div>
</template>

<style scoped>
.sn-preview {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
}
.preview-card {
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.preview-label {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-top: 8px;
}
.preview-label--error {
  color: var(--vp-c-danger-1);
}
.sn-source-block {
  margin-top: 12px;
  font-size: 13px;
}
.sn-source-block summary {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sn-copy-btn {
  font-size: 12px;
  padding: 2px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
}
.sn-copy-btn.is-copied {
  color: var(--vp-c-success-1);
}
.sn-source-pre {
  background: var(--vp-c-bg-soft);
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 8px 0 0;
}
</style>