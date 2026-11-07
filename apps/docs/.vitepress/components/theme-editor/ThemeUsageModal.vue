<script setup lang="ts">
/**
 * ThemeUsageModal — 「复制配置」后的接入文档弹窗。
 *
 * ## 为什么是弹窗而不是跳转文档页
 *
 * 用户刚复制完配置，此刻最需要的是「接下来三步怎么走」：
 * 存文件 → 入口注入 → 端与深色说明。放在弹窗里视线不离开编辑器，
 * 步骤可以直接照抄；深度文档仍可通过链接跳到 Token 级联页。
 *
 * 复制的正文是 `@snui/tokens` 公开 API 的调用代码（三个定义对象 +
 * `snCssVars()` 注入），弹窗里的代码块展示同一段内容供核对/再次复制。
 */

import { computed, ref } from 'vue';
import { useRoute } from 'vitepress';
import { Check, Copy, X } from 'lucide-vue-next';
import { SnButton } from '@snui/vue-web';

interface Props {
  open: boolean;
  /** 已复制到剪贴板的片段（弹窗内可再次复制）。 */
  snippet: string;
  english?: boolean;
}
const props = withDefaults(defineProps<Props>(), { english: false });

const emit = defineEmits<{ (e: 'close'): void }>();

const route = useRoute();
const english = computed(
  () => props.english || route.path === '/en' || route.path.startsWith('/en/'),
);
const t = (zh: string, en: string): string => (english.value ? en : zh);

const copied = ref(false);

async function copyAgain(): Promise<void> {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
    await navigator.clipboard.writeText(props.snippet);
  } catch {
    const scratch = document.createElement('textarea');
    scratch.value = props.snippet;
    scratch.style.position = 'fixed';
    scratch.style.opacity = '0';
    document.body.appendChild(scratch);
    scratch.select();
    document.execCommand('copy');
    document.body.removeChild(scratch);
  }
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 1600);
}

const cascadeLink = computed(() => (english.value ? '/en/theme/cascade' : '/theme/cascade'));

const steps = computed(() => [
  {
    title: t('1 · 保存主题文件', '1 · Save the theme file'),
    body: t(
      '把复制的代码存为项目里的 src/theme.ts —— 里面是三个纯数据对象（Theme / Style / Density），不包含任何组件代码。',
      'Save the copied code as src/theme.ts — three pure-data objects (Theme / Style / Density), no component code inside.',
    ),
  },
  {
    title: t('2 · 应用入口注入一次', '2 · Inject once at the app entry'),
    body: t(
      '在 main.ts 里把 snCssVars() 的输出插到 <head>。它只写 CSS 变量（--aui-* 层），不改 DOM、不需要包裹组件，所有已挂载的组件立即跟随。',
      'In main.ts, append the snCssVars() output to <head>. It only writes CSS variables (the --aui-* layer), touches no DOM and needs no wrapper component — every mounted component follows instantly.',
    ),
  },
  {
    title: t('3 · 端与深色说明', '3 · Ends & dark mode'),
    body: t(
      'Web 组件消费 --sn-web-*，uni 组件消费 --sn-mp-*，两层的颜色都指向 var(--aui-*)，所以颜色两端同时生效；uni 端尺寸由 tokens-mp 的 rpx 阶梯决定。深色块默认输出 [data-theme="dark"]，用 .dark 类的站点把选择器换成 .dark, [data-theme="dark"] 即可。',
      'Web components consume --sn-web-* and uni components --sn-mp-*; both colour layers point at var(--aui-*), so colours apply to both ends at once. uni sizes come from tokens-mp rpx ladders. The dark block ships as [data-theme="dark"]; swap the selector to .dark, [data-theme="dark"] on VitePress-style sites.',
    ),
  },
]);
</script>

