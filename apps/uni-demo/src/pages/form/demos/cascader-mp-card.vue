<script setup lang="ts">
/**
 * Demo: sn-cascader — 卡片形态（card：弹层内每个选项自成一张卡片）。
 *
 * 上：card 打开，选项渲染为圆角卡片（描边 / 阴影 / 行间距与 sn-cell card
 * 同一套 token），逐级下钻时层级切换仍走 tab；下：不传 card 的默认列表
 * 形态作对照。两处触发入口都用 sn-cell 卡片行。
 */
import { computed, ref } from 'vue';
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';

const tree = [
  {
    value: 'zj',
    text: '浙江',
    tip: '华东',
    children: [
      { value: 'hz', text: '杭州', tip: '省会' },
      { value: 'nb', text: '宁波', tip: '港口' },
    ],
  },
  {
    value: 'js',
    text: '江苏',
    tip: '华东',
    children: [{ value: 'nj', text: '南京', tip: '省会' }],
  },
];

/** 叶子值 → 展示文案，示例演示用。 */
const TEXT: Record<string, string> = { zj: '浙江', hz: '杭州', nb: '宁波', js: '江苏', nj: '南京' };

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
      >卡片形态（card）：每个选项自成一张卡片，圆角 / 描边 / 阴影与 sn-cell card 同一套
      token。</text
    >
    <view class="sn-demo__cards">
      <SnCell
        card
        title="配送地区"
        placeholder="请选择"
        :value="cardText"
        is-link
        @click="cardOpen = true"
      />
    </view>
    <SnCascader
      v-model="cardValue"
      v-model:visible="cardOpen"
      :options="tree"
      title="配送地区"
      card
      check-strictly
      confirm-text="就它"
    />

    <text class="sn-demo__label">对照：默认列表形态（不传 card，行间为通栏分隔线）。</text>
    <view class="sn-demo__cards">
      <SnCell
        card
        title="办公地点"
        placeholder="请选择"
        :value="listText"
        is-link
        @click="listOpen = true"
      />
    </view>
    <SnCascader
      v-model="listValue"
      v-model:visible="listOpen"
      :options="tree"
      title="办公地点"
      check-strictly
      confirm-text="就它"
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
