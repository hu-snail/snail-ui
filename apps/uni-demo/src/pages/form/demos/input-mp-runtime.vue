<script setup lang="ts">
/** Demo: sn-input — 运行时属性：confirmType / 键盘保留 / cursor / placeholderStyle。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const text = ref('');
const held = ref('');
const preselect = ref('预选区域示例');
const styled = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <text class="sn-input-demo__caption">confirmType（软键盘右下角按钮文案）</text>
    <SnInput v-model="text" confirm-type="search" placeholder="search 按钮" />
    <SnInput v-model="text" confirm-type="send" placeholder="send 按钮" />
    <SnInput v-model="text" confirm-type="go" placeholder="go 按钮" />

    <text class="sn-input-demo__caption">holdKeyboard / adjustPosition / alwaysEmbed</text>
    <SnInput v-model="held" hold-keyboard adjust-position placeholder="失焦保留键盘 + 自动滚动" />

    <text class="sn-input-demo__caption">cursor + selection-start / selection-end（初始光标与选区）</text>
    <SnInput v-model="preselect" :cursor="5" :selection-start="2" :selection-end="8" />

    <text class="sn-input-demo__caption">placeholderStyle（占位符内联样式注入）</text>
    <SnInput
      v-model="styled"
      placeholder-style="color: var(--sn-mp-color-feedback-danger); font-style: italic;"
      placeholder="红色斜体占位符"
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
