<script setup lang="ts">
/** Demo: sn-text (uni-end) — 主题类型 + 粗体 + 装饰线。 */
import SnText from '@snui/uni-src/components/sn-text/sn-text.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnText text="默认文本 default" />
    <SnText text="主要文本 primary" type="primary" />
    <SnText text="成功文本 success" type="success" />
    <SnText text="警告文本 warning" type="warning" />
    <SnText text="错误文本 error" type="error" />
    <SnText text="加粗文本" bold />
    <SnText text="下划线" decoration="underline" />
    <SnText text="删除线" decoration="line-through" />
    <SnText text="上划线" decoration="overline" />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}
</style>
