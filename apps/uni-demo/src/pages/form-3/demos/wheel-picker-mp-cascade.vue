<script setup lang="ts">
/** Demo: sn-wheel-picker — 级联选择（`cascade`）：省市区三级联动 + wheel 风格窄带 + 滑动震动。 */
import { ref } from 'vue';
import SnWheelPicker from '@snui/uni-src/components/sn-wheel-picker/sn-wheel-picker.vue';

interface RegionNode {
  value: string;
  label: string;
  children?: RegionNode[];
}

const regions: RegionNode[] = [
  {
    value: 'zj',
    label: '浙江',
    children: [
      {
        value: 'hz',
        label: '杭州',
        children: [
          { value: 'xh', label: '西湖区' },
          { value: 'bc', label: '滨江区' },
          { value: 'yl', label: '余杭区' },
        ],
      },
      {
        value: 'nb',
        label: '宁波',
        children: [
          { value: 'ha', label: '海曙区' },
          { value: 'jd', label: '江东区' },
        ],
      },
    ],
  },
  {
    value: 'gd',
    label: '广东',
    children: [
      {
        value: 'gz',
        label: '广州',
        children: [
          { value: 'th', label: '天河区' },
          { value: 'hp', label: '黄埔区' },
        ],
      },
      {
        value: 'sz',
        label: '深圳',
        children: [
          { value: 'ns', label: '南山区' },
          { value: 'ft', label: '福田区' },
        ],
      },
    ],
  },
];

const value = ref<Array<string | number>>(['zj', 'hz', 'xh']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnWheelPicker
      v-model="value"
      :columns="regions"
      cascade
      :visible-item-count="5"
      :item-height="44"
      custom-style="--sn-picker-view-wheel-inset: 40rpx; --sn-picker-view-wheel-radius: 44rpx"
    />
    <text class="sn-demo__meta">已选：{{ value.join(' / ') }}（级联列继承 wheel 胶囊带 + 滑动震动）</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
