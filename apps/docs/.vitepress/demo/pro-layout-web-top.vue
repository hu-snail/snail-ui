<script setup lang="ts">
/** Demo: SnProLayout — top 形态（顶部菜单：品牌 + 横向一级菜单 + 操作区）。 */
import { markRaw, ref } from 'vue';
import { Box, Home, MessageSquare, PieChart } from 'lucide-vue-next';
import { SnProLayout } from '@snui/admin-layout';
import type { SnMenuOption } from '@snui/vue-web';

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

      <div class="page">
        <h3>首页</h3>
        <p>顶部形态没有侧栏，一级菜单全部收进顶栏，内容区更宽。</p>
      </div>
    </SnProLayout>
  </div>
</template>

<style scoped>
.shell {
  height: 360px;
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

.page h3 {
  margin: 0 0 8px;
  font-size: 16px;
}

.page p {
  margin: 0;
  color: var(--sn-web-color-text-tertiary);
  font-size: 13px;
}
</style>
