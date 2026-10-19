<script setup lang="ts">
/** Demo: SnList — hoverable 悬浮高亮 + clickable 指针光标。 */
import { ref } from 'vue'
import { SnList, SnListItem } from '@snui/vue-web'

const picked = ref('')
</script>

<template>
  <div class="list-demo">
    <SnList hoverable clickable>
      <SnListItem v-for="n in 3" :key="n" @click="picked = `第 ${n} 项`">
        {{ `可点击的第 ${n} 项` }}
        <template #suffix>{{ picked === `第 ${n} 项` ? '已选中' : '点击试试' }}</template>
      </SnListItem>
    </SnList>
    <p class="list-demo__state">当前点击：<code>{{ picked || '—' }}</code></p>
  </div>
</template>

<style scoped>
.list-demo {
  width: 100%;

}
.list-demo__state {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.list-demo__state code {
  background: var(--sn-web-color-background-subtle);
  padding: 1px 6px;
  border-radius: 3px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
</style>
