<script setup lang="ts">
/**
 * Demo: SnAvatarGroup — `sizeBehavior="shrink"` scales each following avatar
 * down, while the default `tightening` overlaps them with a negative margin.
 */
import { SnAvatar, SnAvatarGroup } from '@snui/vue-web'

const members = [
  { id: 1, label: '张', color: 'var(--sn-web-color-action-primary)' },
  { id: 2, label: '李', color: 'var(--sn-web-color-feedback-success)' },
  { id: 3, label: '王', color: 'var(--sn-web-color-feedback-warning)' },
  { id: 4, label: '赵', color: 'var(--sn-web-color-feedback-info)' },
  { id: 5, label: '刘', color: 'var(--sn-web-color-feedback-danger)' },
  { id: 6, label: '陈', color: 'var(--sn-web-color-text-tertiary)' },
]
</script>

<template>
  <div class="avatar-shrink-demo">
    <section class="avatar-shrink-demo__block">
      <h4>tightening（默认：负 margin 重叠，尺寸一致）</h4>
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
      <h4>shrink（逐个缩小，最小缩放 0.7）</h4>
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
      <h4>shrink + 汇总头像尺寸（size = large）</h4>
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
