<script setup lang="ts">
/**
 * Demo: sn-cascader — Sheet and indicator: lineTheme / lineWidth / lineHeight /
 * closeOnClickModal / zIndex / safeAreaInsetBottom / custom*.
 *
 * Top: the underline indicator; bottom: the dot indicator plus sheet settings
 * (mask tap keeps the sheet open, no safe-area padding, higher zIndex,
 * customClass / customStyle). Both entry points are sn-cell card rows.
 */
import { computed, ref } from 'vue';
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';

const tree = [
  {
    value: 'zj',
    text: 'Zhejiang',
    children: [
      { value: 'hz', text: 'Hangzhou' },
      { value: 'nb', text: 'Ningbo' },
    ],
  },
  { value: 'js', text: 'Jiangsu', children: [{ value: 'nj', text: 'Nanjing' }] },
];

/** Leaf value → display text, demo-only. */
const TEXT: Record<string, string> = {
  zj: 'Zhejiang',
  hz: 'Hangzhou',
  nb: 'Ningbo',
  js: 'Jiangsu',
  nj: 'Nanjing',
};

const underlineValue = ref<string | number>('hz');
const underlineOpen = ref(false);
const underlineText = computed(() => TEXT[String(underlineValue.value)] ?? '');

const dotValue = ref<string | number>('hz');
const dotOpen = ref(false);
const dotText = computed(() => TEXT[String(dotValue.value)] ?? '');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label"
      >lineTheme="underline": the indicator spans the active column's bottom edge; lineHeight is an
      rpx design value.</text
    >
    <view class="sn-demo__cards">
      <SnCell
        card
        title="Alert region"
        placeholder="Please select"
        :value="underlineText"
        is-link
        @click="underlineOpen = true"
      />
    </view>
    <SnCascader
      v-model="underlineValue"
      v-model:visible="underlineOpen"
      :options="tree"
      title="Alert region"
      line-theme="underline"
      :line-height="4"
    />

    <text class="sn-demo__label"
      >lineTheme="dot" + sheet settings: the mask tap keeps it open (closeOnClickModal=false), no
      safe-area padding, higher zIndex, customStyle tweaks the radius.</text
    >
    <view class="sn-demo__cards">
      <SnCell
        card
        title="Campaign region"
        placeholder="Please select"
        :value="dotText"
        is-link
        @click="dotOpen = true"
      />
    </view>
    <SnCascader
      v-model="dotValue"
      v-model:visible="dotOpen"
      :options="tree"
      title="Campaign region"
      line-theme="dot"
      :line-width="24"
      :line-height="6"
      :close-on-click-modal="false"
      :safe-area-inset-bottom="false"
      :z-index="1250"
      root-portal
      custom-class="sn-demo__sheet"
      custom-style="border-radius: var(--sn-mp-radius-xl);"
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

.sn-demo__sheet {
  background-color: var(--sn-mp-color-background-elevated);
}
</style>
