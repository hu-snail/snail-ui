<script setup lang="ts">
/** Demo: sn-datetime-picker — 确认拦截（beforeConfirm）：拦截时弹层不关闭。 */
import { ref } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import { Clock } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const time = ref<string | number | undefined>('10:30');
const open = ref(false);
// 只允许确认 09:00 之后的时间 —— 用来演示 beforeConfirm 拦截。
const guard = (value: string | number) => String(value) >= '09:00';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup insert>
      <SnCell
        title="确认拦截"
        label="beforeConfirm（09:00 前拦截）"
        :prefix-icon-data="Clock"
        placeholder="请选择"
        :value="time ? String(time) : ''"
        is-link
        @click="open = true"
      />
    </SnCellGroup>

    <SnDatetimePicker
      v-model="time"
      v-model:visible="open"
      type="time"
      title="确认拦截"
      confirm-button-text="就它"
      :before-confirm="guard"
    />
  </view>
</template>
