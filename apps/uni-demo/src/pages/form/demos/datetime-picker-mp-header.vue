<script setup lang="ts">
/**
 * Demo: sn-datetime-picker — 弹层头部契约（取消左 / 标题中 / 确认右）。
 *
 * 头部固定三段：取消贴左、标题居中（可省略）、确认贴右。两个动作都是**纯文字**
 * 按钮，没有图标；标题省略时中间槽位仍占住剩余空间，确认不会被推向中间。
 * 「自定义文案」行演示 cancelButtonText / confirmButtonText 只换文案，布局不变。
 */
import { computed, ref } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import { Calendar } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const stamp = new Date(2026, 9, 29).getTime();

const titled = ref<string | number | undefined>(stamp);
const openTitled = ref(false);

const bare = ref<string | number | undefined>(stamp);
const openBare = ref(false);

const custom = ref<string | number | undefined>(stamp);
const openCustom = ref(false);

const pad = (n: number) => String(n).padStart(2, '0');
const textOf = (value: string | number | undefined) => {
  if (value === undefined) return '';
  const d = new Date(Number(value));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const titledText = computed(() => textOf(titled.value));
const bareText = computed(() => textOf(bare.value));
const customText = computed(() => textOf(custom.value));
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup insert>
      <SnCell
        title="带标题"
        label="title：标题居中，取消 / 确认分列两侧"
        :prefix-icon-data="Calendar"
        placeholder="请选择"
        :value="titledText"
        is-link
        @click="openTitled = true"
      />
      <SnCell
        title="无标题"
        label="不传 title：确认仍贴右边缘"
        :prefix-icon-data="Calendar"
        placeholder="请选择"
        :value="bareText"
        is-link
        @click="openBare = true"
      />
      <SnCell
        title="自定义文案"
        label="cancelButtonText / confirmButtonText：只换文字，位置不变"
        :prefix-icon-data="Calendar"
        placeholder="请选择"
        :value="customText"
        is-link
        @click="openCustom = true"
      />
    </SnCellGroup>

    <SnDatetimePicker
      v-model="titled"
      v-model:visible="openTitled"
      type="date"
      title="选择发货日期"
    />
    <SnDatetimePicker v-model="bare" v-model:visible="openBare" type="date" />
    <SnDatetimePicker
      v-model="custom"
      v-model:visible="openCustom"
      type="date"
      title="再确认一次"
      cancel-button-text="再想想"
      confirm-button-text="就它了"
    />
  </view>
</template>
