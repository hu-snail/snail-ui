<script setup lang="ts">
/** Demo: SnImage — render-toolbar keeps prev/next and adds custom actions. */
import { h, ref } from 'vue'
import { SnButton, SnIcon, SnImage } from '@snui/vue-web'
import { Clipboard, ExternalLink } from 'lucide-vue-next'

const url = 'https://picsum.photos/id/1060/1200/800'
const copied = ref(false)

function renderToolbar({ nodes }: { nodes: Record<string, unknown> }): unknown {
  return [
    nodes.prev,
    nodes.next,
    h(
      SnButton,
      {
        circle: true,
        type: 'primary',
        size: 'small',
        style: { marginLeft: '8px' },
        onClick: () => window.open(url),
      },
      { icon: () => h(SnIcon, { icon: ExternalLink, size: 14 }) },
    ),
    h(
      SnButton,
      {
        circle: true,
        size: 'small',
        style: { marginLeft: '8px' },
        onClick: async () => {
          try {
            await navigator.clipboard.writeText(url)
            copied.value = true
            window.setTimeout(() => { copied.value = false }, 1500)
          } catch {
            copied.value = false
          }
        },
      },
      { icon: () => h(SnIcon, { icon: Clipboard, size: 14 }) },
    ),
    nodes.close,
  ]
}
</script>

<template>
  <div class="demo-col">
    <SnImage width="120" :src="url" :render-toolbar="renderToolbar" alt="自定义工具栏" />
    <span v-if="copied" class="copied">已复制图片地址</span>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.copied { color: var(--sn-web-color-feedback-success); font-size: 12px; }
</style>
