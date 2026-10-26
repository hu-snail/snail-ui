<script setup lang="ts">
/** Demo: sn-text (uni-end) — 多行截断 + 字号 / 行高 / 颜色覆盖。 */
import SnText from '@snui/uni-src/components/sn-text/sn-text.vue';

const longText =
  '移动端列表里的说明文案常常超过一屏宽度。设置 lines 之后，超出的部分会被截断并显示省略号，保证每一行卡片高度一致。';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnText :text="longText" :lines="1" />
    <SnText :text="longText" :lines="2" />
    <SnText :text="longText" :lines="3" />
    <SnText text="字号 18px" size="18px" />
    <SnText text="行高 28px" size="14px" line-height="28px" />
    <SnText text="自定义颜色" color="var(--sn-mp-color-purple)" />
    <SnText text="前后缀" prefix="[" suffix="]" type="primary" />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
  max-width: 100%;
}
</style>
