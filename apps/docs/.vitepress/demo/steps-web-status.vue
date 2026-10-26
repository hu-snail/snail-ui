<script setup lang="ts">
/**
 * steps-web-status — shows all four statuses: one group driven by the
 * parent `status="error"`, one group where a single step overrides its
 * own status explicitly.
 */
import { SnSteps, SnStep } from '@snui/vue-web';
</script>

<template>
  <div class="steps-demo">
    <section class="steps-demo__block">
      <p class="steps-demo__label">:current="2" status="error"</p>
      <SnSteps :current="2" status="error">
        <SnStep title="已提交" description="finish" />
        <SnStep title="审核失败" description="error" />
        <SnStep title="重新提交" description="wait" />
      </SnSteps>
    </section>

    <section class="steps-demo__block">
      <p class="steps-demo__label">单步 status 覆盖（第 2 步显式 error）</p>
      <SnSteps :current="1">
        <SnStep title="进行中" description="process" />
        <SnStep title="异常" description="显式 error" status="error" />
        <SnStep title="待办" description="wait" />
      </SnSteps>
    </section>
  </div>
</template>

<style scoped>
.steps-demo {
  width: 100%;
}
.steps-demo__block + .steps-demo__block {
  margin-top: 28px;
}
.steps-demo__label {
  margin: 0 0 10px;
  font-size: 12px;
  color: var(--sn-web-color-text-secondary);
  font-family: ui-monospace, monospace;
}
</style>
