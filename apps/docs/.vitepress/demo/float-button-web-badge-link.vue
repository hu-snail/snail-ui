<script setup lang="ts">
/**
 * float-button-web-badge-link — the count / dot badge and the anchor root of
 * `SnFloatButton`.
 *
 * `badge` renders a count bubble, `badgeDot` renders a dot without a number,
 * and passing `href` switches the root element from `<button>` to `<a>` (with
 * `target`), so the same component can be a navigation entry.
 *
 * `fixed: false` keeps all three inside the demo stage instead of pinning them
 * to the browser corner.
 */
import { Bell, ExternalLink, LifeBuoy } from 'lucide-vue-next';
import { SnFloatButton } from '@snui/vue-web';
</script>

<template>
  <div class="float-button-demo">
    <p class="float-button-demo__hint">
      数量徽标（<code>badge</code>）、小红点（<code>badgeDot</code>）、 链接根元素（<code
        >href</code
      >
      + <code>target</code>）。
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
      <SnFloatButton
        :fixed="false"
        href="https://antdv.com/components/float-button"
        target="_blank"
        :icon="ExternalLink"
        tooltip="上游 FloatButton 文档（新窗口打开）"
        :right="16"
        :bottom="128"
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
