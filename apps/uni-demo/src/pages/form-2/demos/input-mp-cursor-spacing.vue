<script setup lang="ts">
/** Demo: sn-input — 光标间距（cursorSpacing）：光标与键盘保持指定间距。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const spaced = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="spaced" :cursor-spacing="24" placeholder="24px 光标间距" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
