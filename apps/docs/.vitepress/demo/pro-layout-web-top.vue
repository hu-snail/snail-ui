<script setup lang="ts">
/**
 * Demo: SnProLayout — top 形态（顶部菜单：品牌 + 横向一级菜单 + 操作区）。
 *
 * 内容区是通用工作台（`@snui/admin-layout/workbench`），和 side / mix / dual 同一份数据。
 */
import { markRaw, ref } from 'vue';
import { Box, Home, MessageSquare, PieChart } from 'lucide-vue-next';
import { SnProLayout } from '@snui/admin-layout';
import { ProWorkbench } from '@snui/admin-layout/workbench';
import type { SnMenuOption } from '@snui/vue-web';
import {
  demoIncomeSources,
  demoKpis,
  demoMoneyFlow,
  demoTransactions,
} from '../utils/workbench-demo';

const activeKey = ref('home');
const menus: SnMenuOption[] = [
  { key: 'home', label: '首页', icon: markRaw(Home) },
  { key: 'dashboard', label: '监控', icon: markRaw(PieChart) },
  { key: 'messages', label: '消息', icon: markRaw(MessageSquare) },
  { key: 'projects', label: '项目', icon: markRaw(Box) },
];

function onSelect(key: string | number | null): void {
  if (typeof key === 'string') activeKey.value = key;
}
</script>

<template>
  <div class="shell">
    <SnProLayout
      layout="top"
      title="Snail Admin"
      :menus="menus"
      :active-key="activeKey"
      :fixed="false"
      @select="onSelect"
    >
      <template #actions>
        <span class="avatar" aria-hidden="true">M</span>
      </template>

      <ProWorkbench
        :kpis="demoKpis"
        :money-flow="demoMoneyFlow"
        :income-sources="demoIncomeSources"
        :transactions="demoTransactions"
        title="工作台"
        subtitle="顶部形态没有侧栏，一级菜单全部收进顶栏，内容区更宽。"
        :chart-height="260"
      />
    </SnProLayout>
  </div>
</template>

<style scoped>
.shell {
  height: clamp(560px, 78vh, 900px);
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: 8px;
  overflow: hidden;
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
</style>
