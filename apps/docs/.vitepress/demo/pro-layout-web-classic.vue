<script setup lang="ts">
/**
 * Demo: SnProLayoutClassic — classic 布局风格。
 *
 * 本 demo 刻意走「按布局独立入口」，验证只引 classic 壳的路径可用：
 *   import { SnProLayoutClassic } from '@snui/admin-layout/layouts/classic';
 *   import '@snui/admin-layout/layouts/classic/style.css';
 * 站点在 `.vitepress/theme/index.ts` 里已全局引入 `@snui/admin-layout/styles`
 * （全量样式），所以这里不再重复引样式文件，避免和其它 demo 互相覆盖。
 *
 * 内容区是通用工作台（`@snui/admin-layout/workbench`，接 ECharts），
 * 和 standard 四形态 / aurora 用的是同一份数据 —— 换壳不换内容。
 */
import { computed, markRaw, ref } from 'vue';
import {
  FileText,
  FolderTree,
  Home,
  LogOut,
  Settings,
  ShieldCheck,
  User,
  Users,
} from 'lucide-vue-next';
import { SnProLayoutClassic } from '@snui/admin-layout/layouts/classic';
import type { SnProNoticeItem, SnProUserProfile } from '@snui/admin-layout/layouts/classic';
import { ProWorkbench } from '@snui/admin-layout/workbench';
import type { SnDropdownKey, SnDropdownOption, SnMenuOption } from '@snui/vue-web';
import {
  demoIncomeSources,
  demoKpis,
  demoMoneyFlow,
  demoTransactions,
} from '../utils/workbench-demo';

const activeKey = ref('user');
const collapsed = ref(false);
const note = ref(
  '点左侧菜单 / 搜菜单 / 点消息 / 点用户卡片，都只 emit 事件，导航与业务由宿主实现。',
);

const menus: SnMenuOption[] = [
  { key: 'home', label: '首页', icon: markRaw(Home) },
  {
    key: 'system',
    label: '系统管理',
    icon: markRaw(Settings),
    children: [
      { key: 'user', label: '用户管理', icon: markRaw(Users) },
      { key: 'role', label: '角色权限', icon: markRaw(ShieldCheck) },
    ],
  },
  {
    key: 'content',
    label: '内容管理',
    icon: markRaw(FolderTree),
    children: [{ key: 'article', label: '文章列表', icon: markRaw(FileText) }],
  },
];

const labels: Record<string, string> = {
  home: '首页',
  system: '系统管理',
  user: '用户管理',
  role: '角色权限',
  content: '内容管理',
  article: '文章列表',
};

// 模块大标题：宿主自己的映射（这里用一份 key → 标题表代替路由 meta）。
const pageTitle = computed(() => labels[activeKey.value] ?? '工作台');

const user: SnProUserProfile = { name: '麦芽', description: 'admin@snail.dev' };

const userMenus: SnMenuOption[] = [
  { key: 'profile', label: '个人中心', icon: markRaw(User) },
  { key: 'logout', label: '退出登录', icon: markRaw(LogOut) },
];

const notices = ref<SnProNoticeItem[]>([
  { key: 'n1', label: '构建完成', description: 'admin-basic #128 已发布', time: '2 分钟前' },
  { key: 'n2', label: '新增成员', description: '小满 加入了团队', time: '1 小时前' },
]);

const badgeCount = ref(notices.value.length);

function onSelect(key: string | number | null, item: SnMenuOption): void {
  if (typeof key === 'string') activeKey.value = key;
  note.value = `select(${String(key)}) → 宿主 router.push →「${item.label}」`;
}

function onSearchSelect(key: string | number, item: SnMenuOption): void {
  note.value = `search-select(${String(key)}) → 宿主 router.push →「${item.label}」`;
}

function onNoticeSelect(key: string | number, item: SnProNoticeItem): void {
  badgeCount.value = Math.max(0, badgeCount.value - 1);
  note.value = `notice-select(${String(key)}) → 宿主打开「${item.label}」并标记已读`;
}

function onReadAll(): void {
  badgeCount.value = 0;
  note.value = 'notice-read-all → 宿主把全部消息标记已读';
}

function onUserSelect(key: SnDropdownKey, item: SnDropdownOption): void {
  note.value = `user-select(${String(key)}) → 宿主处理「${item.label ?? ''}」（登出 / 跳个人中心）`;
}
</script>

<template>
  <div class="shell">
    <SnProLayoutClassic
      v-model:collapsed="collapsed"
      title="Snail Admin"
      :menus="menus"
      :active-key="activeKey"
      :page-title="pageTitle"
      :notice-count="badgeCount"
      :notice-items="notices"
      :user="user"
      :user-menus="userMenus"
      :fixed="false"
      @select="onSelect"
      @search-select="onSearchSelect"
      @notice-select="onNoticeSelect"
      @notice-read-all="onReadAll"
      @user-select="onUserSelect"
    >
      <template #actions>
        <button type="button" class="icon-btn" aria-label="设置">
          <Settings :size="16" />
        </button>
      </template>

      <ProWorkbench
        :kpis="demoKpis"
        :money-flow="demoMoneyFlow"
        :income-sources="demoIncomeSources"
        :transactions="demoTransactions"
        title="工作台"
        subtitle="分类侧栏 + 顶部通栏：面包屑 / 搜索 / 通知都在壳里，内容只有工作台。"
      />
    </SnProLayoutClassic>
    <p class="note">{{ note }}</p>
  </div>
</template>

<style scoped>
.shell {
  /* 真实比例：接近一屏的后台窗口，不是一块被压扁的示例板。 */
  height: clamp(560px, 78vh, 900px);
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: 8px;
  overflow: hidden;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  padding: 6px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--sn-web-color-text-secondary);
  cursor: pointer;
}

.icon-btn:hover {
  background-color: var(--sn-web-color-background-subtle);
}

.note {
  margin: 10px 0 0;
  color: var(--sn-web-color-text-tertiary);
  font-size: 12px;
}
</style>
