<script setup lang="ts">
/**
 * dialog-web-types — the five semantic types plus the two icon placements.
 *
 * Each type gets its own trigger; the dialog opens as a real modal so the
 * icon / colour delta is judged at panel size rather than in a cramped card.
 */
import { ref } from 'vue';
import { SnButton, SnDialog } from '@snui/vue-web';

const types = ['default', 'info', 'success', 'warning', 'error'] as const;
type DialogType = (typeof types)[number];

const open = ref(false);
const active = ref<DialogType>('info');
const topIcon = ref(false);

function show(type: DialogType, iconTop = false): void {
  active.value = type;
  topIcon.value = iconTop;
  open.value = true;
}
</script>

<template>
  <div class="dlg-types">
    <div class="dlg-types__bar">
      <SnButton v-for="type in types" :key="type" size="small" @click="show(type)">
        {{ type }}
      </SnButton>
      <SnButton size="small" @click="show('success', true)"
        >icon-placement=&quot;top&quot;</SnButton
      >
    </div>

    <DialogStage v-model:show="open">
      <SnDialog
        :type="active"
        :icon-placement="topIcon ? 'top' : 'left'"
        :title="topIcon ? 'Upload complete' : active"
        :content="
          topIcon
            ? 'iconPlacement=&quot;top&quot; lifts the icon above the title and centers it.'
            : 'Each type has its own icon and icon color.'
        "
        :positive-text="topIcon ? 'Got it' : 'OK'"
        :negative-text="topIcon ? undefined : 'Cancel'"
        @positive-click="open = false"
        @negative-click="open = false"
      />
    </DialogStage>
  </div>
</template>

<style scoped>
.dlg-types {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}
.dlg-types__bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
