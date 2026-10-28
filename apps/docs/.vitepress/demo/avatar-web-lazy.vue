<script setup lang="ts">
/**
 * avatar-web-lazy — 头像懒加载：SnAvatar `lazy` + IntersectionObserver。
 *
 * 演示两点：
 *   1. 长列表里的头像默认就带原生 `loading="lazy"`；再加上
 *      `intersection-observer-options` 后，`src` 会一直按兵不动，直到头像进入
 *      视口才开始请求（未进入视口前渲染 fallback 内容，不会出现破图占位）。
 *   2. 在可滚动容器内懒加载必须把 `root` 指向**该滚动容器**：默认 root 是
 *      浏览器视口，容器内部滚动不会改变视口交叉状态，判定会失效。
 */
import { computed, ref } from 'vue';
import { SnAvatar } from '@snui/vue-web';

const scrollRoot = ref<HTMLElement | null>(null);

const users = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  name: `用户 ${index + 1}`,
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
      <span class="avatar-lazy__hint">滚动进入视口后才请求</span>
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
