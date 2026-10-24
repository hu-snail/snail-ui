<script setup lang="ts">
/** Demo: sn-input-number — 取值规则与提交时机：stepStrictly / allowNull / placeholder / beforeChange / immediateChange / updateOnInit / adjustPosition / inputType。 */
import { ref } from 'vue'
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue'

const snapped = ref(0)
const nullable = ref<string | number>('')
const guarded = ref(5)
const lastGuard = ref('—')
const deferred = ref(5)
const corrected = ref(0)

/** 偶数才允许提交 —— 演示 beforeChange 拦截。 */
const evenOnly = (value: number | string) => {
  const numeric = Number(value)
  const allowed = Number.isFinite(numeric) && numeric % 2 === 0
  lastGuard.value = allowed ? '已允许' : '只接受偶数'
  return allowed
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">stepStrictly + step=3（值吸附到 0/3/6/9…）</text>
    <SnInputNumber v-model="snapped" :min="0" :max="20" :step="3" step-strictly />

    <text class="sn-demo__title">allowNull + placeholder（输入框可留空）</text>
    <SnInputNumber v-model="nullable" :min="0" :max="99" allow-null placeholder="可留空" />

    <text class="sn-demo__title">beforeChange（只接受偶数）</text>
    <SnInputNumber v-model="guarded" :min="0" :max="20" :before-change="evenOnly" />
    <text class="sn-demo__meta">守卫：{{ lastGuard }}</text>

    <text class="sn-demo__title">immediateChange=false（只在失焦 / 按钮时提交）</text>
    <SnInputNumber v-model="deferred" :min="0" :max="20" :immediate-change="false" />

    <text class="sn-demo__title">updateOnInit（挂载即纠正越界值）+ inputType="number" + adjustPosition=false</text>
    <SnInputNumber
      v-model="corrected"
      :min="0"
      :max="10"
      :step="5"
      update-on-init
      input-type="number"
      :adjust-position="false"
    />
    <text class="sn-demo__meta">挂载后被纠正为：{{ corrected }}</text>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
