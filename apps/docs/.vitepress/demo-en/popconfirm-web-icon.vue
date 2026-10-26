<script setup lang="ts">
/**
 * Demo: SnPopconfirm — leading icon variants.
 *
 * Three ways to control the icon area: a custom component through the `icon`
 * prop (keeps the warning-coloured default), full control through the `#icon`
 * slot (own colour and size), or turning the area off with
 * `show-icon="false"` for pure-text confirmations.
 */
import { ref } from 'vue';
import { CircleAlert } from 'lucide-vue-next';
import { registerSnIcons, SnButton, SnIcon, SnPopconfirm } from '@snui/vue-web';

registerSnIcons({ CircleAlert });

const result = ref('');
</script>

<template>
  <div class="popconfirm-icon-demo">
    <div class="popconfirm-icon-demo__row">
      <SnPopconfirm
        :icon="CircleAlert"
        placement="bottom"
        content="This account will lose edit access to the project; members will need to be re-invited."
        positive-text="Confirm removal"
        @positive-click="result = 'Member removed'"
        @negative-click="result = 'Removal cancelled'"
      >
        <SnButton>icon prop (warning color)</SnButton>
      </SnPopconfirm>

      <SnPopconfirm
        placement="bottom"
        content="Deletion is permanent. Continue?"
        positive-text="Delete"
        @positive-click="result = 'Deleted'"
        @negative-click="result = 'Deletion cancelled'"
      >
        <template #icon>
          <SnIcon
            :icon="CircleAlert"
            :size="20"
            color="var(--sn-web-color-feedback-danger, #d03050)"
          />
        </template>
        <SnButton type="error">#icon slot (danger color)</SnButton>
      </SnPopconfirm>

      <SnPopconfirm
        :show-icon="false"
        placement="bottom"
        content="Text alone describes the consequence, leaving the icon area unused — a fit when the copy is already clear enough."
        @positive-click="result = 'Confirmed (no icon)'"
        @negative-click="result = 'Cancelled (no icon)'"
      >
        <SnButton>show-icon=false</SnButton>
      </SnPopconfirm>
    </div>

    <p class="popconfirm-icon-demo__result">Last action: {{ result || '(none yet)' }}</p>
    <p class="popconfirm-icon-demo__hint">
      Without icon the built-in warning icon is used; the icon prop accepts any icon component and
      keeps the warning color. Switch to the #icon slot to customize color or size, or set
      show-icon=false to remove the icon area entirely.
    </p>
  </div>
</template>

<style scoped>
.popconfirm-icon-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.popconfirm-icon-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.popconfirm-icon-demo__result,
.popconfirm-icon-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
