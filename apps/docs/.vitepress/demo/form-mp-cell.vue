<script setup lang="ts">
/** Demo: sn-form + sn-form-item — Cell-style (border / ellipsis / clickable / isLink / placeholder / description). */
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue'
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue'
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'
import { reactive } from 'vue'

const data = reactive({
  email: '',
  nickname: '',
  bio: '',
  addr: '',
  notes: 'Tap the row → click event fires',
})
</script>

<template>
  <view class="sn-form-demo">
    <SnForm :model="data" border>
      <SnFormItem prop="email" label="Email (with description)" description="我们不会发垃圾邮件">
        <SnInput v-model="data.email" />
      </SnFormItem>
      <SnFormItem prop="nickname" label="一个超长的 label 应该 ellipsis 截断" ellipsis>
        <SnInput v-model="data.nickname" placeholder="input" />
      </SnFormItem>
      <SnFormItem prop="bio" label="空 (placeholder 兜底)" placeholder="Not set yet" />
      <SnFormItem prop="addr" label="Clickable row (无 input)" placeholder="Tap me" clickable is-link @click="data.notes = 'clicked'" />
      <SnFormItem prop="notes" label="Last value (只读)" is-link>
        <SnInput v-model="data.notes" readonly />
      </SnFormItem>
    </SnForm>
  </view>
</template>

<style scoped>
.sn-form-demo { max-width: 700rpx; }
</style>