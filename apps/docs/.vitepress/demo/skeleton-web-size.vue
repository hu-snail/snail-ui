<script setup lang="ts">
/**
 * skeleton-web-size — the three size tiers across the three shapes.
 *
 * Shows: `size` driving the default height while `text` / `circle` /
 * `round` decide the shape, and `animated` turning the shimmer off.
 */
import { ref } from 'vue';
import { SnSkeleton } from '@snui/vue-web';

const animated = ref(true);
</script>

<template>
  <div class="sk-size">
    <label class="sk-size__toggle">
      <input v-model="animated" type="checkbox" />
      animated
    </label>

    <div class="sk-size__row">
      <span class="sk-size__label">small</span>
      <div class="sk-size__shapes">
        <SnSkeleton text size="small" :animated="animated" width="160px" />
        <SnSkeleton circle size="small" :animated="animated" />
        <SnSkeleton round size="small" :animated="animated" width="80px" height="20px" />
      </div>
    </div>

    <div class="sk-size__row">
      <span class="sk-size__label">medium</span>
      <div class="sk-size__shapes">
        <SnSkeleton text size="medium" :animated="animated" width="200px" />
        <SnSkeleton circle size="medium" :animated="animated" />
        <SnSkeleton round size="medium" :animated="animated" width="100px" height="24px" />
      </div>
    </div>

    <div class="sk-size__row">
      <span class="sk-size__label">large</span>
      <div class="sk-size__shapes">
        <SnSkeleton text size="large" :animated="animated" width="240px" />
        <SnSkeleton circle size="large" :animated="animated" />
        <SnSkeleton round size="large" :animated="animated" width="120px" height="28px" />
      </div>
    </div>

    <div class="sk-size__row">
      <span class="sk-size__label">不指定</span>
      <div class="sk-size__shapes">
        <SnSkeleton text :animated="animated" width="180px" />
        <SnSkeleton circle :animated="animated" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.sk-size {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.sk-size__toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.sk-size__row {
  display: flex;
  align-items: center;
  gap: 16px;
}
.sk-size__label {
  flex: none;
  width: 64px;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.sk-size__shapes {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
</style>
