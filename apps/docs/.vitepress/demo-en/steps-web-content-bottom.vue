<script setup lang="ts">
/**
 * steps-web-content-bottom — `contentPlacement="bottom"` puts the title
 * (and description) under the indicator row. Common for onboarding /
 * feature-intro flows where each step needs a wider caption.
 */
import { ref } from 'vue';
import { SnSteps, SnStep } from '@snui/vue-web';

const current = ref(1);
</script>

<template>
  <div class="steps-demo">
    <SnSteps v-model:current="current" content-placement="bottom">
      <SnStep
        title="Choose a template"
        description="Pick a starting point from the template library"
      />
      <SnStep title="Configure style" description="Choose style pack and theme" />
      <SnStep title="Connect data" description="Bind data sources and fields" />
      <SnStep title="Generate preview" description="Export a usable project after confirmation" />
    </SnSteps>
  </div>
</template>

<style scoped>
.steps-demo {
  width: 100%;
}
</style>
