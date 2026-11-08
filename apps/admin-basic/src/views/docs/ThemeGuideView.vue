<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import DocArticle from '@/components/docs/DocArticle.vue';
import type { DocSection } from '@/components/docs/doc-article-types';

const { locale } = useI18n();

const sections = computed<DocSection[]>(() =>
  locale.value === 'zh-CN'
    ? [
        {
          heading: '暗色 / 浅色模式',
          paragraphs: [
            '主题由 @snui/tokens 的 CSS 变量级联驱动：<html> 上切换 .dark 类即整站翻转（含所有组件）。',
            'app store 持久化用户选择，App.vue 的 watchEffect 统一应用到 documentElement。',
          ],
          code: `// src/theme/apply.ts
export function applyThemeMode(root: HTMLElement, mode: ThemeMode): void {
  root.classList.toggle('dark', mode === 'dark');
}`,
        },
        {
          heading: '主题色切换',
          paragraphs: [
            '组件色板派生自三个 token：--aui-color-action-primary / -hover / -soft。',
            '在根元素内联覆盖这三个变量即可一次换色（内联样式优先级高于 :root 与 .dark，所以两种模式都生效）。',
            '预设定义在 src/theme/presets.ts，hover 与 soft 透明度按模式区分。',
          ],
          code: `// src/theme/presets.ts
export const PRIMARY_PRESETS = [
  { id: 'blue',    primary: '#1677ff', lightHover: '#60a5fa', darkHover: '#3b82f6' },
  { id: 'violet',  primary: '#7c3aed', lightHover: '#a78bfa', darkHover: '#8b5cf6' },
  // ...
];

// src/theme/apply.ts
root.style.setProperty('--aui-color-action-primary', vars.primary);
root.style.setProperty('--aui-color-action-primary-hover', vars.hover);
root.style.setProperty('--aui-color-action-primary-soft', vars.soft);`,
        },
        {
          heading: '新增主色预设',
          paragraphs: [
            '向 PRIMARY_PRESETS 追加一条即可出现在布局设置面板（页头齿轮）的取色区中；id 会持久化到 localStorage。',
          ],
        },
        {
          heading: '自定义组件样式',
          paragraphs: [
            '业务样式优先消费 --sn-web-* 语义变量（间距 / 圆角 / 颜色 / 字体），禁止硬编码色值，保证暗色与主色切换自动生效。',
          ],
        },
      ]
    : [
        {
          heading: 'Dark / light mode',
          paragraphs: [
            'Theming is driven by the @snui/tokens CSS-variable cascade: toggling the .dark class on <html> flips the whole app, components included.',
            'The app store persists the choice; the watchEffect in App.vue applies it to documentElement.',
          ],
          code: `// src/theme/apply.ts
export function applyThemeMode(root: HTMLElement, mode: ThemeMode): void {
  root.classList.toggle('dark', mode === 'dark');
}`,
        },
        {
          heading: 'Primary color switching',
          paragraphs: [
            'The component palette derives from three tokens: --aui-color-action-primary / -hover / -soft.',
            'Overriding those three inline on the root element recolors everything at once (inline style beats both :root and .dark, so it applies in both modes).',
            'Presets live in src/theme/presets.ts; hover and soft-tint alpha differ per mode.',
          ],
          code: `// src/theme/presets.ts
export const PRIMARY_PRESETS = [
  { id: 'blue',    primary: '#1677ff', lightHover: '#60a5fa', darkHover: '#3b82f6' },
  { id: 'violet',  primary: '#7c3aed', lightHover: '#a78bfa', darkHover: '#8b5cf6' },
  // ...
];

// src/theme/apply.ts
root.style.setProperty('--aui-color-action-primary', vars.primary);
root.style.setProperty('--aui-color-action-primary-hover', vars.hover);
root.style.setProperty('--aui-color-action-primary-soft', vars.soft);`,
        },
        {
          heading: 'Add a preset',
          paragraphs: [
            'Append one entry to PRIMARY_PRESETS and it appears in the layout settings panel (header gear) swatch row; the id persists to localStorage.',
          ],
        },
        {
          heading: 'Custom component styles',
          paragraphs: [
            'Business styles should consume the --sn-web-* semantic variables (spacing / radius / color / font) and never hard-code colors, so dark mode and primary switching keep working automatically.',
          ],
        },
      ],
);
</script>

<template>
  <DocArticle :sections="sections" />
</template>
