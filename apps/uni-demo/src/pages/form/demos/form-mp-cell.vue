<script setup lang="ts">
/**
 * Demo: sn-form-item — Cell 列表化：border 分隔线 / ellipsis 长标签 /
 * clickable + isLink 点击行 / placeholder 空值兜底 / description 副文案。
 */
import { reactive, ref } from 'vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const data = reactive({ email: '', nickname: '', city: '', summary: '' });
const clickTimes = ref(0);

function onCityClick(): void {
  clickTimes.value += 1;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm :model="data" border label-position="left" label-width="240">
      <SnFormItem prop="email" label="邮箱" description="用于接收验证码，不会用于营销">
        <SnInput v-model="data.email" type="email" placeholder="you@example.com" clearable />
      </SnFormItem>

      <SnFormItem prop="nickname" label="一个很长的标签在这里按 ellipsis 截断显示" ellipsis>
        <SnInput v-model="data.nickname" placeholder="请输入昵称" clearable />
      </SnFormItem>

      <SnFormItem
        prop="city"
        label="常住城市"
        placeholder="未填写"
        clickable
        is-link
        @click="onCityClick"
      />

      <SnFormItem prop="summary" label="个人简介" is-link>
        <SnInput v-model="data.summary" readonly placeholder="未填写" />
      </SnFormItem>
    </SnForm>

    <text class="sn-demo__meta">
      点击「常住城市」行 {{ clickTimes }} 次；空值行由 placeholder 兜底显示
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  width: 100%;
}

.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
