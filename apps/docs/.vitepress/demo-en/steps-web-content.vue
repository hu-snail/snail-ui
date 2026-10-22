<script setup lang="ts">
/**
 * steps-web-content — the default slot carries rich step bodies.
 *
 * Shows: replacing the `description` prop with arbitrary markup, including
 * a nested list and inline emphasis.
 */
import { ref } from 'vue'
import { SnSteps, SnStep } from '@snui/vue-web'

const current = ref(1)
</script>

<template>
  <div class="steps-content">
    <SnSteps v-model:current="current">
      <SnStep title="Create repository">
        <ul class="steps-content__list">
          <li>Choose the owning organization</li>
          <li>Set visibility</li>
          <li>Add a repository description</li>
        </ul>
      </SnStep>

      <SnStep title="Hook up the pipeline">
        <p class="steps-content__para">
          Add <code>.ci.yml</code>at the repo root; it takes effect after pushing to the default branch.
        </p>
      </SnStep>

      <SnStep title="Release a version">
        <p class="steps-content__para">
          Tagging triggers a build; artifacts attach to the <strong>Release</strong> page.
        </p>
      </SnStep>
    </SnSteps>

    <p class="steps-content__hint">
      The default slot fully takes over the step body; <code>description</code> the prop is no longer rendered.
    </p>
  </div>
</template>

<style scoped>
.steps-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.steps-content__list {
  margin: 4px 0 0;
  padding-left: 18px;
  font-size: 13px;
  line-height: 1.9;
  color: var(--sn-web-color-text-secondary);
}
.steps-content__para {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.8;
  color: var(--sn-web-color-text-secondary);
}
.steps-content__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
