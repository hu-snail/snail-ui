<script setup lang="ts">
/** Demo: sn-button — hover-class / hover-start-time / hover-stay-time. */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
</script>

<template>
  <view class="sn-button-demo">
    <SnButton type="primary">默认 (hover-class=sn-button--feedback)</SnButton>
    <SnButton type="success" hover-class="my-press">自定义 hover-class</SnButton>
    <SnButton type="warning" :hover-start-time="500">按住 500ms 触发</SnButton>
    <SnButton :hover-stay-time="500">松手 500ms 后撤销</SnButton>
  </view>
</template>

<style scoped>
.sn-button-demo { display: flex; flex-wrap: wrap; gap: 16rpx; align-items: center; }
:deep(.my-press) {
  background: var(--sn-mp-color-feedback-success) !important;
  color: var(--sn-mp-color-text-on-primary) !important;
}
</style>