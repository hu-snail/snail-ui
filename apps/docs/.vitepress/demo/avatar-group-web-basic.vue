<script setup lang="ts">
/** Demo: SnAvatarGroup — default tightening overlap. */
import { SnAvatar, SnAvatarGroup } from '@snui/vue-web';

const members = ['张', '李', '王', '赵', '刘', '陈'];
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
