<script setup lang="ts">
/** Demo: sn-select-picker — 字段映射与 chip 尺寸：valueKey / labelKey / selectSize / confirmButtonText / showConfirm。 */
import { ref } from 'vue'
import SnSelectPicker from '@snui/uni-src/components/sn-select-picker/sn-select-picker.vue'

/** 用 id / name 当字段名，靠 valueKey / labelKey 映射。 */
const cities = [
  { id: 'sh', name: '上海' },
  { id: 'bj', name: '北京' },
  { id: 'gz', name: '广州' },
]

const mapped = ref<Array<string | number | boolean>>(['sh'])
const openMapped = ref(false)

const mini = ref<Array<string | number | boolean>>(['sh'])
const openMini = ref(false)

const large = ref<Array<string | number | boolean>>([])
const openLarge = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">valueKey="id" + labelKey="name" + confirmButtonText</text>
    <view class="sn-demo__button" @tap="openMapped = true">字段映射</view>
    <text class="sn-demo__meta">已选：{{ mapped.join(' / ') || '（未选择）' }}</text>
    <SnSelectPicker
      v-model="mapped"
      v-model:visible="openMapped"
      :columns="cities"
      value-key="id"
      label-key="name"
      title="字段映射"
      confirm-button-text="就这些"
      checked-color="var(--sn-mp-color-action-primary)"
    />

    <text class="sn-demo__title">selectSize="mini"</text>
    <view class="sn-demo__button" @tap="openMini = true">mini chip</view>
    <SnSelectPicker
      v-model="mini"
      v-model:visible="openMini"
      :columns="cities"
      value-key="id"
      label-key="name"
      select-size="mini"
      title="mini chip"
    />

    <text class="sn-demo__title">selectSize="large" + showConfirm=false</text>
    <view class="sn-demo__button" @tap="openLarge = true">large chip / 无确认</view>
    <SnSelectPicker
      v-model="large"
      v-model:visible="openLarge"
      :columns="cities"
      value-key="id"
      label-key="name"
      select-size="large"
      :show-confirm="false"
      :max="2"
      title="large chip / 无确认"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 72rpx;
  padding: 0 32rpx;
  border-radius: var(--sn-mp-button-radius);
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-size: 28rpx;
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
