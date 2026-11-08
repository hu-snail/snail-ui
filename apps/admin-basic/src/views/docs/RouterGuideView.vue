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
          heading: '动态路由流程',
          paragraphs: ['路由分为两层：静态骨架 + 登录后按后端菜单动态注册。'],
          list: [
            '静态路由：/login、/register、布局路由 /（children 初始为空）、404 兜底',
            '首次进入受保护页面时，守卫调用 /api/menu 拉取菜单树',
            'menuToRoutes 将菜单映射为 RouteRecord 并 router.addRoute 挂到布局路由下',
            '注册完成后重放当前导航，新路由即可命中；刷新页面重复此流程',
            '登出或 401 时 resetDynamicRoutes 摘除全部动态路由',
          ],
        },
        {
          heading: '新增一个动态页面',
          paragraphs: ['三步接入，无需改动路由文件：'],
          list: [
            '在 src/views/ 下新建页面组件',
            '在 src/router/dynamic.ts 的 VIEW_COMPONENTS 注册 key → 懒加载函数',
            '在 mock（或真实后端）的菜单数据中追加 { key, path, i18nKey, icon } 节点',
          ],
          code: `// 1. src/router/dynamic.ts
export const VIEW_COMPONENTS = {
  // ...
  'system-profile': () => import('../views/system/ProfileView.vue'),
};

// 2. mock menu（src/mock/index.ts）
{ key: 'system-profile', path: '/system/profile',
  i18nKey: 'menus.systemProfile', icon: 'user-round' }

// 3. i18n 文案（zh-CN.ts / en-US.ts）
menus: { systemProfile: '个人中心' }  // en: 'Profile'`,
        },
        {
          heading: '权限点',
          paragraphs: [
            '菜单来自接口，返回什么就渲染什么 —— 隐藏菜单即可隐藏入口与路由（菜单不返回的 key 不会被注册）。',
            '如需按钮级权限，可在 UserInfo.roles 基础上扩展 v-permission 指令或组合式函数。',
          ],
        },
      ]
    : [
        {
          heading: 'Dynamic route flow',
          paragraphs: [
            'Routing has two layers: a static skeleton plus routes registered from the backend menu after login.',
          ],
          list: [
            'Static: /login, /register, the layout route / (children start empty), and a 404 catch-all',
            'On the first navigation to a protected page the guard fetches /api/menu',
            'menuToRoutes maps the menu into RouteRecords added under the layout route',
            'The current navigation is then replayed so the new routes match; reloading repeats the flow',
            'Logout or 401 removes every dynamic route via resetDynamicRoutes',
          ],
        },
        {
          heading: 'Add a dynamic page',
          paragraphs: ['Three steps, no router edits:'],
          list: [
            'Create the view component under src/views/',
            'Register key → lazy import in VIEW_COMPONENTS (src/router/dynamic.ts)',
            'Append a menu node in the mock (or real backend): { key, path, i18nKey, icon }',
          ],
          code: `// 1. src/router/dynamic.ts
export const VIEW_COMPONENTS = {
  // ...
  'system-profile': () => import('../views/system/ProfileView.vue'),
};

// 2. mock menu (src/mock/index.ts)
{ key: 'system-profile', path: '/system/profile',
  i18nKey: 'menus.systemProfile', icon: 'user-round' }

// 3. i18n messages (zh-CN.ts / en-US.ts)
menus: { systemProfile: '个人中心' }  // en: 'Profile'`,
        },
        {
          heading: 'Permissions',
          paragraphs: [
            'The menu comes from the API — whatever it returns is what renders. Omitting a key hides both the entry and the route (unregistered keys are never added).',
            'For button-level control, extend UserInfo.roles with a v-permission directive or composable.',
          ],
        },
      ],
);
</script>

<template>
  <DocArticle :sections="sections" />
</template>
