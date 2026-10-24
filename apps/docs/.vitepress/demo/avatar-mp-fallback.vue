<script setup lang="ts">
/** Demo: sn-avatar (uni-end) — 加载失败回退链 + error 事件。 */
import { onBeforeUnmount, ref } from 'vue'
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue'
import { registerSnIcons, clearSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry'
import { User } from '@snui/uni-src/components/sn-icon/sn-icon-set'

registerSnIcons({ User })
onBeforeUnmount(() => clearSnIcons())

const lastError = ref('')

function onError(): void {
  lastError.value = '图片加载失败，已回退到占位层'
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo-row">
      <SnAvatar src="/static/not-exists.png" alt="失败" @error="onError" />
      <SnAvatar src="/static/not-exists.png" text="文字兜底" @error="onError" />
      <SnAvatar src="/static/not-exists.png" icon="User" @error="onError" />
      <SnAvatar src="https://picsum.photos/seed/snui-b/120" alt="成功" />
    </view>
    <text v-if="lastError" class="sn-demo-note">{{ lastError }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.sn-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
.sn-demo-note {
  color: var(--sn-mp-color-feedback-danger);
  font-size: 12px;
}
</style>
