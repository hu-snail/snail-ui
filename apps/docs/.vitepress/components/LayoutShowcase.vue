<script setup lang="ts">
/**
 * LayoutShowcase — 布局风格演示台（docs-only）。
 *
 * 为什么需要它：`Demo` 在页面上是**行内流式**卡片。一页放三种布局风格时，
 * 每个 demo 都要独占整行（布局壳是横向铺开的，并排会被挤扁），而 `.md`
 * 里没法表达「这一行只显示一个」。
 *
 * 这里把「风格选择」和「单实例演示」拆开：
 *   - 上排是风格胶囊，切换只换当前渲染的那一个；
 *   - 下方**同一时间只挂载一个** demo —— 天然独占一行，也不会有三份布局壳
 *     同时在 DOM 里抢样式；
 *   - 代码面板复用 `Demo` 的既有能力（description + 展开看 vue/ts/css），
 *     文档里只需要给出 `name` 与风格元数据。
 *
 * 与 `Demo` 的约定一致：demo 文件仍是 `../demo/<name>.vue`，英文站优先加载
 * `demo-en/<name>.vue` 影子文件，不存在则回退中文 demo。
 *
 * 用法（.md）：
 *   <LayoutShowcase
 *     :styles="[
 *       { key: 'standard', name: 'pro-layout-web-standard', label: 'standard', blurb: '四形态壳' },
 *       { key: 'classic', name: 'pro-layout-web-classic', label: 'classic', blurb: '经典企业后台' },
 *     ]"
 *     initial="standard"
 *   />
 */
import { computed, markRaw, ref, watch } from 'vue';
import { useData } from 'vitepress';
import Demo from '../components/Demo.vue';
import { loadDemoComponent } from '../utils/demo-loader';

interface ShowcaseStyle {
  /** Stable id used by the `initial` prop and the demo instance key. */
  key: string;
  /** Demo file basename under `.vitepress/demo/` (may be shadowed by `demo-en/`). */
  name: string;
  /** Tab label (the layout style id, e.g. `classic`). */
  label: string;
  /** One-line description, also used as the demo's `description`. */
  blurb?: string;
}

interface Props {
  /** Layout styles offered by the switcher, in display order. */
  styles: ShowcaseStyle[];
  /** Style shown first (falls back to the first entry). */
  initial?: string;
}

const props = withDefaults(defineProps<Props>(), { initial: '' });

const { lang } = useData();
const isEn = computed(() => lang.value === 'en-US');

const activeKey = ref<string>(props.initial !== '' ? props.initial : (props.styles[0]?.key ?? ''));

/** Keep the selection valid if `styles` changes (HMR / locale swap). */
watch(
  () => props.styles,
  (list) => {
    if (!list.some((item) => item.key === activeKey.value)) {
      activeKey.value = list[0]?.key ?? '';
    }
  },
);

const activeStyle = computed<ShowcaseStyle | undefined>(() =>
  props.styles.find((item) => item.key === activeKey.value),
);

/**
 * The demo for the selected style.
 *
 * Each style is a distinct file, so switching unmounts the previous shell and
 * mounts the next one: no cross-style state, and no three layouts fighting for
 * the same class names at once.
 */
const AsyncDemo = computed(() =>
  activeStyle.value === undefined
    ? undefined
    : markRaw(loadDemoComponent(activeStyle.value.name, isEn.value)),
);

/** Remount on every switch so the incoming demo starts from its initial state. */
const instanceKey = ref(0);
watch(activeKey, () => {
  instanceKey.value += 1;
});
</script>

<template>
  <div class="sn-showcase">
    <div class="sn-showcase__tabs" role="tablist" aria-label="布局风格">
      <button
        v-for="style in props.styles"
        :key="style.key"
        type="button"
        role="tab"
        class="sn-showcase__tab"
        :class="{ 'sn-showcase__tab--active': style.key === activeKey }"
        :aria-selected="style.key === activeKey"
        @click="activeKey = style.key"
      >
        <span class="sn-showcase__tab-label">{{ style.label }}</span>
        <span v-if="style.blurb" class="sn-showcase__tab-blurb">{{ style.blurb }}</span>
      </button>
    </div>

    <!-- One instance at a time = the demo always owns the full row width. -->
    <div class="sn-showcase__stage">
      <ClientOnly>
        <component
          :is="Demo"
          v-if="AsyncDemo !== undefined && activeStyle !== undefined"
          :key="`${activeStyle.key}-${instanceKey}`"
          :name="activeStyle.name"
          :description="activeStyle.blurb ?? ''"
        />
        <template #fallback>
          <div class="sn-showcase__loading">Loading {{ activeStyle?.name }} …</div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
/* Dropped straight into the markdown flow: tabs + one full-width demo, never a grid. */
.sn-showcase {
  display: block;
  margin: 16px 0 24px;
}

.sn-showcase__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.sn-showcase__tab {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.5;
  cursor: pointer;
  transition:
    background-color 0.15s,
    color 0.15s,
    border-color 0.15s;
}

.sn-showcase__tab:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.sn-showcase__tab--active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.sn-showcase__tab-blurb {
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 400;
}

.sn-showcase__tab--active .sn-showcase__tab-blurb {
  color: var(--vp-c-text-2);
}

.sn-showcase__stage {
  margin-top: 12px;
}

.sn-showcase__stage :deep(.sn-demo) {
  margin: 0;
}

.sn-showcase__loading {
  padding: 24px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}
</style>
