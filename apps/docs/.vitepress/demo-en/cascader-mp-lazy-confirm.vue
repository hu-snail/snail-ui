<script setup lang="ts">
/** Demo: sn-cascader — lazy loading and confirm veto: lazyLoad / isLeafKey / beforeConfirm / checkStrictly. */
import { ref } from 'vue'
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue'

/** Lazy root nodes: isLeaf decides whether a node can drill down further. */
const tree = [
  { value: 'zj', text: 'Zhejiang', isLeaf: false },
  { value: 'js', text: 'Jiangsu', isLeaf: false },
  { value: 'sh', text: 'Shanghai', isLeaf: true },
]

const value = ref<string | number | Array<string | number>>([])
const open = ref(false)
const lastGuard = ref('—')

const children: Record<string, Array<Record<string, unknown>>> = {
  zj: [
    { value: 'hz', text: 'Hangzhou', isLeaf: true },
    { value: 'nb', text: 'Ningbo', isLeaf: true },
  ],
  js: [{ value: 'nj', text: 'Nanjing', isLeaf: true }],
}

/** Called when a non-leaf node expands — the host supplies the children. */
const load = (
  option: Record<string, unknown>,
  _tabIndex: number,
  resolve: (children: Array<Record<string, unknown>>) => void,
) => {
  resolve(children[String(option.value)] ?? [])
}

/** Only the Zhejiang branch may be confirmed. */
const guard = (payload: { value: string | number | Array<string | number> }) => {
  const first = Array.isArray(payload.value) ? payload.value[0] : payload.value
  const allowed = first === 'zj' || first === 'hz' || first === 'nb'
  lastGuard.value = allowed ? 'Allowed' : 'Zhejiang only'
  return allowed
}

const selectedText = () => (Array.isArray(value.value) ? value.value.join(' / ') : value.value)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">lazyLoad + isLeafKey + beforeConfirm + checkStrictly</text>
    <view class="sn-demo__button" @tap="open = true">Lazy loading</view>
    <text class="sn-demo__meta">Selected: {{ selectedText() || '(not selected)' }}</text>
    <text class="sn-demo__meta">Guard: {{ lastGuard }}</text>
    <SnCascader
      v-model="value"
      v-model:visible="open"
      :options="tree"
      :lazy-load="load"
      is-leaf-key="isLeaf"
      check-strictly
      :before-confirm="guard"
      title="Lazy loading"
      confirm-text="Use it"
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
