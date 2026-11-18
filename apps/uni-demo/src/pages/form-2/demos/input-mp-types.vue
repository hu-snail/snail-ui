<script setup lang="ts">
/** Demo: sn-input — type 类型 (uni-end)。 */
import { reactive } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const form = reactive({
  text: '',
  email: 'ada@aui.dev',
  password: '',
  number: 42,
  tel: '',
  url: '',
  search: '',
});
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="form.text" type="text" placeholder="文本 text" />
    <SnInput v-model="form.email" type="email" placeholder="邮箱 email" />
    <SnInput v-model="form.password" type="password" placeholder="密码 password" />
    <SnInput v-model="form.number" type="number" :min="0" :max="100" placeholder="数字 number" />
    <SnInput v-model="form.tel" type="tel" placeholder="电话 tel" />
    <SnInput v-model="form.url" type="url" placeholder="链接 url" />
    <SnInput v-model="form.search" type="search" placeholder="搜索 search" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
