<script setup lang="ts">
/** Demo: sn-checkbox — min/max、disabled/readonly、indeterminate、toggleAll。 */
import { ref } from 'vue'
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue'
import SnCheckboxGroup from '@snui/uni-src/components/sn-checkbox/sn-checkbox-group.vue'

const limited = ref<Array<string | number | boolean>>(['a'])
const readOnly = ref<Array<string | number | boolean>>(['a'])
const groupRef = ref<InstanceType<typeof SnCheckboxGroup> | null>(null)
const all = ref<Array<string | number | boolean>>([])
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">min=1 / max=2</text>
    <SnCheckboxGroup v-model="limited" :min="1" :max="2">
      <SnCheckbox name="a">选项 A</SnCheckbox>
      <SnCheckbox name="b">选项 B</SnCheckbox>
      <SnCheckbox name="c">选项 C</SnCheckbox>
    </SnCheckboxGroup>
    <text class="sn-demo__meta">已选 {{ limited.length }} 项（最多 2 项）</text>

    <text class="sn-demo__title">disabled / readonly</text>
    <SnCheckboxGroup v-model="readOnly" disabled>
      <SnCheckbox name="a">整组禁用</SnCheckbox>
    </SnCheckboxGroup>
    <SnCheckboxGroup v-model="readOnly" readonly>
      <SnCheckbox name="a">整组只读</SnCheckbox>
    </SnCheckboxGroup>

    <text class="sn-demo__title">indeterminate（半选）</text>
    <SnCheckbox :model-value="false" indeterminate>半选状态</SnCheckbox>

    <text class="sn-demo__title">toggleAll（通过 expose 调用）</text>
    <SnCheckboxGroup ref="groupRef" v-model="all">
      <SnCheckbox name="a">选项 A</SnCheckbox>
      <SnCheckbox name="b">选项 B</SnCheckbox>
    </SnCheckboxGroup>
    <view class="sn-demo__actions">
      <text class="sn-demo__action" @tap="groupRef?.toggleAll(true)">全选</text>
      <text class="sn-demo__action" @tap="groupRef?.toggleAll(false)">全不选</text>
    </view>
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
.sn-demo__actions {
  display: flex;
  gap: 24rpx;
}
.sn-demo__action {
  font-size: 26rpx;
  color: var(--sn-mp-color-action-primary);
}
</style>
