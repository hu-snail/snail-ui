<script setup lang="ts">
/** Demo: SnLayout — hasSider + collapsible sider. */
import { ref } from 'vue'
import { SnLayout, SnLayoutSider, SnLayoutHeader, SnLayoutContent, SnMenu, SnText } from '@snui/vue-web'
const collapsed = ref(false)
</script>

<template>
  <SnLayout has-sider bordered style="height: 240px; border-radius: 8px; overflow: hidden;">
    <SnLayoutSider v-model:collapsed="collapsed" show-trigger bordered>
      <SnMenu :options="['Dashboard', 'Projects', 'Settings']" />
    </SnLayoutSider>
    <SnLayout>
      <SnLayoutHeader><SnText strong>Admin console</SnText></SnLayoutHeader>
      <SnLayoutContent>
        <SnText depth="2">Sider is currently {{ collapsed ? 'collapsed' : 'expanded' }} (width 272 ↔ 64, transform shift keeps the DOM).</SnText>
      </SnLayoutContent>
    </SnLayout>
  </SnLayout>
</template>
