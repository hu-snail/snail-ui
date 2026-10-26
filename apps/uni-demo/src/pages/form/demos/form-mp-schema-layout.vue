<script setup lang="ts">
/**
 * Demo: sn-form — schema / center / titleWidth / layout。
 *
 * `title-width` 与 `label-width` 共用一条继承链（title-width 优先），`layout`
 * 取 `horizontal` / `vertical` 决定 label 与控件的排布，`center` 让控件列在
 * 单元格内垂直居中，`schema` 是表单级校验描述（本构建只存进上下文，实际校验
 * 仍走 `rules` / item 级 rules）。
 */
import { reactive } from 'vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types';

const horizontal = reactive({ name: '', phone: '' });
const vertical = reactive({ name: '', phone: '' });
const centered = reactive({ name: '', phone: '' });
const silent = reactive({ name: '', phone: '' });

const rules: Record<string, FormRule[]> = {
  name: [{ required: true, message: '请填写姓名' }],
  phone: [{ required: true, message: '请填写手机号' }],
};

/** 表单级 schema：描述字段与校验意图，组件保存到上下文。 */
const schema = {
  name: { label: '姓名', required: true },
  phone: { label: '手机号', required: true },
};
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">titleWidth=160 + layout=horizontal（默认）</text>
    <SnForm :model="horizontal" :rules="rules" :schema="schema" :title-width="160">
      <SnFormItem prop="name" label="姓名">
        <SnInput v-model="horizontal.name" placeholder="请输入" />
      </SnFormItem>
      <SnFormItem prop="phone" label="手机号">
        <SnInput v-model="horizontal.phone" placeholder="请输入" />
      </SnFormItem>
    </SnForm>

    <text class="sn-demo__title">layout=vertical：label 叠在控件上方</text>
    <SnForm :model="vertical" :rules="rules" layout="vertical" :title-width="200">
      <SnFormItem prop="name" label="姓名">
        <SnInput v-model="vertical.name" placeholder="请输入" />
      </SnFormItem>
      <SnFormItem prop="phone" label="手机号">
        <SnInput v-model="vertical.phone" placeholder="请输入" />
      </SnFormItem>
    </SnForm>

    <text class="sn-demo__title">center：控件列在单元格内垂直居中</text>
    <SnForm :model="centered" center :title-width="160">
      <SnFormItem prop="name" label="姓名">
        <SnInput v-model="centered.name" placeholder="请输入" />
      </SnFormItem>
      <SnFormItem prop="phone" label="手机号">
        <SnInput v-model="centered.phone" placeholder="请输入" />
      </SnFormItem>
    </SnForm>

    <text class="sn-demo__title">showMessage=false：校验照跑，错误文案不渲染</text>
    <SnForm :model="silent" :rules="rules" :show-message="false" :title-width="160">
      <SnFormItem prop="name" label="姓名">
        <SnInput v-model="silent.name" placeholder="留空后失焦" />
      </SnFormItem>
      <SnFormItem prop="phone" label="手机号">
        <SnInput v-model="silent.phone" placeholder="留空后失焦" />
      </SnFormItem>
    </SnForm>
    <text class="sn-demo__meta"
      >showMessage=false 时字段仍会校验并进入错误态，只是不显示消息行（@validate 仍可监听）</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__title {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-semibold);
}
</style>
