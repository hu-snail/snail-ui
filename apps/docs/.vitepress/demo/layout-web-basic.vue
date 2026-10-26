<script setup lang="ts">
/** Demo: SnLayout — basic three-section. */
import { SnLayout, SnLayoutHeader, SnLayoutContent, SnLayoutFooter, SnText } from '@snui/vue-web'
</script>

<template>
  <SnLayout bordered style="height: 240px; border-radius: 8px; overflow: hidden;">
    <SnLayoutHeader>
      <SnText strong>应用标题</SnText>
    </SnLayoutHeader>
    <SnLayoutContent>
      <SnText depth="2">Content 区：flex:1 可滚动。这里是页面主体内容。</SnText>
    </SnLayoutContent>
    <SnLayoutFooter>
      <SnText depth="3">© snail-aui</SnText>
    </SnLayoutFooter>
  </SnLayout>
</template>
