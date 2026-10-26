<script setup lang="ts">
/**
 * steps-web-vertical — SnSteps `vertical` stacks the steps; the connector
 * line runs down the indicator column. Good for side-panel flow notes.
 */
import { ref } from 'vue'
import { SnSteps, SnStep } from '@snui/vue-web'

const current = ref(2)
</script>

<template>
  <div class="steps-demo">
    <SnSteps v-model:current="current" vertical>
      <SnStep title="创建应用" description="填写应用名称与所属分组" />
      <SnStep title="配置能力" description="选择端类型与需要的能力包" />
      <SnStep title="发布上线" description="校验通过后提交审核" />
    </SnSteps>
  </div>
</template>

<style scoped>
.steps-demo {
  width: 100%;
  max-width: 420px;
}
</style>
