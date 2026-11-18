<script setup lang="ts">
/** Demo: sn-picker-view — `#option` 插槽富内容行：主标题 + 副标题两行布局，选中行主题色。 */
import { ref } from 'vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';

const cities = [
  { value: 'hz', label: '杭州', code: 'ZHS · 0571' },
  { value: 'sh', label: '上海', code: 'SHA · 021' },
  { value: 'sz', label: '深圳', code: 'SZX · 0755' },
  { value: 'cd', label: '成都', code: 'CTU · 028' },
  { value: 'wh', label: '武汉', code: 'WUH · 027' },
];
const value = ref<Array<string | number>>(['sz']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPickerView
      v-model="value"
      :columns="[cities]"
      wheel
      vibrate-short
      :visible-item-count="5"
      :item-height="52"
    >
      <template #option="{ option, active }">
        <view class="rich-row">
          <text class="rich-row__title" :class="{ 'rich-row__title--active': active }">
            {{ option.label }}
          </text>
          <text class="rich-row__code" :class="{ 'rich-row__code--active': active }">
            {{ String(option.raw.code) }}
          </text>
        </view>
      </template>
    </SnPickerView>
    <text class="sn-demo__meta">已选：{{ value[0] }}（主副标题双行，raw 透传业务字段）</text>
  </view>
</template>

<style scoped>
.rich-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

.rich-row__title {
  font-size: 30rpx;
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-primary);
}

.rich-row__title--active {
  color: var(--sn-mp-color-action-primary);
}

.rich-row__code {
  margin-left: 16rpx;
  font-size: 22rpx;
  color: var(--sn-mp-color-text-tertiary);
}

.rich-row__code--active {
  color: var(--sn-mp-color-action-primary);
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
