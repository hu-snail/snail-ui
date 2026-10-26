<script setup lang="ts">
/** Demo: SnAvatarGroup — tightening overlap, shrink scaling, and maxOptions overflow. */
import { ref } from 'vue';
import { SnAvatar, SnAvatarGroup } from '@snui/vue-web';

const members = ['张', '李', '王', '赵', '刘', '陈'];

const expandedCount = ref<number | null>(null);

function handleExpand(rest: number): void {
  expandedCount.value = rest;
}
</script>

<template>
  <div class="avatar-group-demo">
    <section class="avatar-group-demo__block">
      <h4>收紧叠放（tightening，默认）</h4>
      <SnAvatarGroup>
        <SnAvatar v-for="name in members" :key="name" :fallback-text="name" />
      </SnAvatarGroup>
    </section>

    <section class="avatar-group-demo__block">
      <h4>逐个缩小（shrink）</h4>
      <SnAvatarGroup size-behavior="shrink">
        <SnAvatar v-for="name in members" :key="name" :fallback-text="name" />
      </SnAvatarGroup>
    </section>

    <section class="avatar-group-demo__block">
      <h4>溢出折叠 + onExpand</h4>
      <SnAvatarGroup :max-options="{ max: 4, onExpand: () => handleExpand(members.length - 3) }">
        <SnAvatar v-for="name in members" :key="name" :fallback-text="name" />
      </SnAvatarGroup>
      <p v-if="expandedCount !== null" class="avatar-group-demo__hint">
        已点击「+{{ expandedCount }}」汇总头像（共 {{ members.length }} 位成员）。
      </p>
    </section>
  </div>
</template>

<style scoped>
.avatar-group-demo {
  display: grid;
  gap: 18px;
}
.avatar-group-demo__block h4 {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary, #888);
}
.avatar-group-demo__hint {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary, #555);
}
</style>
