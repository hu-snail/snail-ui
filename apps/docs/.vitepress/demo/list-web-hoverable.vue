<script setup lang="ts">
/** Demo: SnList — hoverable hover highlight. */
import { SnList, SnListItem } from '@snui/vue-web';
</script>

<template>
  <div class="list-demo">
    <SnList hoverable>
      <SnListItem v-for="n in 3" :key="n">{{ `悬浮高亮第 ${n} 项` }}</SnListItem>
    </SnList>
  </div>
</template>

<style scoped>
.list-demo {
  width: 100%;
}
</style>
