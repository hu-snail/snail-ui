<script setup lang="ts">
/**
 * steps-web-basic — SnSteps default horizontal layout. Status is derived
 * from `current`: step 1 finished, step 2 in progress, step 3 waiting.
 */
import { ref } from 'vue'
import { SnSteps, SnStep } from '@snui/vue-web'

const current = ref(2)
</script>

<template>
  <div class="steps-demo">
    <SnSteps v-model:current="current">
      <SnStep title="填写信息" description="基础资料与联系方式" />
      <SnStep title="确认订单" description="核对商品与金额" />
      <SnStep title="提交完成" description="等待系统处理" />
    </SnSteps>
    <p class="steps-demo__state">current：<code>{{ current }}</code></p>
  </div>
</template>

<style scoped>
.steps-demo {
  width: 100%;
}
.steps-demo__state {
  margin: 20px 0 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.steps-demo__state code {
  background: var(--sn-web-color-background-subtle);
  padding: 1px 6px;
  border-radius: 3px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
</style>
