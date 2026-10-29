<script setup lang="ts">
/**
 * Demo: SnAvatarGroup — image avatars (`SnAvatar src`), circular stack.
 *
 * Every member carries a remote portrait plus `fallbackText`, so the group
 * still reads correctly when a photo fails to load (offline / blocked).
 */
import { ref } from 'vue';
import { SnAvatar, SnAvatarGroup } from '@snui/vue-web';

interface Member {
  id: number;
  name: string;
  src: string;
}

const members: Member[] = [
  { id: 1, name: 'Zhang', src: 'https://i.pravatar.cc/80?img=12' },
  { id: 2, name: 'Li', src: 'https://i.pravatar.cc/80?img=32' },
  { id: 3, name: 'Wang', src: 'https://i.pravatar.cc/80?img=45' },
  { id: 4, name: 'Zhao', src: 'https://i.pravatar.cc/80?img=5' },
  { id: 5, name: 'Liu', src: 'https://i.pravatar.cc/80?img=68' },
  { id: 6, name: 'Chen', src: 'https://i.pravatar.cc/80?img=24' },
];

const expanded = ref(false);

function handleExpand(): void {
  expanded.value = true;
}
</script>

<template>
  <div class="avatar-image-demo">
    <section class="avatar-image-demo__block">
      <h4>Image avatars · circular stack (tightening)</h4>
      <SnAvatarGroup>
        <SnAvatar
          v-for="member in members"
          :key="member.id"
          circle
          :src="member.src"
          :fallback-text="member.name"
        />
      </SnAvatarGroup>
    </section>

    <section class="avatar-image-demo__block">
      <h4>Image avatars · shrinking stack (shrink)</h4>
      <SnAvatarGroup size-behavior="shrink">
        <SnAvatar
          v-for="member in members"
          :key="member.id"
          circle
          :src="member.src"
          :fallback-text="member.name"
        />
      </SnAvatarGroup>
    </section>

    <section class="avatar-image-demo__block">
      <h4>Image avatars + overflow cap (maxOptions = 4)</h4>
      <SnAvatarGroup :max-options="{ max: 4, onExpand: handleExpand }">
        <SnAvatar
          v-for="member in members"
          :key="member.id"
          circle
          :src="member.src"
          :fallback-text="member.name"
        />
      </SnAvatarGroup>
      <p class="avatar-image-demo__hint">
        {{ expanded ? 'The summary was clicked — all members are shown.' : 'Click the "+N" summary to reveal every member.' }}
      </p>
    </section>
  </div>
</template>

<style scoped>
.avatar-image-demo {
  display: grid;
  gap: 20px;
  justify-items: start;
}
.avatar-image-demo__block {
  display: grid;
  gap: 10px;
  justify-items: start;
}
.avatar-image-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
.avatar-image-demo__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
