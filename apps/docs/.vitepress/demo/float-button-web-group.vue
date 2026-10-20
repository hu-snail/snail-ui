<script setup lang="ts">
/**
 * float-button-web-group — `SnFloatButtonGroup` collapsing three actions
 * behind a single trigger.
 *
 * The group owns the fixed corner for itself and its children (the children
 * render `position: static`), it hands its `shape` down to them, and the open
 * state is exposed through `v-model:open` — the `SnButton` below shows the
 * controlled wiring and also proves the group reacts to an external toggle.
 */
import { ref } from 'vue'
import { FileText, MessageSquare, Share2 } from 'lucide-vue-next'
import { SnButton, SnFloatButton, SnFloatButtonGroup } from '@snui/vue-web'

const open = ref(false)
</script>

<template>
  <div class="float-button-demo">
    <SnButton size="small" @click="open = !open">
      切换按钮组展开（当前{{ open ? '展开' : '收起' }}）
    </SnButton>

    <SnFloatButtonGroup
      v-model:open="open"
      :right="96"
      :bottom="24"
      trigger-tooltip="更多操作"
    >
      <SnFloatButton :icon="FileText" tooltip="文档" />
      <SnFloatButton :icon="MessageSquare" tooltip="反馈" />
      <SnFloatButton :icon="Share2" tooltip="分享" />
    </SnFloatButtonGroup>
  </div>
</template>

<style scoped>
.float-button-demo {
  width: 100%;
  min-height: 80px;
}
</style>