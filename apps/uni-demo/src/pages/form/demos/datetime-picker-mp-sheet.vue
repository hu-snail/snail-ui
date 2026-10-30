<script setup lang="ts">
/** Demo: sn-datetime-picker — 弹层外观与行为：immediateChange / 按钮文案 / 遮罩 / 层级 / custom*，sn-cell 行触发。 */
import { computed, ref } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import { Clock, Settings } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const immediate = ref<string | number | undefined>(new Date(2024, 5, 15).getTime());
const openImmediate = ref(false);

const chrome = ref<string | number | undefined>(new Date(2024, 5, 15).getTime());
const openChrome = ref(false);

/** 声明但未实现：单值模式没有区间 tab，钩子永远不会被调用。 */
const tabLabel = (tab: 'start' | 'end') => (tab === 'start' ? '开始' : '结束');

const pad = (n: number) => String(n).padStart(2, '0');
const immediateText = computed(() => {
  if (immediate.value === undefined) return '';
  const d = new Date(Number(immediate.value));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup insert>
      <SnCell
        title="即时写回"
        label="immediateChange：滚动即写 v-model，不必确认"
        :prefix-icon-data="Clock"
        :value="immediateText"
        is-link
        @click="openImmediate = true"
      />
      <SnCell
        title="弹层外观"
        label="取消/确认文案、禁止遮罩关闭、zIndex、custom*"
        :prefix-icon-data="Settings"
        is-link
        @click="openChrome = true"
      />
    </SnCellGroup>

    <SnDatetimePicker
      v-model="immediate"
      v-model:visible="openImmediate"
      type="date"
      title="即时写回"
      immediate-change
    />

    <SnDatetimePicker
      v-model="chrome"
      v-model:visible="openChrome"
      type="date"
      title="弹层外观"
      cancel-button-text="不要了"
      confirm-button-text="就用这天"
      :close-on-click-modal="false"
      :safe-area-inset-bottom="false"
      :z-index="1200"
      root-portal
      custom-class="sn-demo__sheet"
      custom-style="border-radius: var(--sn-mp-radius-xl);"
      custom-view-class="sn-demo__roller"
      :display-format-tab-label="tabLabel"
    />
  </view>
</template>

<style scoped>
.sn-demo__sheet {
  background-color: var(--sn-mp-color-background-elevated);
}

.sn-demo__roller {
  padding-bottom: 8rpx;
}
</style>
