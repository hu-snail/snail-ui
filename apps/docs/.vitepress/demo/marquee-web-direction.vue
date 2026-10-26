<script setup lang="ts">
/**
 * Demo: SnMarquee — four directions (left / right / up / down).
 * 竖向跑马灯需要显式给盒子高度，否则没有可裁剪的视口。
 */
import { SnMarquee } from '@snui/vue-web';

const horizontal = '公告：本周五 22:00 - 24:00 系统维护，期间服务不可用。';
const verticalItems = ['新版本 0.1.0 已发布', '新增跑马灯 / 评论组件', '文档站支持中英文切换'];
</script>

<template>
  <div class="marquee-demo">
    <div class="marquee-demo__cell">
      <p class="marquee-demo__label">direction="left"（默认）</p>
      <SnMarquee class="marquee-demo__bar" direction="left" :duration="10">
        <span class="marquee-demo__text">{{ horizontal }}</span>
      </SnMarquee>
    </div>

    <div class="marquee-demo__cell">
      <p class="marquee-demo__label">direction="right"</p>
      <SnMarquee class="marquee-demo__bar" direction="right" :duration="10">
        <span class="marquee-demo__text">{{ horizontal }}</span>
      </SnMarquee>
    </div>

    <div class="marquee-demo__cell">
      <p class="marquee-demo__label">direction="up" + height</p>
      <SnMarquee
        class="marquee-demo__bar marquee-demo__bar--vertical"
        direction="up"
        :duration="6"
        :gap="8"
        :height="22"
      >
        <span v-for="item in verticalItems" :key="item" class="marquee-demo__line">{{ item }}</span>
      </SnMarquee>
    </div>

    <div class="marquee-demo__cell">
      <p class="marquee-demo__label">direction="down" + height</p>
      <SnMarquee
        class="marquee-demo__bar marquee-demo__bar--vertical"
        direction="down"
        :duration="6"
        :gap="8"
        :height="22"
      >
        <span v-for="item in verticalItems" :key="item" class="marquee-demo__line">{{ item }}</span>
      </SnMarquee>
    </div>
  </div>
</template>

<style scoped>
.marquee-demo {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  width: 100%;
}

.marquee-demo__label {
  margin: 0 0 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.marquee-demo__bar {
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  line-height: 40px;
}

/* 竖向：高度由 height prop 给出（22px），行高与之对齐，一次露出一行。 */
.marquee-demo__bar--vertical {
  line-height: 22px;
}

.marquee-demo__text,
.marquee-demo__line {
  display: block;
  font-size: 14px;
  line-height: 22px;
  color: var(--sn-web-color-text-primary, #1f2329);
  white-space: nowrap;
}
</style>
