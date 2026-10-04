<script setup lang="ts">
/** Demo: sn-form + sn-form-item — validateTrigger / resetOnChange / errorType. */
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue'
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue'
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'
import type { FormRule } from '@snui/uni-src/components/sn-form/sn-form-types'
import { reactive } from 'vue'

const onBlur = reactive({ a: '' })
const onChange = reactive({ a: '' })
const silent = reactive({ a: '' })

const onBlurRules: Record<string, FormRule[]> = {
  a: [{ required: true, message: 'Required on blur' }],
}
const onChangeRules: Record<string, FormRule[]> = {
  a: [{ required: true, message: 'Required on every change' }],
}
const silentRules: Record<string, FormRule[]> = {
  a: [{ required: true, message: 'Silent — errorType=none' }],
}
</script>

<template>
  <view class="sn-form-demo-grid">
    <view>
      <text class="sn-form-demo__title">validateTrigger="blur" (默认)</text>
      <SnForm :model="onBlur" :rules="onBlurRules">
        <SnFormItem prop="a" label="Email">
          <SnInput v-model="onBlur.a" />
        </SnFormItem>
      </SnForm>
      <text class="sn-form-demo__hint">触碰字段后留空失焦 → 错误信息出现</text>
    </view>

    <view>
      <text class="sn-form-demo__title">validateTrigger="change"</text>
      <SnForm :model="onChange" :rules="onChangeRules">
        <SnFormItem prop="a" label="Email">
          <SnInput v-model="onChange.a" />
        </SnFormItem>
      </SnForm>
      <text class="sn-form-demo__hint">输入字符 → 错误信息实时刷新</text>
    </view>

    <view>
      <text class="sn-form-demo__title">errorType="none" (静默)</text>
      <SnForm :model="silent" :rules="silentRules" error-type="none">
        <SnFormItem prop="a" label="Email">
          <SnInput v-model="silent.a" />
        </SnFormItem>
      </SnForm>
      <text class="sn-form-demo__hint">校验运行, 但不显示错误（@validate 监听）</text>
    </view>
  </view>
</template>

<style scoped>
.sn-form-demo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(440rpx, 1fr)); gap: 48rpx; }
.sn-form-demo__title { display: block; margin: 0 0 24rpx; font-size: 26rpx; font-weight: 600; color: var(--vp-c-text-2); }
.sn-form-demo__hint { display: block; margin-top: 24rpx; font-size: 24rpx; color: var(--vp-c-text-2); }
</style>