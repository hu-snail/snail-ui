<script setup lang="ts">
/** Demo: SnAvatarGroup — default tightening overlap. */
import { SnAvatar, SnAvatarGroup } from '@snui/vue-web';

const members = ['Zhang', 'Li', 'Wang', 'Zhao', 'Liu', 'Chen'];
</script>

<template>
  <div class="avatar-group-demo">
    <SnAvatarGroup>
      <SnAvatar v-for="name in members" :key="name" :fallback-text="name" />
    </SnAvatarGroup>
  </div>
</template>

<style scoped>
.avatar-group-demo {
  display: grid;
  gap: 18px;
}
</style>
