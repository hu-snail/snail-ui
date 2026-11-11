<script setup lang="ts">
/**
 * Demo: sn-calendar — 弹层外观与底栏插槽。
 *
 * 一张 cell 卡片承载入口：show-confirm=false 去掉确认按钮、confirm-left 插槽
 * 置清空动作，叠加遮罩关闭 / 底部安全区 / 层级 / 自定义类名与样式转发。
 */
import { computed, ref } from 'vue';
import { Info } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const noConfirm = ref<number | number[] | null>(new Date(2024, 5, 15).getTime());
const open = ref(false);

function fmtStamp(value: number | number[] | null): string {
  if (typeof value !== 'number') return '';
  const d = new Date(value);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const noConfirmText = computed(() => fmtStamp(noConfirm.value));
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup card title="弹层外观与底栏插槽">
      <SnCell
        title="无确认按钮 + 底栏插槽"
        label="show-confirm=false · confirm-left 插槽置清空 · close-on-click-modal=false"
        :value="noConfirmText"
        placeholder="未选择"
        :prefix-icon-data="Info"
        is-link
        @click="open = true"
      />
    </SnCellGroup>

    <SnCalendar
      v-model="noConfirm"
      v-model:visible="open"
      type="date"
      title="无确认按钮"
      :min-date="min"
      :max-date="max"
      :show-confirm="false"
      :close-on-click-modal="false"
      :safe-area-inset-bottom="false"
      :z-index="1100"
      root-portal
      custom-class="sn-demo__sheet"
      custom-style="border-radius: var(--sn-mp-radius-xl);"
    >
      <template #confirm-left>
        <view class="sn-demo__reset" role="button" aria-label="清空" @tap="noConfirm = null">
          <text>清空</text>
        </view>
      </template>
    </SnCalendar>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}

.sn-demo__sheet {
  background-color: var(--sn-mp-color-background-elevated);
}

.sn-demo__reset {
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-soft);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}
</style>
