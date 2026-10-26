<script setup lang="ts">
/**
 * tabs-web-disabled — individual panes locked out of interaction.
 */
import { ref } from 'vue';
import { SnTabPane, SnTabs } from '@snui/vue-web';

const active = ref('a');
</script>

<template>
  <div class="tabs-dis">
    <SnTabs v-model:value="active" type="line">
      <SnTabPane name="a" tab="Available">This tab can be selected</SnTabPane>
      <SnTabPane name="b" tab="Disabled" disabled>
        Content unreachable — the tab cannot be selected
      </SnTabPane>
      <SnTabPane name="c" tab="Another available one">This one can be selected too</SnTabPane>
    </SnTabs>

    <p class="tabs-dis__hint">
      Disabled tabs carry <code>aria-disabled="true"</code>, and is excluded from the keyboard tab
      order. Currently selected:<code>{{ active }}</code>
    </p>
  </div>
</template>

<style scoped>
.tabs-dis {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}
.tabs-dis__hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--sn-web-color-text-secondary);
}
</style>
