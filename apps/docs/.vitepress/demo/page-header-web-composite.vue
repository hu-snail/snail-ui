<script setup lang="ts">
/**
 * Demo: SnPageHeader — subtitle + `#extra` actions + `#footer`, with the
 * back control wired to real state instead of a no-op handler.
 */
import { ref } from 'vue';
import { SnButton, SnIcon, SnPageHeader, registerSnIcons } from '@snui/vue-web';
import { Clock, Download, Share2 } from 'lucide-vue-next';

registerSnIcons({ Clock, Download, Share2 });

const lastAction = ref('等待操作');

function handleBack(): void {
  lastAction.value = '返回上一级（back 事件已触发）';
}
</script>

<template>
  <div class="page-header-composite-demo">
    <SnPageHeader title="订单详情" subtitle="订单号 SN-20240612-0088 · 已完成" @back="handleBack">
      <div class="page-header-composite-demo__body">
        <p>最近一次操作：{{ lastAction }}</p>
        <p>页头右侧的操作区由 #extra 插槽承载，底部说明由 #footer 承载。</p>
      </div>

      <template #extra>
        <div class="page-header-composite-demo__actions">
          <SnButton size="small" icon-name="Download" @click="lastAction = '导出报表'">
            导出
          </SnButton>
          <SnButton size="small" type="primary" icon-name="Share2" @click="lastAction = '分享链接'">
            分享
          </SnButton>
        </div>
      </template>

      <template #footer>
        <span class="page-header-composite-demo__footer">
          <SnIcon name="Clock" :size="12" />
          更新于 2024-06-12 18:30 · 由系统自动同步
        </span>
      </template>
    </SnPageHeader>
  </div>
</template>

<style scoped>
.page-header-composite-demo {
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-card-radius);
  padding: 16px 20px;
  background: var(--sn-web-color-background-surface);
}
.page-header-composite-demo__body {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: var(--sn-web-color-text-secondary);
}
.page-header-composite-demo__body p {
  margin: 0;
}
.page-header-composite-demo__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.page-header-composite-demo__footer {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--sn-web-color-text-secondary);
}
</style>
