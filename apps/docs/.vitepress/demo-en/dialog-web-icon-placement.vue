<script setup lang="ts">
/**
 * dialog-web-icon-placement — iconPlacement left (default) vs top.
 *
 * The dialog opens as a real modal so the icon placement delta is judged at
 * panel size rather than in a cramped card.
 */
import { ref } from 'vue';
import { SnButton, SnDialog } from '@snui/vue-web';

const open = ref(false);
const topIcon = ref(false);

function show(iconTop = false): void {
  topIcon.value = iconTop;
  open.value = true;
}
</script>

<template>
  <div class="dlg-icon-placement">
    <div class="dlg-icon-placement__bar">
      <SnButton size="small" @click="show(false)">icon-placement="left"</SnButton>
      <SnButton size="small" @click="show(true)">icon-placement="top"</SnButton>
    </div>

    <DialogStage v-model:show="open">
      <SnDialog
        type="success"
        :icon-placement="topIcon ? 'top' : 'left'"
        :title="topIcon ? 'Upload complete' : 'Upload complete'"
        :content="
          topIcon
            ? 'iconPlacement=&quot;top&quot; lifts the icon above the title and centers it.'
            : 'By default the icon sits left of the title.'
        "
        positive-text="Got it"
        @positive-click="open = false"
      />
    </DialogStage>
  </div>
</template>

<style scoped>
.dlg-icon-placement {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}
.dlg-icon-placement__bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
