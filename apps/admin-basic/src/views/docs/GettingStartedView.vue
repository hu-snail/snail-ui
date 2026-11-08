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
          heading: '技术栈',
          paragraphs: [
            '本模板基于以下技术栈搭建，全部依赖均来自 snail-aui workspace 或社区标准方案：',
          ],
          list: [
            'Vue 3（<script setup> + TypeScript strict）',
            'Vite 6 构建，@vitejs/plugin-vue 编译 SFC',
            'UI 组件库 @snui/vue-web，通过 unplugin-vue-components + SnUIResolver 自动按需导入',
            '请求层 alova（@alova/mock 提供 mock 服务）',
            '路由 vue-router，登录后由后端菜单动态注册',
            '状态 pinia（auth 会话 / app 外观偏好）',
            '国际化 vue-i18n（zh-CN / en-US）',
          ],
        },
        {
          heading: '目录结构',
          code: `src/
├── api/          # 接口定义（auth / menu / dashboard）与类型
├── components/   # 布局控件与文档渲染组件
├── i18n/         # vue-i18n 实例与中英文文案
├── layouts/      # AdminLayout：侧边菜单 + 头部 + 内容区
├── mock/         # @alova/mock mock 服务
├── request/      # alova 实例、拦截器、ApiError
├── router/       # 静态路由、动态路由映射、守卫
├── stores/       # pinia：auth / app
├── theme/        # 主色预设与暗色/主色应用逻辑
└── views/        # 页面（login / register / home / docs）`,
        },
        {
          heading: '本地运行',
          paragraphs: ['在仓库根目录执行：'],
          code: `pnpm install
pnpm --filter @snui/admin-basic dev`,
          codeLanguage: 'bash',
        },
        {
          heading: '演示账号',
          paragraphs: ['mock 服务内置两个账号，登录页可直接使用：'],
          list: ['admin / 123456（管理员）', 'user / 123456（普通用户）'],
        },
      ]
    : [
        {
          heading: 'Tech stack',
          paragraphs: [
            'The template is built on the following stack — all dependencies come from the snail-aui workspace or standard community packages:',
          ],
          list: [
            'Vue 3 (<script setup> + TypeScript strict)',
            'Vite 6 build, @vitejs/plugin-vue for SFCs',
            'UI library @snui/vue-web, auto-imported on demand via unplugin-vue-components + SnUIResolver',
            'Request layer alova (mock service provided by @alova/mock)',
            'vue-router — routes registered dynamically from the backend menu after login',
            'pinia state (auth session / app preferences)',
            'vue-i18n internationalization (zh-CN / en-US)',
          ],
        },
        {
          heading: 'Project layout',
          code: `src/
├── api/          # API definitions (auth / menu / dashboard) + types
├── components/   # Header controls and doc rendering components
├── i18n/         # vue-i18n instance and zh/en messages
├── layouts/      # AdminLayout: sidebar + header + content
├── mock/         # @alova/mock mock service
├── request/      # alova instance, interceptors, ApiError
├── router/       # static routes, dynamic mapping, guard
├── stores/       # pinia: auth / app
├── theme/        # primary presets + dark/primary application
└── views/        # pages (login / register / home / docs)`,
        },
        {
          heading: 'Run locally',
          paragraphs: ['From the repository root:'],
          code: `pnpm install
pnpm --filter @snui/admin-basic dev`,
          codeLanguage: 'bash',
        },
        {
          heading: 'Demo accounts',
          paragraphs: ['The mock service ships two accounts:'],
          list: ['admin / 123456 (admin)', 'user / 123456 (regular user)'],
        },
      ],
);
</script>

<template>
  <DocArticle :sections="sections" />
</template>
