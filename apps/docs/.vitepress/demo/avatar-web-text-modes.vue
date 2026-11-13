<script setup lang="ts">
/**
 * Demo: SnAvatar — 文字头像自动截取模式（additive）。
 *
 * 把完整姓名交给 `fallback-text`，由 `text-mode` 决定展示形态：
 *   full 原样 / surname 只留姓 / last-two 名字后两位 / masked 保留姓、其余打码。
 * 截取按码点进行，emoji 与生僻字不会被截断。
 */
import { SnAvatar } from '@snui/vue-web';

const names = ['张三丰', '欧阳娜娜', '李雷'];
</script>

<template>
  <div class="demo-grid">
    <template v-for="name in names" :key="name">
      <div class="demo-row">
        <span class="demo-label">原名 · {{ name }}</span>
        <SnAvatar :fallback-text="name" circle size="large" />
        <SnAvatar
          :fallback-text="name"
          text-mode="surname"
          circle
          size="large"
          color="var(--sn-web-color-action-primary)"
        />
        <SnAvatar
          :fallback-text="name"
          text-mode="last-two"
          circle
          size="large"
          color="var(--sn-web-color-feedback-success)"
        />
        <SnAvatar
          :fallback-text="name"
          text-mode="masked"
          circle
          size="large"
          color="var(--sn-web-color-feedback-warning)"
        />
      </div>
    </template>

    <p class="demo-hint">
      依次为：full（原样）· surname（姓）· last-two（后两位）· masked（加密 *，单字名保持原样）。
    </p>
  </div>
</template>

<style scoped>
.demo-grid {
  display: grid;
  gap: 14px;
  justify-items: start;
}

.demo-row {
  display: flex;
  gap: 14px;
  align-items: center;
}

.demo-label {
  width: 120px;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}

.demo-hint {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
