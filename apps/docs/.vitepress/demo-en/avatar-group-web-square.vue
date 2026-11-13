<script setup lang="ts">
/**
 * Demo: SnAvatarGroup — square stacks: default (square) avatars with a `+N`
 * summary keeping the same shape; `max-options` collapses the overflow.
 */
import { SnAvatar, SnAvatarGroup } from '@snui/vue-web';

interface Member {
  id: number;
  label: string;
  color: string;
}

/** Solid-token squares with a text thumbnail — no remote images needed. */
const members: Member[] = [
  { id: 1, label: 'Zhang', color: 'var(--sn-web-color-action-primary)' },
  { id: 2, label: 'Li', color: 'var(--sn-web-color-feedback-success)' },
  { id: 3, label: 'Wang', color: 'var(--sn-web-color-feedback-warning)' },
  { id: 4, label: 'Zhao', color: 'var(--sn-web-color-feedback-info)' },
  { id: 5, label: 'Liu', color: 'var(--sn-web-color-feedback-danger)' },
  { id: 6, label: 'Chen', color: 'var(--sn-web-color-text-tertiary)' },
];

const roundMembers: Member[] = members.slice(0, 4);
</script>

<template>
  <div class="avatar-square-demo">
    <section class="avatar-square-demo__block">
      <h4>Square stack (default shape — "+N" stays square)</h4>
      <SnAvatarGroup :max-options="4">
        <SnAvatar
          v-for="member in members"
          :key="member.id"
          :color="member.color"
          :fallback-text="member.label"
        />
      </SnAvatarGroup>
    </section>

    <section class="avatar-square-demo__block">
      <h4>Pill stack (round — "+N" stays pill-shaped)</h4>
      <SnAvatarGroup :max-options="3" round>
        <SnAvatar
          v-for="member in roundMembers"
          :key="member.id"
          round
          :color="member.color"
          :fallback-text="member.label"
        />
      </SnAvatarGroup>
    </section>

    <section class="avatar-square-demo__block">
      <h4>For comparison: circular stack (circle — "+N" stays circular)</h4>
      <SnAvatarGroup :max-options="4" circle>
        <SnAvatar
          v-for="member in members"
          :key="member.id"
          circle
          :color="member.color"
          :fallback-text="member.label"
        />
      </SnAvatarGroup>
    </section>
  </div>
</template>

<style scoped>
.avatar-square-demo {
  display: grid;
  gap: 20px;
  justify-items: start;
}

.avatar-square-demo__block {
  display: grid;
  gap: 10px;
  justify-items: start;
}

.avatar-square-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
