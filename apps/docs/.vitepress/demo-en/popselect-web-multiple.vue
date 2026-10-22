<script setup lang="ts">
/**
 * Demo: SnPopselect — multiple selection, scrollable menu, controlled value.
 */
import { ref } from 'vue'
import { SnButton, SnPopselect } from '@snui/vue-web'

const options = [
  'User research',
  'Usability testing',
  'Data analysis',
  'Competitor research',
  'A/B testing',
  'Survey research',
  'Interview notes',
  'Requirement review',
  'Design review',
  'Launch retrospective',
]

const selected = ref<string[]>(['Usability testing', 'Data analysis'])
</script>

<template>
  <div class="popselect-multi-demo">
    <div class="popselect-multi-demo__row">
      <SnPopselect
        v-model:value="selected"
        :options="options"
        multiple
        scrollable
        placement="bottom"
      >
        <SnButton>
          {{ selected.length }} selected (click to edit)
        </SnButton>
      </SnPopselect>
    </div>
    <p class="popselect-multi-demo__state">
      value = [{{ selected.join(', ') || 'empty' }}]
    </p>
    <p class="popselect-multi-demo__hint">
      In multiple mode the menu stays open after selection so you can keep checking / unchecking; scrollable caps the menu height and scrolls on overflow.
    </p>
  </div>
</template>

<style scoped>
.popselect-multi-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popselect-multi-demo__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.popselect-multi-demo__state {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}

.popselect-multi-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