<template>
  <Teleport to="body">
    <Transition name="sn-usage">
      <div
        v-if="open"
        class="sn-usage"
        role="dialog"
        aria-modal="true"
        :aria-label="t('配置使用说明', 'How to apply')"
      >
        <div class="sn-usage__mask" @click="emit('close')" />
        <div class="sn-usage__panel">
          <header class="sn-usage__head">
            <div>
              <h3 class="sn-usage__title">
                {{ t('配置已复制 · 如何应用到项目', 'Config copied · How to apply it') }}
              </h3>
              <p class="sn-usage__sub">
                {{
                  t(
                    '配置走 @snui/tokens 公开 API（Theme / Style / Density 三轴），与你项目里的组件解析管线完全一致。',
                    'The config goes through the @snui/tokens public API (Theme / Style / Density axes) — the same pipeline your components resolve against.',
                  )
                }}
              </p>
            </div>
            <button
              type="button"
              class="sn-usage__close"
              :aria-label="t('关闭', 'Close')"
              @click="emit('close')"
            >
              <X :size="15" />
            </button>
          </header>

          <div class="sn-usage__body">
            <ol class="sn-usage__steps">
              <li v-for="step in steps" :key="step.title" class="sn-usage__step">
                <strong>{{ step.title }}</strong>
                <p>{{ step.body }}</p>
              </li>
            </ol>

            <div class="sn-usage__code-head">
              <span>{{ t('已复制的配置（theme.ts）', 'Copied config (theme.ts)') }}</span>
              <SnButton size="tiny" :type="copied ? 'success' : 'primary'" @click="copyAgain">
                <template #icon
                  ><Check v-if="copied" :size="12" /><Copy v-else :size="12"
                /></template>
                {{ copied ? t('已复制', 'Copied') : t('再次复制', 'Copy again') }}
              </SnButton>
            </div>
            <pre class="sn-usage__code"><code>{{ snippet }}</code></pre>

            <p class="sn-usage__more">
              {{
                t(
                  '想了解三层级联（Primitive → Semantic → Component）如何解析，见',
                  'For how the three-layer cascade (Primitive → Semantic → Component) resolves, see',
                )
              }}
              <a :href="cascadeLink">{{ t('Token 级联', 'Token cascade') }}</a
              >。
            </p>
          </div>

          <footer class="sn-usage__foot">
            <SnButton size="small" @click="emit('close')">{{
              t('继续编辑', 'Keep editing')
            }}</SnButton>
            <SnButton size="small" type="primary" @click="emit('close')">{{
              t('知道了', 'Got it')
            }}</SnButton>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sn-usage {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.sn-usage__mask {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(2px);
}
.sn-usage__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(680px, 100%);
  max-height: min(80vh, 720px);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  box-shadow: 0 24px 60px -18px rgba(15, 23, 42, 0.35);
  overflow: hidden;
}

.sn-usage__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.sn-usage__title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
}
.sn-usage__sub {
  margin: 4px 0 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
.sn-usage__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.sn-usage__close:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-3);
}

.sn-usage__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sn-usage__steps {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  counter-reset: none;
}
.sn-usage__step strong {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}
.sn-usage__step p {
  margin: 3px 0 0;
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}

.sn-usage__code-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}
.sn-usage__code {
  margin: 0;
  max-height: 260px;
  overflow: auto;
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  white-space: pre;
}
.sn-usage__more {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
}
.sn-usage__more a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.sn-usage__more a:hover {
  text-decoration: underline;
}

.sn-usage__foot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 18px;
  border-top: 1px solid var(--vp-c-divider);
}

/* 进出场 */
.sn-usage-enter-active,
.sn-usage-leave-active {
  transition: opacity 0.18s ease;
}
.sn-usage-enter-active .sn-usage__panel,
.sn-usage-leave-active .sn-usage__panel {
  transition: transform 0.18s ease;
}
.sn-usage-enter-from,
.sn-usage-leave-to {
  opacity: 0;
}
.sn-usage-enter-from .sn-usage__panel,
.sn-usage-leave-to .sn-usage__panel {
  transform: translateY(8px) scale(0.98);
}
</style>
