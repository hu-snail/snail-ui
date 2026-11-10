<script setup lang="ts">
/** Demo: SnList — hoverable hover highlight. */
import { SnList, SnListItem } from '@snui/vue-web';
</script>

<template>
  <div class="list-demo">
    <SnList hoverable>
      <SnListItem v-for="n in 3" :key="n">{{ `Hover-highlighted item ${n}` }}</SnListItem>
    </SnList>
  </div>
</template>

<style scoped>
.list-demo {
  width: 100%;
}
</style>
