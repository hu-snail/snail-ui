<script setup lang="ts">
/**
 * Demo: sn-cascader — Lazy loading and confirm veto: lazyLoad / isLeafKey /
 * beforeConfirm.
 *
 * The lazy root only carries regions; expanding a non-leaf node asks the host
 * for children. beforeConfirm only lets the Zhejiang branch through and the
 * verdict is reported back through a sn-cell card row.
 */
import { computed, ref } from 'vue';
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';

/** Lazy root nodes: isLeaf decides whether a node can drill down further. */
const tree = [
  { value: 'zj', text: 'Zhejiang', isLeaf: false },
  { value: 'js', text: 'Jiangsu', isLeaf: false },
  { value: 'sh', text: 'Shanghai', isLeaf: true },
];

/** Value → display text (a lazy v-model is a path array). */
const TEXT: Record<string, string> = {
  zj: 'Zhejiang',
  hz: 'Hangzhou',
  nb: 'Ningbo',
  js: 'Jiangsu',
  nj: 'Nanjing',
  sh: 'Shanghai',
};

const value = ref<string | number | Array<string | number>>([]);
const open = ref(false);
const lastGuard = ref('Pending');

const children: Record<string, Array<Record<string, unknown>>> = {
  zj: [
    { value: 'hz', text: 'Hangzhou', isLeaf: true },
    { value: 'nb', text: 'Ningbo', isLeaf: true },
  ],
  js: [{ value: 'nj', text: 'Nanjing', isLeaf: true }],
};

/** Called when a non-leaf node expands — the host supplies the children. */
const load = (
  option: Record<string, unknown>,
  _tabIndex: number,
  resolve: (children: Array<Record<string, unknown>>) => void,
) => {
  resolve(children[String(option.value)] ?? []);
};

/** Only the Zhejiang branch may be confirmed. */
const guard = (payload: { value: string | number | Array<string | number> }) => {
  const first = Array.isArray(payload.value) ? payload.value[0] : payload.value;
  const allowed = first === 'zj' || first === 'hz' || first === 'nb';
  lastGuard.value = allowed ? 'Allowed' : 'Zhejiang only';
  return allowed;
};

const selectedText = computed(() =>
  Array.isArray(value.value)
    ? value.value.map((each) => TEXT[String(each)] ?? String(each)).join(' / ')
    : (TEXT[String(value.value)] ?? ''),
);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label"
      >lazyLoad fetches children on demand; isLeafKey marks leaves; beforeConfirm vetoes the
      confirm, with its verdict reported by the guard card row.</text
    >
    <view class="sn-demo__cards">
      <SnCell
        card
        title="Delivery region"
        placeholder="Please select"
        :value="selectedText"
        is-link
        @click="open = true"
      />
      <SnCell card title="Confirm guard" :value="lastGuard" />
    </view>
    <SnCascader
      v-model="value"
      v-model:visible="open"
      :options="tree"
      :lazy-load="load"
      is-leaf-key="isLeaf"
      check-strictly
      :before-confirm="guard"
      title="Delivery region"
      confirm-text="Use it"
    />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  width: 100%;
}

.sn-demo__cards {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}

.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
