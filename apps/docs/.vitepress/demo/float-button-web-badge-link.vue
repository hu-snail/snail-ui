<script setup lang="ts">
/**
 * float-button-web-badge-link — the count / dot badge and the anchor root of
 * `SnFloatButton`.
 *
 * `badge` renders a count bubble, `badgeDot` renders a dot without a number,
 * and passing `href` switches the root element from `<button>` to `<a>` (with
 * `target`), so the same component can be a navigation entry.
 */
import { Bell, ExternalLink, LifeBuoy } from 'lucide-vue-next'
import { SnFloatButton } from '@snui/vue-web'
</script>

<template>
  <div class="float-button-demo">
    <p class="float-button-demo__hint">
      数量徽标（<code>badge</code>）、小红点（<code>badgeDot</code>）、
      链接根元素（<code>href</code> + <code>target</code>）。
    </p>

    <SnFloatButton
      :icon="Bell"
      :badge="5"
      tooltip="通知（5 条未读）"
      :right="168"
      :bottom="24"
    />
    <SnFloatButton
      :icon="LifeBuoy"
      badge-dot
      tooltip="有帮助中心更新"
      :right="168"
      :bottom="88"
    />
    <SnFloatButton
      href="https://antdv.com/components/float-button"
      target="_blank"
      :icon="ExternalLink"
      tooltip="上游 FloatButton 文档（新窗口打开）"
      :right="168"
      :bottom="152"
    />
  </div>
</template>

<style scoped>
.float-button-demo {
  width: 100%;
  min-height: 80px;
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
</style>