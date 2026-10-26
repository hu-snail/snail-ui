<script setup lang="ts">
/** Demo: SnPageHeader — back + title/subtitle + extra + footer with body content. */
import { SnButton, SnPageHeader } from '@snui/vue-web';

function goBack(): void {
  // 业务层处理跳转；演示中仅打印。
  // eslint-disable-next-line no-console
  console.log('[page-header-demo] back clicked');
}
</script>

<template>
  <div class="page-header-demo">
    <SnPageHeader
      title="订单详情"
      subtitle="订单号 SN-20240612-0088 · 已完成"
      extra="导出 | 打印"
      @back="goBack"
    >
      <div class="page-header-demo__body">
        <p>页头下方是默认插槽承载的正文内容。</p>
        <p>extra 既支持文字（如本例），也可以通过 #extra 插槽放置任意操作组合：</p>
        <SnButton size="small">查看日志</SnButton>
      </div>
      <template #footer>
        <span class="page-header-demo__footer-text">更新于 2024-06-12 18:30 · 由系统自动同步</span>
      </template>
    </SnPageHeader>
  </div>
</template>

<style scoped>
.page-header-demo {
  border: 1px solid var(--sn-web-color-border-subtle, #e5e5e5);
  border-radius: var(--sn-web-card-radius, 10px);
  padding: 16px 20px;
  background: var(--sn-web-color-background-surface, #fff);
}
.page-header-demo__body {
  display: grid;
  gap: 8px;
  justify-items: start;
  font-size: 14px;
  color: var(--sn-web-color-text-secondary, #555);
}
.page-header-demo__body p {
  margin: 0;
}
.page-header-demo__footer-text {
  font-size: 12px;
}
</style>
