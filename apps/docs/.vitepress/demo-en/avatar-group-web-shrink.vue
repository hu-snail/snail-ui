<script setup lang="ts">
/**
 * Demo: SnAvatarGroup — `sizeBehavior="shrink"` scales each following avatar
 * down, while the default `tightening` overlaps them with a negative margin.
 */
import { SnAvatar, SnAvatarGroup } from '@snui/vue-web'

const members = [
  { id: 1, label: 'Zhang', color: 'var(--sn-web-color-action-primary)' },
  { id: 2, label: 'Li', color: 'var(--sn-web-color-feedback-success)' },
  { id: 3, label: 'Wang', color: 'var(--sn-web-color-feedback-warning)' },
  { id: 4, label: 'Zhao', color: 'var(--sn-web-color-feedback-info)' },
  { id: 5, label: 'Liu', color: 'var(--sn-web-color-feedback-danger)' },
  { id: 6, label: 'Chen', color: 'var(--sn-web-color-text-tertiary)' },
]
</script>

<template>
  <div class="avatar-shrink-demo">
    <section class="avatar-shrink-demo__block">
      <h4>tightening (default: negative-margin overlap, uniform sizes)</h4>
      <SnAvatarGroup>
        <SnAvatar
          v-for="member in members"
          :key="member.id"
          circle
          :color="member.color"
          :fallback-text="member.label"
        />
      </SnAvatarGroup>
    </section>

    <section class="avatar-shrink-demo__block">
      <h4>shrink (shrinks one by one, min scale 0.7)</h4>
      <SnAvatarGroup size-behavior="shrink">
        <SnAvatar
          v-for="member in members"
          :key="member.id"
          circle
          :color="member.color"
          :fallback-text="member.label"
        />
      </SnAvatarGroup>
    </section>

    <section class="avatar-shrink-demo__block">
      <h4>shrink + aggregated avatar size (size = large)</h4>
      <SnAvatarGroup size-behavior="shrink" size="large" :max-options="{ max: 4 }">
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
.avatar-shrink-demo {
  display: grid;
  gap: 20px;
}
.avatar-shrink-demo__block {
  display: grid;
  gap: 10px;
}
.avatar-shrink-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
