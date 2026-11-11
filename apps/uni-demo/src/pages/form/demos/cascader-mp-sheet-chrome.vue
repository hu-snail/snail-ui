<script setup lang="ts">
/**
 * Demo: sn-cascader — 弹层配置（遮罩 / 层级 / 自定义）。
 *
 * closeOnClickModal / safeAreaInsetBottom / zIndex / rootPortal /
 * customClass / customStyle 控制弹层行为与外观。
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

const value = ref<string | number>('hz');
const open = ref(false);
const selectedText = computed(() => TEXT[String(value.value)] ?? '');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label"
      >弹层配置：遮罩不关闭（closeOnClickModal=false）、不补安全区、zIndex 提升，customStyle
      改圆角。</text
    >
    <view class="sn-demo__cards">
      <SnCell
        card
        title="活动地区"
        placeholder="请选择"
        :value="selectedText"
        is-link
        @click="open = true"
      />
    </view>
    <SnCascader
      v-model="value"
      v-model:visible="open"
      :options="tree"
      title="活动地区"
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
