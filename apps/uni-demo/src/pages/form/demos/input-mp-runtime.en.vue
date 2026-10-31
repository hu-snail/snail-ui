<script setup lang="ts">
/** Demo: sn-input — MP runtime attrs: confirm-type / hold-keyboard / cursor / selection-* / placeholder-style. */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const text = ref('');
const held = ref('');
const preselect = ref('Preselected region example');
const styled = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <text class="sn-input-demo__caption">confirmType (soft-keyboard confirm button)</text>
    <SnInput v-model="text" confirm-type="search" placeholder="search button" />
    <SnInput v-model="text" confirm-type="send" placeholder="send button" />
    <SnInput v-model="text" confirm-type="go" placeholder="go button" />

    <text class="sn-input-demo__caption">holdKeyboard / adjustPosition / alwaysEmbed</text>
    <SnInput v-model="held" hold-keyboard adjust-position placeholder="Keyboard up + auto scroll" />

    <text class="sn-input-demo__caption">cursor + selection-start / selection-end</text>
    <SnInput v-model="preselect" :cursor="5" :selection-start="2" :selection-end="8" />

    <text class="sn-input-demo__caption">placeholderStyle (inline placeholder styling)</text>
    <SnInput
      v-model="styled"
      placeholder-style="color: var(--sn-mp-color-feedback-danger); font-style: italic;"
      placeholder="Italic red placeholder"
    />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-input-demo__caption {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
