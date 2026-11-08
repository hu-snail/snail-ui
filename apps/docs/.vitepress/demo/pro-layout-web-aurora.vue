<script setup lang="ts">
/**
 * Demo: SnProLayoutAurora — aurora 布局风格。
 *
 * 走「按布局独立入口」验证只引 aurora 壳的路径可用（站点在
 * `.vitepress/theme/index.ts` 已全局引入 `@snui/admin-layout/styles`，所以这里不再重复引样式）。
 *
 * 演示点：
 *   - 通屏背景（纯色 / 背景图 / 光晕 / 弥散）**铺在布局内部**：顶栏透明浮在它上面，
 *     白色内容面板与悬浮图标栏是两块浮层，背景从面板后面透出来；
 *   - 胶囊导航、圆形工具区、悬浮一级图标栏与底部退出 / 帮助；
 *   - 内容区是**通用工作台**（`@snui/admin-layout/workbench`，接 ECharts），
 *     和 classic / standard 用的是同一份数据 —— 换壳不换内容。
 */
import { computed, markRaw, ref } from 'vue';
import { FileText, FolderTree, Home, Settings, ShieldCheck, Users } from 'lucide-vue-next';
import { SnProLayoutAurora } from '@snui/admin-layout/layouts/aurora';
import type {
  SnProLayoutAuroraBackground,
  SnProLayoutAuroraLocale,
  SnProLayoutAuroraMode,
  SnProNoticeItem,
  SnProUserProfile,
} from '@snui/admin-layout/layouts/aurora';
import { ProWorkbench } from '@snui/admin-layout/workbench';
import type { SnDropdownKey, SnDropdownOption, SnMenuOption } from '@snui/vue-web';
import {
  demoIncomeSources,
  demoKpis,
  demoMoneyFlow,
  demoTransactions,
} from '../utils/workbench-demo';

const activeKey = ref('user');
const mode = ref<SnProLayoutAuroraMode>('light');
const locale = ref<SnProLayoutAuroraLocale>('zh');
const background = ref<SnProLayoutAuroraBackground>('gradient');
const note = ref('点一级图标切模块、点二级菜单换页；右上角可切亮暗 / 中英，左侧底部是退出与帮助。');

const backgrounds: Array<{ value: SnProLayoutAuroraBackground; label: string }> = [
  { value: 'solid', label: '纯色' },
  { value: 'image', label: '背景图' },
  { value: 'gradient', label: '渐变光晕' },
  { value: 'mesh', label: '弥散' },
];

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
  user: '用户管理',
  role: '角色权限',
  article: '文章列表',
};
const pageTitle = computed(() => labels[activeKey.value] ?? '工作台');

const user: SnProUserProfile = { name: '麦芽', description: 'admin@snail.dev' };
const userMenus: SnMenuOption[] = [
  { key: 'profile', label: '个人中心' },
  { key: 'logout', label: '退出登录' },
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

function onMode(next: SnProLayoutAuroraMode): void {
  note.value = `update:mode(${next}) → 宿主切换 .dark 类并持久化`;
}

function onLocale(next: SnProLayoutAuroraLocale): void {
  note.value = `update:locale(${next}) → 宿主切 i18n 并持久化`;
}

function onUserSelect(key: SnDropdownKey, item: SnDropdownOption): void {
  note.value = `user-select(${String(key)}) → 宿主处理「${item.label ?? ''}」`;
}

function onNoticeSelect(key: string | number, item: SnProNoticeItem): void {
  badgeCount.value = Math.max(0, badgeCount.value - 1);
  note.value = `notice-select(${String(key)}) → 宿主打开「${item.label}」并标记已读`;
}

function onSearchSelect(key: string | number, item: SnMenuOption): void {
  note.value = `search-select(${String(key)}) → 宿主 router.push →「${item.label}」`;
}
</script>

<template>
  <div class="shell">
    <div class="toolbar" role="group" aria-label="背景类型">
      <span class="toolbar__label">背景</span>

      <button
        v-for="item in backgrounds"
        :key="item.value"
        type="button"
        class="toolbar__btn"
        :class="{ 'toolbar__btn--on': background === item.value }"
        @click="background = item.value"
      >
        {{ item.label }}
      </button>
    </div>

    <div class="stage">
      <SnProLayoutAurora
        v-model:mode="mode"
        v-model:locale="locale"
        :background="background"
        :background-colors="['#7c5cff', '#22c1a4', '#ffb454', '#5b8def']"
        :menus="menus"
        :active-key="activeKey"
        :page-title="pageTitle"
        page-subtitle="这里是今天的经营概览。"
        :notice-count="badgeCount"
        :notice-items="notices"
        :user="user"
        :user-menus="userMenus"
        :fixed="false"
        @select="onSelect"
        @search-select="onSearchSelect"
        @notice-select="onNoticeSelect"
        @notice-read-all="badgeCount = 0"
        @user-select="onUserSelect"
        @update:mode="onMode"
        @update:locale="onLocale"
        @logout="note = 'logout → 宿主清 session 并跳登录页'"
        @help="note = 'help → 宿主打开帮助中心'"
      >
        <ProWorkbench
          :kpis="demoKpis"
          :money-flow="demoMoneyFlow"
          :income-sources="demoIncomeSources"
          :transactions="demoTransactions"
          :show-heading="false"
          :chart-height="260"
          @action="(kind: 'primary' | 'secondary') => (note = `action(${kind}) → 宿主打开流程`)"
          @kpi-action="
            (_kpi, action) => (note = `kpi-action(${action.key}) → 宿主处理「${action.label}」`)
          "
          @range-change="(range: string) => (note = `range-change(${range}) → 宿主拉对应周期数据`)"
          @transaction-select="
            (_key, row) => (note = `transaction-select(${row.key}) → 宿主打开详情`)
          "
        />
      </SnProLayoutAurora>
    </div>

    <p class="note">{{ note }}</p>
  </div>
</template>

<style scoped>
.shell {
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: 8px;
  overflow: hidden;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--sn-web-color-border-subtle);
  background-color: var(--sn-web-color-background-elevated);
}

.toolbar__label {
  margin-right: 4px;
  color: var(--sn-web-color-text-tertiary);
  font-size: 12px;
}

.toolbar__btn {
  padding: 4px 10px;
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: 999px;
  background: transparent;
  color: var(--sn-web-color-text-secondary);
  font-size: 12px;
  cursor: pointer;
}

.toolbar__btn--on {
  border-color: var(--sn-web-color-action-primary);
  background-color: var(--sn-web-color-action-primary-soft);
  color: var(--sn-web-color-action-primary);
}

/*
 * 真实比例：布局壳按 100% 高度铺满舞台，舞台自身给的是「接近一屏的窗口」。
 * `clamp(560px, 78vh, 900px)` —— 窄屏不塌、宽屏不虚高，读起来就是一个真后台窗口。
 */
.stage {
  height: clamp(560px, 78vh, 900px);
}

.note {
  margin: 0;
  padding: 8px 12px;
  border-top: 1px solid var(--sn-web-color-border-subtle);
  color: var(--sn-web-color-text-tertiary);
  font-size: 12px;
}
</style>
