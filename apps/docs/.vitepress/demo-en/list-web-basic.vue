<script setup lang="ts">
/** Demo: SnList — header / items / footer + prefix / suffix 槽位。 */
import { SnList, SnListItem } from '@snui/vue-web';
</script>

<template>
  <div class="list-demo">
    <SnList>
      <template #header>To-do list</template>
      <SnListItem>
        <template #prefix>1</template>
        Finish data-display component tests
        <template #suffix>Today</template>
      </SnListItem>
      <SnListItem>
        <template #prefix>2</template>
        Get Descriptions docs approved
        <template #suffix>Tomorrow</template>
      </SnListItem>
      <SnListItem>
        <template #prefix>3</template>
        Schedule Timeline horizontal mode
        <template #suffix>This week</template>
      </SnListItem>
      <template #footer>3 items in total</template>
    </SnList>
  </div>
</template>

<style scoped>
.list-demo {
  width: 100%;
}
</style>
