<script setup lang="ts">
/**
 * Demo: sn-form-item — inline label icons: `iconName` resolves through the
 * sn-icon registry, `iconData` takes frozen SVG data directly, `iconSize`
 * scales one icon at a time.
 */
import { reactive } from 'vue';
import SnForm from '@snui/uni-src/components/sn-form/sn-form.vue';
import SnFormItem from '@snui/uni-src/components/sn-form/sn-form-item.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import { Bell, Settings, User } from '@snui/uni-src/components/sn-icon/sn-icon-set';

registerSnIcons({ Settings, Bell, User });

/** Inline icon data: viewBox + path list, frozen and passed as an object. */
const AlertIcon = Object.freeze({
  viewBox: '0 0 24 24',
  paths: [
    'M12 9v4',
    'M12 17h.01',
    'M10.29 3.86 L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3 L13.71 3.86a2 2 0 0 0-3.42 0z',
  ],
});

const form = reactive({ username: '', phone: '', topic: '', notice: '' });
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnForm :model="form" label-position="left" label-width="200">
      <SnFormItem prop="username" label="Account" icon-name="User">
        <SnInput v-model="form.username" placeholder="Enter a handle, e.g. @aui_dev" clearable />
      </SnFormItem>

      <SnFormItem prop="phone" label="Phone" icon-name="Bell" :icon-size="40">
        <SnInput
          v-model="form.phone"
          type="tel"
          placeholder="Phone number for notifications"
          clearable
        />
      </SnFormItem>

      <SnFormItem prop="topic" label="Topic" icon-name="Settings">
        <SnInput v-model="form.topic" placeholder="Enter a topic name" clearable />
      </SnFormItem>

      <SnFormItem prop="notice" label="Note" :icon-data="AlertIcon">
        <SnInput
          v-model="form.notice"
          placeholder="Icon from inline iconData — add a note"
          clearable
        />
      </SnFormItem>
    </SnForm>

    <text class="sn-demo__meta">
      The first rows resolve icons from the registry by name; the last row passes SVG data inline
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
