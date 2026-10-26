<script setup lang="ts">
/** Demo: SnLayout — collapse modes. */
import { ref } from 'vue';
import { SnLayout, SnLayoutSider, SnLayoutContent, SnText } from '@snui/vue-web';
const transformCollapsed = ref(false);
const widthCollapsed = ref(false);
</script>

<template>
  <div class="demo-col">
    <SnText depth="2">collapseMode="transform"（保 DOM，平移）</SnText>
    <SnLayout has-sider bordered style="height: 120px; border-radius: 8px; overflow: hidden">
      <SnLayoutSider
        v-model:collapsed="transformCollapsed"
        collapse-mode="transform"
        show-trigger
      />
      <SnLayoutContent><SnText depth="2">内容区</SnText></SnLayoutContent>
    </SnLayout>
    <SnText depth="2">collapseMode="width"（重排布局）</SnText>
    <SnLayout has-sider bordered style="height: 120px; border-radius: 8px; overflow: hidden">
      <SnLayoutSider v-model:collapsed="widthCollapsed" collapse-mode="width" show-trigger />
      <SnLayoutContent><SnText depth="2">内容区</SnText></SnLayoutContent>
    </SnLayout>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
