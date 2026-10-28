<script setup lang="ts">
/**
 * avatar-web-lazy — avatar lazy loading: SnAvatar `lazy` + IntersectionObserver.
 *
 * Two things on show:
 *   1. Avatars in a long list keep the native `loading="lazy"` attribute by
 *      default; adding `intersection-observer-options` holds the `src` back
 *      until the avatar enters the viewport (the fallback content renders while
 *      the gate is closed, so there is never a broken-image placeholder).
 *   2. Lazy loading inside a scrollable container must point `root` at **that
 *      container**: the default root is the browser viewport, and scrolling
 *      inside a box does not change viewport intersections.
 */
import { computed, ref } from 'vue';
import { SnAvatar } from '@snui/vue-web';

const scrollRoot = ref<HTMLElement | null>(null);

const users = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  avatar: `https://i.pravatar.cc/80?img=${(index % 70) + 1}`,
}));

const options = computed(() => ({ root: scrollRoot.value, rootMargin: '64px' }));
</script>

<template>
  <div ref="scrollRoot" class="avatar-lazy">
    <div v-for="user in users" :key="user.id" class="avatar-lazy__row">
      <SnAvatar
        :src="user.avatar"
        :size="36"
        circle
        lazy
        :intersection-observer-options="options"
      />
      <span class="avatar-lazy__name">{{ user.name }}</span>
      <span class="avatar-lazy__hint">requested once scrolled into view</span>
    </div>
  </div>
</template>

<style scoped>
.avatar-lazy {
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.avatar-lazy__row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.avatar-lazy__row:last-child {
  border-bottom: none;
}

.avatar-lazy__name {
  font-size: 13px;
  color: var(--vp-c-text-1);
}

.avatar-lazy__hint {
  margin-left: auto;
  font-size: 12px;
  color: var(--vp-c-text-3);
}
</style>
