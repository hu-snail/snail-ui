<script setup lang="ts">
/** Demo: sn-textarea — prefix icon (registry name / CSS class) and placeholder styling. */
import { ref } from 'vue'
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue'
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry'
import { Edit } from '@snui/uni-src/components/sn-icon/sn-icon-set'

registerSnIcons({ Edit })

const registry = ref('')
const cssClass = ref('')
const styled = ref('')
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">prefixIcon (resolved through the sn-icon registry)</text>
    <SnTextarea v-model="registry" prefix-icon="Edit" placeholder="Textarea with a leading icon" />

    <text class="sn-demo__title">iconPrefix + cssIcon (raw CSS class, bypasses the registry)</text>
    <SnTextarea
      v-model="cssClass"
      icon-prefix="sn-demo__icon"
      css-icon
      placeholder="The leading icon is a CSS class"
    />

    <text class="sn-demo__title">placeholderStyle + placeholderClass</text>
    <SnTextarea
      v-model="styled"
      placeholder-style="font-style: italic; color: var(--sn-mp-color-feedback-danger);"
      placeholder-class="sn-demo__placeholder"
      placeholder="Italic placeholder + a custom placeholder class"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__icon {
  display: inline-flex;
  width: 32rpx;
  height: 32rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-action-primary);
}

.sn-demo__placeholder {
  font-size: 26rpx;
  color: var(--sn-mp-color-feedback-warning);
}
</style>
