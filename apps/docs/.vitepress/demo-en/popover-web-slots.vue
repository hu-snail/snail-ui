<script setup lang="ts">
/**
 * Demo: SnPopover — rich content via the `#header` / `#content` slots.
 *
 * The instance also receives the `header` / `content` props, so opening it
 * shows the precedence rule: a provided slot wins, the prop is only the
 * fallback. The header slot carries an SnIcon + bold title, the content slot
 * a paragraph plus an action row.
 */
import { ref } from 'vue'
import { BookOpen } from 'lucide-vue-next'
import { registerSnIcons, SnButton, SnIcon, SnPopover } from '@snui/vue-web'

registerSnIcons({ BookOpen })

const dismissed = ref(false)
</script>

<template>
  <div class="popover-slots-demo">
    <SnPopover
      trigger="click"
      placement="bottom"
      show-arrow
      :width="260"
      header="props header (overridden by the slot)"
      content="props content (overridden by the slot)"
    >
      <template #header>
        <span class="popover-slots-demo__header">
          <SnIcon :icon="BookOpen" :size="16" />
          Shortcuts and bulk actions
        </span>
      </template>

      <template #content>
        <p class="popover-slots-demo__text">
          Hold Shift to multi-select rows, press Delete to delete them in bulk; every action is written to the audit log.
        </p>
        <div class="popover-slots-demo__actions">
          <SnButton size="tiny" @click="dismissed = true">
            {{ dismissed ? 'Hint dismissed' : "Don't show again" }}
          </SnButton>
          <SnButton size="tiny" type="primary">View help docs</SnButton>
        </div>
      </template>

      <SnButton>Rich slot content</SnButton>
    </SnPopover>

    <p class="popover-slots-demo__hint">
      When both the header / content props and the #header / #content slots are given, the slots render first and the props are only the fallback; a slot can hold icons, paragraphs, buttons — anything.
    </p>
  </div>
</template>

<style scoped>
.popover-slots-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.popover-slots-demo__header {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.popover-slots-demo__text {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--sn-web-color-text-secondary, #4b4f55);
}

.popover-slots-demo__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
}

.popover-slots-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
