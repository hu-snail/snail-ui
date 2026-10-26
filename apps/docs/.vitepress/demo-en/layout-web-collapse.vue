<script setup lang="ts">
/** Demo: SnLayout — collapse modes. */
import { ref } from 'vue'
import { SnLayout, SnLayoutSider, SnLayoutContent, SnText } from '@snui/vue-web'
const transformCollapsed = ref(false)
const widthCollapsed = ref(false)
</script>

<template>
  <div class="demo-col">
    <SnText depth="2">collapseMode="transform" (keeps the DOM, translates)</SnText>
    <SnLayout has-sider bordered style="height: 120px; border-radius: 8px; overflow: hidden;">
      <SnLayoutSider v-model:collapsed="transformCollapsed" collapse-mode="transform" show-trigger />
      <SnLayoutContent><SnText depth="2">Content area</SnText></SnLayoutContent>
    </SnLayout>
    <SnText depth="2">collapseMode="width" (reflows the layout)</SnText>
    <SnLayout has-sider bordered style="height: 120px; border-radius: 8px; overflow: hidden;">
      <SnLayoutSider v-model:collapsed="widthCollapsed" collapse-mode="width" show-trigger />
      <SnLayoutContent><SnText depth="2">Content area</SnText></SnLayoutContent>
    </SnLayout>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 8px; }
</style>
