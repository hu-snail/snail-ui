<script setup lang="ts">
/**
 * float-button-web-badge — the count / dot badge of `SnFloatButton`.
 *
 * `badge` renders a count bubble, `badgeDot` renders a dot without a number.
 * `fixed: false` keeps both inside the demo stage instead of pinning them
 * to the browser corner.
 */
import { Bell, LifeBuoy } from 'lucide-vue-next';
import { SnFloatButton } from '@snui/vue-web';
</script>

<template>
  <div class="float-button-demo">
    <p class="float-button-demo__hint">
      数量徽标（<code>badge</code>）、小红点（<code>badgeDot</code>）。
    </p>

    <div class="float-button-demo__stage">
      <span class="float-button-demo__stage-label">position: relative 的容器</span>

      <SnFloatButton
        :fixed="false"
        :icon="Bell"
        :badge="5"
        tooltip="通知（5 条未读）"
        :right="16"
        :bottom="16"
      />
      <SnFloatButton
        :fixed="false"
        :icon="LifeBuoy"
        badge-dot
        tooltip="有帮助中心更新"
        :right="16"
        :bottom="72"
      />
    </div>
  </div>
</template>

<style scoped>
.float-button-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.float-button-demo__hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}

.float-button-demo__hint code {
  padding: 0 4px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  font-size: 12px;
}

/* The positioning context: the buttons below pin to THIS box. */
.float-button-demo__stage {
  position: relative;
  min-height: 220px;
  padding: 12px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.float-button-demo__stage-label {
  font-size: 12px;
  color: var(--vp-c-text-3);
}
</style>
