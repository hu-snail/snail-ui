<script setup lang="ts">
/**
 * Demo: SnMarquee — 通知栏形态：左侧标签 + 中间跑马灯 + 右侧播放 / 暂停。
 * `playing` 受控播放暂停，`pauseOnHover`（默认开启）负责悬停暂停。
 */
import { ref } from 'vue'
import { SnButton, SnMarquee } from '@snui/vue-web'

const playing = ref(true)

const notices = [
  '系统将于本周五 22:00 例行维护，预计 2 小时。',
  '新版设计规范已发布，请各业务线对齐。',
  '本月流量报告已生成，可在数据看板查看。',
]
</script>

<template>
  <div class="notice-demo">
    <div class="notice-demo__bar">
      <span class="notice-demo__tag">公告</span>
      <SnMarquee
        class="notice-demo__ticker"
        :duration="14"
        :gap="40"
        :playing="playing"
        :pause-on-hover="true"
      >
        <span v-for="(notice, index) in notices" :key="index" class="notice-demo__item">
          {{ notice }}
        </span>
      </SnMarquee>
      <SnButton size="small" @click="playing = !playing">
        {{ playing ? '暂停' : '播放' }}
      </SnButton>
    </div>

    <p class="notice-demo__hint">
      鼠标悬停在滚动区域会暂停（pause-on-hover）；点击右侧按钮通过 playing 受控暂停 / 恢复。
    </p>
  </div>
</template>

<style scoped>
.notice-demo {
  width: 100%;
}

.notice-demo__bar {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
}

.notice-demo__tag {
  flex: 0 0 auto;
  padding: 0 8px;
  border-radius: 4px;
  background: var(--sn-web-color-action-primary, #1677ff);
  color: var(--sn-web-color-text-on-primary, #ffffff);
  font-size: 12px;
  line-height: 20px;
}

.notice-demo__ticker {
  flex: 1 1 auto;
  min-width: 0;
  line-height: 40px;
}

.notice-demo__item {
  font-size: 14px;
  color: var(--sn-web-color-text-primary, #1f2329);
}

.notice-demo__hint {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>