<script setup lang="ts">
/** Demo: sn-slide-verify — sn-slide-verify 拖动验证：滑块拖到最右端（容差 tolerance 内）触发 success，否则 fail 并归位。 */
import { ref } from 'vue'
import SnSlideVerify from '@snui/uni-src/components/sn-slide-verify/sn-slide-verify.vue'

const status = ref('待验证')
const onSuccess = () => { status.value = '已通过' }
const onFail = () => { status.value = '未通过' }
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSlideVerify @success="onSuccess" @fail="onFail" />
    <text class="sn-demo__meta">状态：{{ status }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
