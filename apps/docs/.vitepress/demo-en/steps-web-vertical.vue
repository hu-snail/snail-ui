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
      <SnStep title="Create app" description="Enter the app name and its group" />
      <SnStep title="Configure capabilities" description="Choose the platform type and capability packages" />
      <SnStep title="Release to production" description="Submit for review once validation passes" />
    </SnSteps>
  </div>
</template>

<style scoped>
.steps-demo {
  width: 100%;
  max-width: 420px;
}
</style>
