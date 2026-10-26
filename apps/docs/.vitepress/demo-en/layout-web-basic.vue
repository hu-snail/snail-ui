<script setup lang="ts">
/** Demo: SnLayout — basic three-section. */
import { SnLayout, SnLayoutHeader, SnLayoutContent, SnLayoutFooter, SnText } from '@snui/vue-web';
</script>

<template>
  <SnLayout bordered style="height: 240px; border-radius: 8px; overflow: hidden">
    <SnLayoutHeader>
      <SnText strong>App title</SnText>
    </SnLayoutHeader>
    <SnLayoutContent>
      <SnText depth="2">Content area: flex:1, scrollable. This is the main page content.</SnText>
    </SnLayoutContent>
    <SnLayoutFooter>
      <SnText depth="3">© snail-aui</SnText>
    </SnLayoutFooter>
  </SnLayout>
</template>
