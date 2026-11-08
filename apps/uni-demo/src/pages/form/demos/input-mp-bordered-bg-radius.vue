<script setup lang="ts">
/** Demo: sn-input — border 边框 / bg 背景（圆角见 radius 场景）。 */
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
</script>

<template>
  <view class="sn-input-demo">
    <text class="sn-input-demo__caption">border 边框</text>
    <SnInput placeholder='border="all"（默认，四边描边）' />
    <SnInput placeholder='border="bottom"（仅下边框，行内表单）' border="bottom" />
    <SnInput placeholder='border="none"（无边框）' border="none" />
    <SnInput placeholder="bordered=false（旧布尔别名 → none）" :bordered="false" />

    <text class="sn-input-demo__caption">bg 背景</text>
    <SnInput placeholder='bg="surface"（默认，卡片底）' bg="surface" />
    <SnInput placeholder='bg="transparent"（透出页面底色）' bg="transparent" border="none" />
    <SnInput placeholder='bg="soft"（次级填充）' bg="soft" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-input-demo__caption {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
