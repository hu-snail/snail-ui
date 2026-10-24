<script setup lang="ts">
/** Demo: sn-form — inline label icon via `iconData` / `iconName` (uni-end). */
import { reactive } from 'vue'
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue'
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue'
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry'
import { Bell, Settings, User } from '@snui/uni-src/components/sn-icon/sn-icon-set'

registerSnIcons({ Settings, Bell, User })

const form = reactive({ username: '', notifications: '', search: '' })

// iconData for the "alert" inline icon.
const AlertIcon = Object.freeze({
  viewBox: '0 0 24 24',
  paths: ['M12 9v4', 'M12 17h.01', 'M10.29 3.86 L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3 L13.71 3.86a2 2 0 0 0-3.42 0z'],
})
</script>

<template>
  <view class="sn-form-demo">
    <SnForm :model="form" label-position="left" label-width="200">
      <SnFormItem prop="username" label="Username" icon-name="User">
        <SnInput v-model="form.username" placeholder="@handle" />
      </SnFormItem>
      <SnFormItem prop="notifications" label="Alerts" :icon-data="Bell">
        <SnInput v-model="form.notifications" type="tel" />
      </SnFormItem>
      <SnFormItem prop="search" label="Settings" icon-name="Settings">
        <SnInput v-model="form.search" placeholder="Search…" />
      </SnFormItem>
      <SnFormItem prop="alert" label="Note" :icon-data="AlertIcon">
        <SnInput model-value="inline icon via iconData" readonly />
      </SnFormItem>
    </SnForm>
  </view>
</template>

<style scoped>
.sn-form-demo { max-width: 600rpx; }
</style>