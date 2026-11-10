<script setup lang="ts">
/**
 * dialog-web-types — the five semantic types.
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

function show(type: DialogType): void {
  active.value = type;
  open.value = true;
}
</script>

<template>
  <div class="dlg-types">
    <div class="dlg-types__bar">
      <SnButton v-for="type in types" :key="type" size="small" @click="show(type)">
        {{ type }}
      </SnButton>
    </div>

    <DialogStage v-model:show="open">
      <SnDialog
        :type="active"
        :title="active"
        content="每种 type 都有自己的图标与图标配色。"
        positive-text="确定"
        negative-text="取消"
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
