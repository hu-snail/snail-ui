<script setup lang="ts">
/** Demo: sn-form + sn-form-item — form-level size / valueAlign / asteriskPosition / hideAsterisk cascade. */
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue'
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue'
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'
import { reactive } from 'vue'

const a = reactive({ a: '', b: '' })
const b = reactive({ a: '', b: '' })
const c = reactive({ a: '', b: '' })
const d = reactive({ a: '', b: '' })
</script>

<template>
  <view class="sn-form-demo-grid">
    <view>
      <text class="sn-form-demo__title">默认</text>
      <SnForm :model="a">
        <SnFormItem prop="a" label="Email" required>
          <SnInput v-model="a.a" />
        </SnFormItem>
        <SnFormItem prop="b" label="Nickname" required>
          <SnInput v-model="a.b" />
        </SnFormItem>
      </SnForm>
    </view>

    <view>
      <text class="sn-form-demo__title">size="small"</text>
      <SnForm :model="b" size="small">
        <SnFormItem prop="a" label="Email" required>
          <SnInput v-model="b.a" />
        </SnFormItem>
        <SnFormItem prop="b" label="Nickname" required>
          <SnInput v-model="b.b" />
        </SnFormItem>
      </SnForm>
    </view>

    <view>
      <text class="sn-form-demo__title">valueAlign="right"</text>
      <SnForm :model="c" value-align="right">
        <SnFormItem prop="a" label="金额" required>
          <SnInput v-model="c.a" align-right />
        </SnFormItem>
        <SnFormItem prop="b" label="数量" required>
          <SnInput v-model="c.b" align-right />
        </SnFormItem>
      </SnForm>
    </view>

    <view>
      <text class="sn-form-demo__title">asteriskPosition="right" + hideAsterisk</text>
      <SnForm :model="d" asterisk-position="right" hide-asterisk>
        <SnFormItem prop="a" label="Email" required>
          <SnInput v-model="d.a" />
        </SnFormItem>
        <SnFormItem prop="b" label="Nickname" required>
          <SnInput v-model="d.b" />
        </SnFormItem>
      </SnForm>
    </view>
  </view>
</template>

<style scoped>
.sn-form-demo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(440rpx, 1fr)); gap: 48rpx; }
.sn-form-demo__title { display: block; margin: 0 0 24rpx; font-size: 26rpx; font-weight: 600; color: var(--vp-c-text-2); }
</style>