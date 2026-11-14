<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — 仅点击不展开（`expandable=false`）。
 *
 * 点触发按钮不展开，只抛 `click`（右下，trigger 插槽渲染 Phone 图标，
 * 语义是单动作拨号键）；计数展示反馈。
 *
 * 文案与 fab-mp-expandable.en.vue 对等。
 */
import { ref } from 'vue';
import SnFab from '@snui/uni-src/components/sn-fab/sn-fab.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Phone } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const clicks = ref(0);

function onClick(): void {
  clicks.value += 1;
}
</script>

<template>
  <view class="sn-demo sn-fab-demo__stage">
    <view class="sn-fab-demo__hint">
      <text class="sn-fab-demo__hint-title">仅点击不展开</text>
      <text class="sn-fab-demo__hint-text">
        右下：expandable=false 不展开动作项，只抛 click（已点 {{ clicks }} 次）。
      </text>
    </view>

    <SnFab
      position="right-bottom"
      :expandable="false"
      :gap="{ bottom: 16, right: 16 }"
      custom-style="position: absolute;"
      @click="onClick"
    >
      <template #trigger>
        <SnIcon :icon="Phone" size="var(--sn-mp-icon-size-large)" />
      </template>
    </SnFab>
  </view>
</template>

<style scoped>
.sn-fab-demo__stage {
  position: relative;
  width: 100%;
  height: 560rpx;
  overflow: hidden;
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-mp-color-background-subtle);
}

.sn-fab-demo__hint {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
  padding: var(--sn-mp-spacing-4) var(--sn-mp-spacing-5) 0;
  max-width: 60%;
}

.sn-fab-demo__hint-title {
  font-size: var(--sn-mp-font-size-md);
  font-weight: 600;
  color: var(--sn-mp-color-text-primary);
}

.sn-fab-demo__hint-text {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-secondary);
}

</style>
