<script setup lang="ts">
/**
 * Demo: sn-datetime-picker — 卡片形态（sn-cell card：每行一张独立卡片）。
 *
 * 上：sn-cell-group card 模式——组透明、行间走 token 间距，每行自带圆角 /
 * 描边 / 阴影，日期与日期时间两个入口各成一张卡；
 * 下：sn-cell card 脱离分组单独成卡，与卡片组的间距用同一 token 保持齐整。
 * 单元格行只负责触发弹层，弹层头部确认按钮始终贴右、纯文字。
 */
import { computed, ref } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import { Calendar, Clock } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const shipping = ref<string | number | undefined>(new Date(2026, 9, 29).getTime());
const openShipping = ref(false);

const meeting = ref<string | number | undefined>(new Date(2026, 9, 29, 14, 30).getTime());
const openMeeting = ref(false);

const quiet = ref<string | number | undefined>('22:30');
const openQuiet = ref(false);

const minDate = new Date(2026, 0, 1).getTime();
const maxDate = new Date(2026, 11, 31, 23, 59, 59).getTime();

const pad = (n: number) => String(n).padStart(2, '0');
const shippingText = computed(() => {
  if (shipping.value === undefined) return '';
  const d = new Date(Number(shipping.value));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
});
const meetingText = computed(() => {
  if (meeting.value === undefined) return '';
  const d = new Date(Number(meeting.value));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label">分组卡片（sn-cell-group card，每行一张卡，行间距走 token）</text>
    <SnCellGroup card>
      <SnCell
        title="发货日期"
        :prefix-icon-data="Calendar"
        placeholder="请选择"
        :value="shippingText"
        is-link
        @click="openShipping = true"
      />
      <SnCell
        title="会议时间"
        :prefix-icon-data="Clock"
        placeholder="请选择"
        :value="meetingText"
        is-link
        @click="openMeeting = true"
      />
    </SnCellGroup>

    <text class="sn-demo__label">独立卡片行（sn-cell card，脱离分组单独成卡）</text>
    <view class="sn-demo__cards">
      <SnCell
        title="免打扰时段"
        :prefix-icon-data="Clock"
        :value="String(quiet)"
        is-link
        card
        @click="openQuiet = true"
      />
    </view>

    <SnDatetimePicker
      v-model="shipping"
      v-model:visible="openShipping"
      type="date"
      title="选择发货日期"
      :min-date="minDate"
      :max-date="maxDate"
    />
    <SnDatetimePicker
      v-model="meeting"
      v-model:visible="openMeeting"
      type="datetime"
      title="选择会议时间"
      :min-date="minDate"
      :max-date="maxDate"
    />
    <SnDatetimePicker
      v-model="quiet"
      v-model:visible="openQuiet"
      type="time"
      title="选择免打扰时段"
    />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
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
