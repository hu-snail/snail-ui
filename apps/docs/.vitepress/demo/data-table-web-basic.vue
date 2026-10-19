<script setup lang="ts">
/** Demo: SnDataTable — basic columns-driven table with a render action cell. */
import { h, ref } from 'vue'
import { SnDataTable } from '@snui/vue-web'
interface Song {
  no: number
  title: string
  length: string
}

const played = ref('')

const columns = [
  { title: 'No', key: 'no' },
  { title: 'Title', key: 'title' },
  { title: 'Length', key: 'length' },
  {
    title: 'Action',
    key: 'actions',
    render: (row: Record<string, unknown>) =>
      h(
        'button',
        {
          class: 'sn-demo-play',
          onClick: () => {
            played.value = String(row.title)
          },
        },
        'Play',
      ),
  },
]

const data: Song[] = [
  { no: 3, title: 'Wonderwall', length: '4:18' },
  { no: 4, title: "Don't Look Back in Anger", length: '4:48' },
  { no: 12, title: 'Champagne Supernova', length: '7:27' },
]
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo-tip">当前播放：{{ played || '—' }}</p>
    <SnDataTable :columns="columns" :data="data" :bordered="false" />
  </div>
</template>

<style scoped>
.sn-demo-tip { margin: 0 0 24px; color: var(--sn-web-color-text-secondary); font-size: 14px; }
.sn-demo-play {
  padding: 0 10px;
  height: 26px;
  border: 1px solid color-mix(in srgb, var(--sn-web-color-text-primary) 12%, var(--sn-web-color-background-surface));
  border-radius: 3px;
  background: var(--sn-web-color-background-surface);
  color: var(--sn-web-color-action-primary);
  font-size: 12px;
  cursor: pointer;
}
.sn-demo-play:hover { border-color: var(--sn-web-color-action-primary); }
</style>
