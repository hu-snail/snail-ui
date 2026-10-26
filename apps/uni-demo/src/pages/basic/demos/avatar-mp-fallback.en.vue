<script setup lang="ts">
/** Demo: sn-avatar (uni-end) — load-failure fallback chain + error event. */
import { onBeforeUnmount, ref } from 'vue';
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
import { registerSnIcons, clearSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import { User } from '@snui/uni-src/components/sn-icon/sn-icon-set';

registerSnIcons({ User });
onBeforeUnmount(() => clearSnIcons());

const lastError = ref('');

function onError(): void {
  lastError.value = 'Image failed to load — fell back to the placeholder layer';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo-row">
      <SnAvatar src="/static/not-exists.png" alt="Failed" @error="onError" />
      <SnAvatar src="/static/not-exists.png" text="Text fallback" @error="onError" />
      <SnAvatar src="/static/not-exists.png" icon="User" @error="onError" />
      <SnAvatar src="https://picsum.photos/seed/snui-b/120" alt="Loaded" />
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
