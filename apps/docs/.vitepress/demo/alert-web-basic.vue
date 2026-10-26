<script setup lang="ts">
/**
 * alert-web-basic — the minimal alert: type + title + body.
 */
import { SnAlert } from '@snui/vue-web';
</script>

<template>
  <div class="alert-basic">
    <SnAlert title="提示">这里是提示内容，默认不显示关闭按钮。</SnAlert>
    <SnAlert type="info" title="信息">系统将在今晚 23:00 进行例行维护。</SnAlert>
    <SnAlert type="success" title="成功">配置已保存并生效。</SnAlert>
    <SnAlert type="warning" title="警告">当前套餐的存储空间已使用 85%。</SnAlert>
    <SnAlert type="error" title="错误">同步失败，请检查网络连接后重试。</SnAlert>
  </div>
</template>

<style scoped>
.alert-basic {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
</style>
