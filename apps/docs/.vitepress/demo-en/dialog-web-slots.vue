<script setup lang="ts">
/**
 * dialog-web-slots — every text region replaced by a slot.
 *
 * Shows: `header` / `default` / `icon` / `close` slots working together.
 * Note the `icon` slot is still gated by `showIcon` — toggle it to see the
 * slot lose the render race.
 */
import { computed, ref, h } from 'vue';
import { SnButton, SnDialog, SnIcon } from '@snui/vue-web';
import { CloudUpload, X } from 'lucide-vue-next';

// Closed on load — a dialog must not appear before the reader asks for it.
const open = ref(false);
const showIcon = ref(true);

const customIcon = computed(() => h(SnIcon, { icon: CloudUpload, size: 22 }));
</script>

<template>
  <div class="dlg-slots">
    <div class="dlg-slots__bar">
      <SnButton type="primary" size="small" @click="open = true">Open dialog</SnButton>
      <label class="dlg-slots__toggle">
        <input v-model="showIcon" type="checkbox" />
        showIcon
      </label>
    </div>

    <DialogStage v-model:show="open">
      <SnDialog :show-icon="showIcon" type="info" closable>
        <template #icon>
          <component :is="customIcon" />
        </template>
        <template #header>
          <span class="dlg-slots__title">Custom title<em>(header slot)</em></span>
        </template>
        <template #default>
          <p class="dlg-slots__body">
            The body comes from <code>default</code> slot — it can hold any structure: lists, code
            blocks, even a form.
          </p>
        </template>
        <template #close>
          <SnIcon :icon="X" size="14" />
        </template>
        <template #action>
          <SnButton size="small" @click="open = false">Got it</SnButton>
        </template>
      </SnDialog>
    </DialogStage>
  </div>
</template>

<style scoped>
.dlg-slots {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}
.dlg-slots__bar {
  display: flex;
  align-items: center;
  gap: 12px;
}
.dlg-slots__toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.dlg-slots__title {
  font-weight: 600;
}
.dlg-slots__title em {
  margin-left: 6px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  color: var(--sn-web-color-text-tertiary);
}
.dlg-slots__body {
  margin: 0;
  line-height: 1.7;
}
</style>
