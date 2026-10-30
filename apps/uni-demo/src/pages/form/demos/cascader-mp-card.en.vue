<script setup lang="ts">
/**
 * Demo: sn-cascader — Card look (`card`: every option renders as its own card).
 *
 * Top: the card flag renders each option as a rounded card (border / shadow /
 * row gap from the same tokens sn-cell's `card` uses) while drilling still runs
 * through the tab strip; bottom: the default list look for comparison. Both
 * entry points are sn-cell card rows.
 */
import { computed, ref } from 'vue';
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';

const tree = [
  {
    value: 'zj',
    text: 'Zhejiang',
    tip: 'East China',
    children: [
      { value: 'hz', text: 'Hangzhou', tip: 'Capital' },
      { value: 'nb', text: 'Ningbo', tip: 'Port' },
    ],
  },
  {
    value: 'js',
    text: 'Jiangsu',
    tip: 'East China',
    children: [{ value: 'nj', text: 'Nanjing', tip: 'Capital' }],
  },
];

/** Leaf value → display text, demo-only. */
const TEXT: Record<string, string> = {
  zj: 'Zhejiang',
  hz: 'Hangzhou',
  nb: 'Ningbo',
  js: 'Jiangsu',
  nj: 'Nanjing',
};

const cardValue = ref<string | number>('hz');
const cardOpen = ref(false);
const cardText = computed(() => TEXT[String(cardValue.value)] ?? '');

const listValue = ref<string | number>('');
const listOpen = ref(false);
const listText = computed(() => TEXT[String(listValue.value)] ?? '');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label"
      >Card look (`card`): every option is its own card — radius / border / shadow from the same
      tokens sn-cell's card uses.</text
    >
    <view class="sn-demo__cards">
      <SnCell
        card
        title="Delivery region"
        placeholder="Please select"
        :value="cardText"
        is-link
        @click="cardOpen = true"
      />
    </view>
    <SnCascader
      v-model="cardValue"
      v-model:visible="cardOpen"
      :options="tree"
      title="Delivery region"
      card
      check-strictly
      confirm-text="Use it"
    />

    <text class="sn-demo__label"
      >For comparison: the default list look (no `card`, edge-to-edge rows with a hairline).</text
    >
    <view class="sn-demo__cards">
      <SnCell
        card
        title="Office location"
        placeholder="Please select"
        :value="listText"
        is-link
        @click="listOpen = true"
      />
    </view>
    <SnCascader
      v-model="listValue"
      v-model:visible="listOpen"
      :options="tree"
      title="Office location"
      check-strictly
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
