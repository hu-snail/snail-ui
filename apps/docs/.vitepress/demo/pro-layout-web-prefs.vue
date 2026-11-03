<script setup lang="ts">
/** Demo: SnProLayout — 设置抽屉（形态/亮暗/主色/标签样式）+ 访问路由标签栏。 */
import { markRaw, ref } from 'vue';
import { Home, Settings, ShieldCheck, Users } from 'lucide-vue-next';
import { SnProLayout } from '@snui/admin-layout';
import type { SnProPrimaryColor, SnProSettingsLabels, SnProTabItem, SnProTabType } from '@snui/admin-layout';
import type { SnMenuOption } from '@snui/vue-web';

const activeKey = ref('user');
const mode = ref<'light' | 'dark'>('light');
const primaryId = ref('blue');
const tabType = ref<SnProTabType>('chrome');
const visited = ref<string[]>(['home', 'user']);

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
];
const labelByKey: Record<string, string> = {
  home: '首页',
  user: '用户管理',
  role: '角色权限',
};

const tabs = ref<SnProTabItem[]>(
  visited.value.map((key) => ({ key, label: labelByKey[key]!, closable: key !== 'home' })),
);

function onSelect(key: string | number | null): void {
  if (typeof key !== 'string') return;
  activeKey.value = key;
  if (!visited.value.includes(key)) {
    visited.value.push(key);
    tabs.value = visited.value.map((k) => ({ key: k, label: labelByKey[k]!, closable: k !== 'home' }));
  }
}

function onTabSelect(key: string): void {
  activeKey.value = key;
}

function onTabClose(key: string): void {
  const index = visited.value.indexOf(key);
  visited.value = visited.value.filter((k) => k !== key);
  tabs.value = tabs.value.filter((tab) => tab.key !== key);
  if (activeKey.value === key) {
    activeKey.value = visited.value[index - 1] ?? visited.value[0] ?? 'home';
  }
}

const primaryColors: SnProPrimaryColor[] = [
  { id: 'blue', color: '#1677ff' },
  { id: 'violet', color: '#7c3aed' },
  { id: 'emerald', color: '#059669' },
  { id: 'rose', color: '#e11d48' },
];

const settingsLabels: Partial<SnProSettingsLabels> = {
  title: '页面设置',
  layout: '布局风格',
  mode: '主题模式',
  light: '亮色',
  dark: '深色',
  primary: '主题色',
  tabStyle: '标签栏样式',
};
</script>

<template>
  <div class="shell" :class="{ dark: mode === 'dark' }">
    <SnProLayout
      v-model:mode="mode"
      v-model:primary-id="primaryId"
      v-model:tab-type="tabType"
      title="Snail Admin"
      :menus="menus"
      :active-key="activeKey"
      :tabs="tabs"
      :primary-colors="primaryColors"
      :settings-labels="settingsLabels"
      show-settings
      show-tabs
      :fixed="false"
      @select="onSelect"
      @tab-select="onTabSelect"
      @tab-close="onTabClose"
    >
      <template #actions>
        <span class="avatar" aria-hidden="true">M</span>
      </template>

      <div class="page">
        <h3>偏好抽屉 + 标签栏</h3>
        <p>
          点页头齿轮打开设置抽屉（形态 / 亮暗 / 主色 / 标签样式）；
          访问过的路由成为标签，固定签不可关闭。
        </p>
      </div>
    </SnProLayout>
  </div>
</template>

<style scoped>
.shell {
  height: 440px;
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: 8px;
  overflow: hidden;
}

.shell.dark {
  background: #101014;
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-text-on-primary);
  font-size: 13px;
  font-weight: 600;
}

.page {
  padding: 4px 0 120px;
}

.page h3 {
  margin: 0 0 8px;
  font-size: 15px;
}

.page p {
  margin: 0;
  color: var(--sn-web-color-text-secondary);
  font-size: 13px;
}
</style>
