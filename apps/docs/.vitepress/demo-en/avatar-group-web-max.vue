<script setup lang="ts">
/**
 * Demo: SnAvatarGroup — `maxOptions.max` caps the visible avatars and collapses
 * the rest into a `+k` summary; `onExpand` reveals every member.
 */
import { computed, ref } from 'vue'
import { SnAvatar, SnAvatarGroup, SnButton } from '@snui/vue-web'

interface Member {
  id: number
  label: string
  color: string
}

/** Solid-token circles with a text thumbnail — no remote images needed. */
const members: Member[] = [
  { id: 1, label: 'Zhang', color: 'var(--sn-web-color-action-primary)' },
  { id: 2, label: 'Li', color: 'var(--sn-web-color-feedback-success)' },
  { id: 3, label: 'Wang', color: 'var(--sn-web-color-feedback-warning)' },
  { id: 4, label: 'Zhao', color: 'var(--sn-web-color-feedback-info)' },
  { id: 5, label: 'Liu', color: 'var(--sn-web-color-feedback-danger)' },
  { id: 6, label: 'Chen', color: 'var(--sn-web-color-text-tertiary)' },
  { id: 7, label: 'Zhou', color: 'var(--sn-web-color-text-primary)' },
  { id: 8, label: 'Wu', color: 'var(--sn-web-color-text-secondary)' },
]

const MAX_OPTIONS = 4
const max = ref(MAX_OPTIONS)
const expandCount = ref(0)

const visibleCount = computed(() =>
  members.length > max.value ? max.value - 1 : members.length,
)

const restCount = computed(() =>
  members.length > max.value ? members.length - visibleCount.value : 0,
)

function handleExpand(): void {
  expandCount.value += 1
  // 真实行为：点击「+N」汇总头像后展开全部成员。
  max.value = members.length
}

function reset(): void {
  max.value = MAX_OPTIONS
  expandCount.value = 0
}
</script>

<template>
  <div class="avatar-max-demo">
    <section class="avatar-max-demo__block">
      <h4>
        maxOptions = {{ max }}(showing {{ visibleCount }} avatars<span v-if="restCount > 0"> + "{{ restCount }}" summary</span>）
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
      <h4>Numeric only (no click callback; the summary stays static)</h4>
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
        onExpand fired {{ expandCount }} times;
        {{ restCount === 0 ? 'All members are shown.' : 'Click the summary avatar to show all members.' }}
      </p>
      <SnButton size="small" :disabled="max === MAX_OPTIONS" @click="reset">
        Reset to a cap of {{ MAX_OPTIONS }}
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
