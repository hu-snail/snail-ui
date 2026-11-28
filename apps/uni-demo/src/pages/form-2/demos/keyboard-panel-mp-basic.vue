<script setup lang="ts">
/** Demo: sn-keyboard-panel — 内嵌键盘面板视图：无弹层直接嵌在页面里，collapse 事件由宿主处理。 */
import { ref } from 'vue';
import SnKeyboardPanel from '@snui/uni-src/components/sn-keyboard-panel/sn-keyboard-panel.vue';

const amount = ref('');
const decimal = ref('');
const plate = ref('');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">默认面板（收起键发 collapse 事件）</text>
    <text class="sn-demo__meta">数值：{{ amount || '（空）' }}</text>
    <SnKeyboardPanel v-model="amount" :maxlength="6" title="金额" />

    <text class="sn-demo__title">小数点面板（extraKey=.）</text>
    <text class="sn-demo__meta">金额：{{ decimal || '（空）' }}</text>
    <SnKeyboardPanel v-model="decimal" :maxlength="8" extra-key="." />

    <text class="sn-demo__title">车牌面板（mode=car + autoSwitchLang）</text>
    <text class="sn-demo__meta">车牌：{{ plate || '（空）' }}</text>
    <SnKeyboardPanel v-model="plate" mode="car" auto-switch-lang :maxlength="8" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--demo-text);
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
