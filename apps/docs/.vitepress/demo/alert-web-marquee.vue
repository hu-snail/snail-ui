<script setup lang="ts">
/**
 * alert-web-marquee — horizontally scrolling announcement inside an alert.
 *
 * Shows: an alert whose body carries a continuous scroll. The alert itself
 * has no marquee prop; the scrolling track lives in the default slot, which
 * keeps the dismissal, icon and border behaviour untouched.
 */
import { SnAlert } from '@snui/vue-web'

const notices = [
  '线路维护通知：10 月 20 日 02:00–04:00 期间「数据同步」服务将短暂不可用。',
  '安全提醒：检测到你的账号在新设备登录，如非本人操作请立即修改密码。',
  '版本发布：v3.1 已上线，本次更新包含 12 项体验优化与 4 项缺陷修复。',
].join('　　·　　')
</script>

<template>
  <div class="alert-marquee">
    <SnAlert type="warning" :bordered="false">
      <template #icon>
        <span class="alert-marquee__dot" aria-hidden="true" />
      </template>
      <div class="alert-marquee__viewport">
        <div class="alert-marquee__track">
          <span>{{ notices }}</span>
          <span aria-hidden="true">{{ notices }}</span>
        </div>
      </div>
    </SnAlert>

    <p class="alert-marquee__hint">
      轨道复制两份内容并首尾相接，用 CSS 动画平移一份的宽度即可无缝循环。
      鼠标悬停在文字上会暂停滚动。
    </p>
  </div>
</template>

<style scoped>
.alert-marquee {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.alert-marquee__dot {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}
.alert-marquee__viewport {
  overflow: hidden;
  width: 100%;
}
.alert-marquee__track {
  display: inline-flex;
  gap: 40px;
  white-space: nowrap;
  animation: alert-marquee-scroll 26s linear infinite;
}
.alert-marquee__track:hover {
  animation-play-state: paused;
}
@keyframes alert-marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.alert-marquee__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
@media (prefers-reduced-motion: reduce) {
  .alert-marquee__track { animation: none; }
}
</style>
