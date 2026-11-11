<script setup lang="ts">
/** Demo: sn-input — 边框（border）：border 四种取值 + bordered 旧布尔别名（圆角见 radius 场景）。 */
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
</script>

<template>
  <view class="sn-input-demo">
    <SnInput placeholder='border="all"（默认，四边描边）' />
    <SnInput placeholder='border="bottom"（仅下边框，行内表单）' border="bottom" />
    <SnInput placeholder='border="none"（无边框）' border="none" />
    <SnInput placeholder="bordered=false（旧布尔别名 → none）" :bordered="false" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
