<script setup lang="ts">
/**
 * Demo: sn-cascader — 指示条形态（lineTheme）。
 *
 * lineTheme / lineHeight / lineWidth 控制当前列指示条（数字按 rpx 设计值，
 * 1 设计值 = 2rpx）。
 */
import { computed, ref } from 'vue';
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';

const tree = [
  {
    value: 'zj',
    text: '浙江',
    children: [
      { value: 'hz', text: '杭州' },
      { value: 'nb', text: '宁波' },
    ],
  },
  { value: 'js', text: '江苏', children: [{ value: 'nj', text: '南京' }] },
];

/** 叶子值 → 展示文案，示例演示用。 */
const TEXT: Record<string, string> = { zj: '浙江', hz: '杭州', nb: '宁波', js: '江苏', nj: '南京' };

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
      >lineTheme="underline"：指示条铺满当前列底部，lineHeight 数字按 rpx 设计值。</text
    >
    <view class="sn-demo__cards">
      <SnCell
        card
        title="通知地区"
        placeholder="请选择"
        :value="underlineText"
        is-link
        @click="underlineOpen = true"
      />
    </view>
    <SnCascader
      v-model="underlineValue"
      v-model:visible="underlineOpen"
      :options="tree"
      title="通知地区"
      line-theme="underline"
      :line-height="4"
    />

    <text class="sn-demo__label">lineTheme="text" + lineWidth：点状 / 文字指示条可调宽高。</text>
    <view class="sn-demo__cards">
      <SnCell
        card
        title="活动地区"
        placeholder="请选择"
        :value="dotText"
        is-link
        @click="dotOpen = true"
      />
    </view>
    <SnCascader
      v-model="dotValue"
      v-model:visible="dotOpen"
      :options="tree"
      title="活动地区"
      line-theme="dot"
      :line-width="24"
      :line-height="6"
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
