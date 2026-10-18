<script setup lang="ts">
/** Demo: SnAvatar — basic + sizes. */
</script>

<template>
  <div class="demo-row">
    <SnAvatar src="https://i.pravatar.cc/80?img=1" size="small" />
    <SnAvatar src="https://i.pravatar.cc/80?img=2" size="medium" />
    <SnAvatar src="https://i.pravatar.cc/80?img=3" size="large" />
    <SnAvatar src="https://i.pravatar.cc/80?img=4" :size="56" />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
</style>
