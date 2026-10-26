<script setup lang="ts">
/**
 * Demo: SnMarquee — 通知栏形态：左侧标签 + 中间跑马灯 + 右侧播放 / 暂停。
 * `playing` 受控播放暂停，`pauseOnHover`（默认开启）负责悬停暂停。
 */
import { ref } from 'vue'
import { SnButton, SnMarquee } from '@snui/vue-web'

const playing = ref(true)

const notices = [
  'System maintenance this Friday at 22:00, expected to take 2 hours.',
  'The new design spec has been released; please align your business lines.',
  'The monthly traffic report is ready — view it on the data dashboard.',
]
</script>

<template>
  <div class="notice-demo">
    <div class="notice-demo__bar">
      <span class="notice-demo__tag">Notice</span>
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
        {{ playing ? 'Pause' : 'Play' }}
      </SnButton>
    </div>

    <p class="notice-demo__hint">
      Hovering over the scrolling area pauses it (pause-on-hover); the button on the right pauses / resumes via the playing prop.
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