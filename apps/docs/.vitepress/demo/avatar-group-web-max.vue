<script setup lang="ts">
/**
 * Demo: SnAvatarGroup — `maxOptions.max` caps the visible avatars and collapses
 * the rest into a `+k` summary; `onExpand` reveals every member.
 */
import { computed, ref } from 'vue';
import { SnAvatar, SnAvatarGroup, SnButton } from '@snui/vue-web';

interface Member {
  id: number;
  label: string;
  color: string;
}

/** Solid-token circles with a text thumbnail — no remote images needed. */
const members: Member[] = [
  { id: 1, label: '张', color: 'var(--sn-web-color-action-primary)' },
  { id: 2, label: '李', color: 'var(--sn-web-color-feedback-success)' },
  { id: 3, label: '王', color: 'var(--sn-web-color-feedback-warning)' },
  { id: 4, label: '赵', color: 'var(--sn-web-color-feedback-info)' },
  { id: 5, label: '刘', color: 'var(--sn-web-color-feedback-danger)' },
  { id: 6, label: '陈', color: 'var(--sn-web-color-text-tertiary)' },
  { id: 7, label: '周', color: 'var(--sn-web-color-text-primary)' },
  { id: 8, label: '吴', color: 'var(--sn-web-color-text-secondary)' },
];

const MAX_OPTIONS = 4;
const max = ref(MAX_OPTIONS);
const expandCount = ref(0);

const visibleCount = computed(() => (members.length > max.value ? max.value - 1 : members.length));

const restCount = computed(() =>
  members.length > max.value ? members.length - visibleCount.value : 0,
);

function handleExpand(): void {
  expandCount.value += 1;
  // 真实行为：点击「+N」汇总头像后展开全部成员。
  max.value = members.length;
}

function reset(): void {
  max.value = MAX_OPTIONS;
  expandCount.value = 0;
}
</script>

<template>
  <div class="avatar-max-demo">
    <section class="avatar-max-demo__block">
      <h4>
        maxOptions = {{ max }}（显示 {{ visibleCount }} 个头像<span v-if="restCount > 0">
          + 「+{{ restCount }}」汇总</span
        >）
      </h4>
      <SnAvatarGroup :max-options="{ max, onExpand: handleExpand }">
        <SnAvatar
          v-for="member in members"
          :key="member.id"
          circle
          :color="member.color"
          :fallback-text="member.label"
        />
      </SnAvatarGroup>
    </section>

    <section class="avatar-max-demo__block">
      <h4>仅数字形式（无点击回调，摘要保持静态）</h4>
      <SnAvatarGroup :max-options="3">
        <SnAvatar
          v-for="member in members.slice(0, 6)"
          :key="member.id"
          circle
          :color="member.color"
          :fallback-text="member.label"
        />
      </SnAvatarGroup>
    </section>

    <section class="avatar-max-demo__block">
      <p class="avatar-max-demo__hint">
        onExpand 已触发 {{ expandCount }} 次；
        {{ restCount === 0 ? '当前已展示全部成员。' : '点击汇总头像可展示全部成员。' }}
      </p>
      <SnButton size="small" :disabled="max === MAX_OPTIONS" @click="reset">
        重置为 {{ MAX_OPTIONS }} 个上限
      </SnButton>
    </section>
  </div>
</template>

<style scoped>
.avatar-max-demo {
  display: grid;
  gap: 20px;
  justify-items: start;
}
.avatar-max-demo__block {
  display: grid;
  gap: 10px;
  justify-items: start;
}
.avatar-max-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
.avatar-max-demo__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
