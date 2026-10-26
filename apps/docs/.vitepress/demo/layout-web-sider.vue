<script setup lang="ts">
/** Demo: SnLayout — hasSider + collapsible sider. */
import { ref } from 'vue';
import {
  SnLayout,
  SnLayoutSider,
  SnLayoutHeader,
  SnLayoutContent,
  SnMenu,
  SnText,
} from '@snui/vue-web';
const collapsed = ref(false);
</script>

<template>
  <SnLayout has-sider bordered style="height: 240px; border-radius: 8px; overflow: hidden">
    <SnLayoutSider v-model:collapsed="collapsed" show-trigger bordered>
      <SnMenu :options="['仪表盘', '项目', '设置']" />
    </SnLayoutSider>
    <SnLayout>
      <SnLayoutHeader><SnText strong>管理后台</SnText></SnLayoutHeader>
      <SnLayoutContent>
        <SnText depth="2"
          >sider 当前{{ collapsed ? '已折叠' : '展开' }}（width 272 ↔ 64，transform 平移保
          DOM）。</SnText
        >
      </SnLayoutContent>
    </SnLayout>
  </SnLayout>
</template>
