<script setup lang="ts">
/**
 * Demo: SnMarquee — 基础横向跑马灯。
 * Per AUI-DOCS-016: imports the real @snui/vue-web SnMarquee.
 * 默认 12 秒一轮、24px 间距、鼠标悬停暂停。
 */
import { SnMarquee } from '@snui/vue-web';

const notices = [
  'Notice: system maintenance this Friday 22:00 - 24:00; services unavailable during that window.',
  'Component library docs updated with new Marquee, Comment and more.',
  'All-hands meeting next Monday at 10:00 in the multipurpose room. Please be on time.',
];
</script>

<template>
  <div class="marquee-demo">
    <SnMarquee class="marquee-demo__bar" :duration="16">
      <span v-for="(notice, index) in notices" :key="index" class="marquee-demo__item">
        {{ notice }}
      </span>
    </SnMarquee>

    <p class="marquee-demo__hint">
      Put a single copy of the content in the slot; the component duplicates it end-to-end for a
      seamless loop, and hovering pauses it.
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
