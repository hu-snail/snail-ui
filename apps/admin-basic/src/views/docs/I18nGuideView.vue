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
          heading: '机制',
          paragraphs: [
            'vue-i18n（Composition API 模式）承载全部 UI 文案；语言偏好持久化在 localStorage，App.vue 将其同步到 vue-i18n 与 <html lang>。',
            '侧边菜单的 label 来自后端菜单的 i18nKey，切语言即时重算。',
          ],
        },
        {
          heading: '使用方式',
          paragraphs: ['组件内通过 useI18n 取翻译函数：'],
          code: `const { t } = useI18n();
const greeting = computed(() => t('home.greeting', { name: user.nickname }));`,
        },
        {
          heading: '新增文案',
          paragraphs: ['在 src/i18n/zh-CN.ts 与 en-US.ts 中同步添加同名 key：'],
          code: `// zh-CN.ts
menus: { systemProfile: '个人中心' }

// en-US.ts
menus: { systemProfile: 'Profile' }`,
        },
        {
          heading: '键位一致性测试',
          paragraphs: [
            '中英文 key 树必须完全一致 —— src/i18n/messages.test.ts 会遍历两份文案对比键集合，缺 key 会导致测试失败（而不是线上缺字）。',
          ],
        },
        {
          heading: '错误信息国际化',
          paragraphs: ['接口错误码通过 `api.error.<code>` 文案空间翻译；未登记的 code 原样展示后端 message。'],
        },
      ]
    : [
        {
          heading: 'Mechanism',
          paragraphs: [
            'vue-i18n (Composition API mode) carries all UI strings; the language preference persists to localStorage and App.vue syncs it into vue-i18n and <html lang>.',
            'Sidebar labels come from the backend menu i18nKey, so switching language re-renders them immediately.',
          ],
        },
        {
          heading: 'Usage',
          paragraphs: ['Inside components, take the translate function from useI18n:'],
          code: `const { t } = useI18n();
const greeting = computed(() => t('home.greeting', { name: user.nickname }));`,
        },
        {
          heading: 'Adding strings',
          paragraphs: ['Add the same key to both src/i18n/zh-CN.ts and en-US.ts:'],
          code: `// zh-CN.ts
menus: { systemProfile: '个人中心' }

// en-US.ts
menus: { systemProfile: 'Profile' }`,
        },
        {
          heading: 'Key parity test',
          paragraphs: [
            'The zh/en key trees must match exactly — src/i18n/messages.test.ts walks both message sets and compares key collections, so a missing key fails the test instead of shipping blank UI.',
          ],
        },
        {
          heading: 'Localizing API errors',
          paragraphs: ['Envelope error codes are translated via the `api.error.<code>` namespace; unregistered codes fall back to the raw backend message.'],
        },
      ],
);
</script>

<template>
  <DocArticle :sections="sections" />
</template>
