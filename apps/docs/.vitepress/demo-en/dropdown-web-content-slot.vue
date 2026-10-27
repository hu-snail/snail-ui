<script setup lang="ts">
/** Demo: SnDropdown — #content slot takes over the panel body. */
import { SnDropdown } from '@snui/vue-web';
import { Copy, Download, Info, Share2, Trash2 } from 'lucide-vue-next';
import { ref } from 'vue';
const lastAction = ref('');

const rows = [
  { key: 'share', label: 'Share', icon: Share2 },
  { key: 'copy', label: 'Copy link', icon: Copy },
  { key: 'download', label: 'Download', icon: Download },
];
</script>

<template>
  <div>
    <p style="margin: 0 0 12px; font-size: 13px; color: var(--sn-web-color-text-secondary, #666)">
      Right-click the card: the panel body is fully owned by the #content slot (receives close()).
    </p>
    <SnDropdown trigger="contextMenu">
      <div
        style="
          padding: 16px;
          border: 1px solid var(--sn-web-color-border-subtle, #ddd);
          border-radius: 6px;
          width: 240px;
          user-select: none;
        "
      >
        design-v3.fig
        <div style="font-size: 12px; color: var(--sn-web-color-text-tertiary, #999)">
          Right-click me
        </div>
      </div>
      <template #content="{ close }">
        <div style="min-width: 180px">
          <div
            v-for="row in rows"
            :key="row.key"
            role="menuitem"
            class="slot-row"
            @click="((lastAction = row.label), close())"
          >
            <component
              :is="row.icon"
              :size="15"
              style="color: var(--sn-web-color-text-secondary, #666)"
            />
            {{ row.label }}
          </div>
          <div class="slot-divider" role="separator" />
          <div
            role="menuitem"
            class="slot-row slot-row--danger"
            @click="((lastAction = 'Delete'), close())"
          >
            <Trash2 :size="15" />
            Delete
          </div>
          <div class="slot-footer">
            <Info :size="12" />
            Custom footer · v-model:show also works
          </div>
        </div>
      </template>
    </SnDropdown>
    <p v-if="lastAction" style="margin: 12px 0 0; font-size: 13px">Last action: {{ lastAction }}</p>
  </div>
</template>

<style scoped>
.slot-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 34px;
  cursor: pointer;
  user-select: none;
}
.slot-row:hover {
  background: var(--sn-web-color-background-subtle, #f3f3f5);
}
.slot-row--danger {
  color: var(--sn-web-color-danger, #d03050);
}
.slot-divider {
  height: 1px;
  margin: 5px 0;
  background: var(--sn-web-color-border-subtle, #e5e5e5);
}
.slot-footer {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #999);
  border-top: 1px solid var(--sn-web-color-border-subtle, #e5e5e5);
}
</style>
