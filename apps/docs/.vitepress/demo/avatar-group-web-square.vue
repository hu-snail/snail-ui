<script setup lang="ts">
/**
 * Demo: SnAvatarGroup — 方形组：默认（方形）头像堆叠，`+N` 摘要
 * 保持同形状；`max-options` 收纳超出部分。
 */
import { SnAvatar, SnAvatarGroup } from '@snui/vue-web';

interface Member {
  id: number;
  label: string;
  color: string;
}

/** Solid-token squares with a text thumbnail — no remote images needed. */
const members: Member[] = [
  { id: 1, label: '张', color: 'var(--sn-web-color-action-primary)' },
  { id: 2, label: '李', color: 'var(--sn-web-color-feedback-success)' },
  { id: 3, label: '王', color: 'var(--sn-web-color-feedback-warning)' },
  { id: 4, label: '赵', color: 'var(--sn-web-color-feedback-info)' },
  { id: 5, label: '刘', color: 'var(--sn-web-color-feedback-danger)' },
  { id: 6, label: '陈', color: 'var(--sn-web-color-text-tertiary)' },
];

const roundMembers: Member[] = members.slice(0, 4);
</script>

<template>
  <div class="avatar-square-demo">
    <section class="avatar-square-demo__block">
      <h4>方形组（默认形状，+N 同为方形）</h4>
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
      <h4>圆角组（round，+N 同为圆角）</h4>
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
      <h4>对照：圆形组（circle，+N 同为圆形）</h4>
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
