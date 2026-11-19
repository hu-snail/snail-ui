<script setup lang="ts">
/**
 * Demo: sn-notify (uni-end) — 多消息堆叠（deck 逐条露边）与底部锚点。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-notify from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnNotify from '@snui/uni-src/components/sn-notify/sn-notify.vue';
import type { SnNotifyInstance } from '@snui/uni-src/components/sn-notify/sn-notify-types';

const top = ref<SnNotifyInstance | null>(null);
const bottom = ref<SnNotifyInstance | null>(null);

/** 连发三条：最新一条在前，旧卡片依次向下露出一条边。 */
function showStack(): void {
  top.value?.show({
    title: '第三条通知',
    description: '堆叠最深，只露出底部边缘',
    type: 'default',
  });
  top.value?.show({
    title: '第二条通知',
    description: '插队到中间，向下顺滑让位',
    type: 'warning',
  });
  top.value?.show({
    title: '最新一条通知',
    description: '从顶部丝滑滑入，盖在旧卡片上面',
    type: 'success',
  });
}

function showBottom(): void {
  bottom.value?.show({
    title: '已从底部滑入',
    description: '底部锚点向上堆叠，同样支持拖拽关闭',
    type: 'primary',
  });
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" variant="soft" block @tap="showStack">连发三条（堆叠）</SnButton>
    <SnButton block variant="soft" @tap="top?.hideAll()">清空顶部通知</SnButton>
    <SnButton type="primary" variant="soft" block @tap="showBottom">底部弹出（position="bottom"）</SnButton>
    <SnButton block variant="soft" @tap="bottom?.hideAll()">清空底部通知</SnButton>

    <text class="sn-demo__meta">
      队列上限 maxVisible 默认 3：第 4 条进入时最旧的一条按 overflow 关闭；前端卡片
      支持左右滑动关闭。
    </text>

    <SnNotify ref="top" custom-class="sn-demo-contained" />
    <SnNotify ref="bottom" position="bottom" custom-class="sn-demo-contained" />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-notify.sn-demo-contained {
  position: absolute;
}
</style>
