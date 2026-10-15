<script setup lang="ts">
/**
 * dialog-web-slots — every text region replaced by a slot.
 *
 * Shows: `header` / `default` / `icon` / `close` slots working together.
 * Note the `icon` slot is still gated by `showIcon` — toggle it to see the
 * slot lose the render race.
 */
import { computed, ref, h } from 'vue'
import { SnButton, SnDialog, SnIcon } from '@snui/vue-web'
import { CloudUpload, X } from 'lucide-vue-next'

const open = ref(true)
const showIcon = ref(true)

const customIcon = computed(() => h(SnIcon, { icon: CloudUpload, size: 22 }))
</script>

<template>
  <div class="dlg-slots">
    <div class="dlg-slots__bar">
      <SnButton size="small" @click="open = true">重新打开</SnButton>
      <label class="dlg-slots__toggle">
        <input v-model="showIcon" type="checkbox">
        showIcon
      </label>
    </div>

    <div v-if="open" class="dlg-slots__host">
      <SnDialog :show-icon="showIcon" type="info">
        <template #icon>
          <component :is="customIcon" />
        </template>
        <template #header>
          <span class="dlg-slots__title">自定义标题<em>（header 插槽）</em></span>
        </template>
        <template #default>
          <p class="dlg-slots__body">
            正文来自 <code>default</code> 插槽，可以放任意结构 ——
            列表、代码块、甚至一个表单。
          </p>
        </template>
        <template #close>
          <SnIcon :icon="X" size="14" />
        </template>
        <template #action>
          <SnButton size="small" @click="open = false">知道了</SnButton>
        </template>
      </SnDialog>
    </div>
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
.dlg-slots__host {
  width: 100%;
  max-width: 446px;
  padding: 24px;
  border-radius: 8px;
  background: var(--sn-web-color-background-subtle);
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
