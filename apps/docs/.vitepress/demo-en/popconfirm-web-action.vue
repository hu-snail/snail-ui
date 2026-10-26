<script setup lang="ts">
/**
 * Demo: SnPopconfirm — custom action row through the `#action` slot.
 *
 * The slot replaces the two built-in buttons, so the demo owns the closing
 * behaviour: `v-model:show` keeps the bubble controlled and each custom
 * button decides when to collapse it. The row also carries a "don't ask
 * again" checkbox, a common companion of a destructive confirmation.
 */
import { ref } from 'vue';
import { SnButton, SnCheckbox, SnPopconfirm } from '@snui/vue-web';

const show = ref(false);
const dontAskAgain = ref(false);
const log = ref('');

function cancel(): void {
  show.value = false;
  log.value = 'Canceled, the document was not deleted';
}

function confirm(): void {
  show.value = false;
  log.value = dontAskAgain.value ? 'Deleted, and remembered not to show again' : 'Deleted';
}
</script>

<template>
  <div class="popconfirm-action-demo">
    <div class="popconfirm-action-demo__row">
      <SnPopconfirm
        v-model:show="show"
        placement="bottom"
        show-arrow
        content="The document and its version history will be removed from the workspace."
      >
        <template #action>
          <div class="popconfirm-action-demo__action">
            <SnCheckbox v-model="dontAskAgain" size="small" label="Don't show again" />
            <div class="popconfirm-action-demo__buttons">
              <SnButton size="tiny" @click="cancel">Maybe later</SnButton>
              <SnButton size="tiny" type="primary" @click="confirm">Confirm deletion</SnButton>
            </div>
          </div>
        </template>

        <SnButton type="error">Delete document</SnButton>
      </SnPopconfirm>

      <span class="popconfirm-action-demo__state">{{ log || '(no action yet)' }}</span>
    </div>

    <p class="popconfirm-action-demo__hint">
      The #action slot replaces the built-in Cancel / OK button area entirely; the caller decides
      when to close: this example uses v-model:show and the custom buttons collapse the bubble
      themselves; the checkbox value can be submitted to the business in the confirm callback.
    </p>
  </div>
</template>

<style scoped>
.popconfirm-action-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.popconfirm-action-demo__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.popconfirm-action-demo__action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

.popconfirm-action-demo__buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.popconfirm-action-demo__state,
.popconfirm-action-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
