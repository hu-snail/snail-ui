<script setup lang="ts">
/** Demo: sn-form-item — 单元格分隔与截断：border 分隔线 / ellipsis 长标签截断。 */
import { reactive } from 'vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const data = reactive({ email: '', nickname: '' });
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm :model="data" border label-position="left" label-width="240">
      <SnFormItem prop="email" label="邮箱">
        <SnInput v-model="data.email" type="email" placeholder="you@example.com" clearable />
      </SnFormItem>

      <SnFormItem prop="nickname" label="一个很长的标签在这里按 ellipsis 截断显示" ellipsis>
        <SnInput v-model="data.nickname" placeholder="请输入昵称" clearable />
      </SnFormItem>
    </SnForm>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  width: 100%;
}
</style>
