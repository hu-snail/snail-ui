<script setup lang="ts">
/**
 * Demo: SnMarquee — 基础横向跑马灯。
 * Per AUI-DOCS-016: imports the real @snui/vue-web SnMarquee.
 * 默认 12 秒一轮、24px 间距、鼠标悬停暂停。
 */
import { SnMarquee } from '@snui/vue-web'

const notices = [
  '公告：本周五 22:00 - 24:00 进行系统维护，期间服务不可用。',
  '组件库文档已更新，新增跑马灯 / 评论等组件。',
  '全员大会下周一 10:00 在多功能厅举行，请准时参加。',
]
</script>

<template>
  <div class="marquee-demo">
    <SnMarquee class="marquee-demo__bar" :duration="16">
      <span v-for="(notice, index) in notices" :key="index" class="marquee-demo__item">
        {{ notice }}
      </span>
    </SnMarquee>

    <p class="marquee-demo__hint">
      插槽里只放一份内容，组件会自动复制两份并首尾相接，循环处无缝；悬停可暂停。
    </p>
  </div>
</template>

<style scoped>
.marquee-demo {
  width: 100%;
}

.marquee-demo__bar {
  height: 40px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  line-height: 40px;
}

.marquee-demo__item {
  font-size: 14px;
  color: var(--sn-web-color-text-primary, #1f2329);
}

.marquee-demo__item:not(:last-child)::after {
  content: '·';
  padding: 0 24px;
  color: var(--sn-web-color-text-tertiary, #8a919f);
}

.marquee-demo__hint {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>