<script setup lang="ts">
/** Demo: sn-form — labelPosition × labelWidth (uni-end). */
import { reactive } from 'vue'
import { SnForm, SnFormItem, SnInput } from '@snui/uni'

const f1 = reactive({ a: '', b: '' })
const f2 = reactive({ a: '', b: '' })
const f3 = reactive({ a: '', b: '' })
</script>

<template>
  <view class="sn-form-demo">
    <view class="sn-form-demo__title">labelPosition: right + labelWidth: 160rpx</view>
    <SnForm :model="f1" label-position="right" label-width="160">
      <SnFormItem prop="a" label="Email">
        <SnInput v-model="f1.a" />
      </SnFormItem>
      <SnFormItem prop="b" label="Password">
        <SnInput v-model="f1.b" type="password" />
      </SnFormItem>
    </SnForm>

    <view class="sn-form-demo__title">labelPosition: left + labelWidth: 200rpx</view>
    <SnForm :model="f2" label-position="left" label-width="200">
      <SnFormItem prop="a" label="Email">
        <SnInput v-model="f2.a" />
      </SnFormItem>
      <SnFormItem prop="b" label="Password">
        <SnInput v-model="f2.b" type="password" />
      </SnFormItem>
    </SnForm>

    <view class="sn-form-demo__title">labelPosition: top</view>
    <SnForm :model="f3" label-position="top">
      <SnFormItem prop="a" label="Email">
        <SnInput v-model="f3.a" />
      </SnFormItem>
      <SnFormItem prop="b" label="Password">
        <SnInput v-model="f3.b" type="password" />
      </SnFormItem>
    </SnForm>
  </view>
</template>

<style scoped>
.sn-form-demo { display: flex; flex-direction: column; gap: 48rpx; max-width: 600rpx; }
.sn-form-demo__title { font-size: 26rpx; font-weight: 600; color: var(--vp-c-text-1); }
</style>