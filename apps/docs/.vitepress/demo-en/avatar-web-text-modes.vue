<script setup lang="ts">
/**
 * Demo: SnAvatar — automatic text truncation modes (additive).
 *
 * Hand the full name to `fallback-text` and let `text-mode` pick the shape:
 *   full as-is / surname only / last-two glyphs / masked (surname + `*`).
 * Truncation is code-point based, so emoji and rare CJK glyphs stay intact.
 */
import { SnAvatar } from '@snui/vue-web';

const names = ['Ann', 'Bob', 'Jay'];
</script>

<template>
  <div class="demo-grid">
    <template v-for="name in names" :key="name">
      <div class="demo-row">
        <span class="demo-label">Full name · {{ name }}</span>        <SnAvatar :fallback-text="name" circle size="large" />
        <SnAvatar
          :fallback-text="name"
          text-mode="surname"
          circle
          size="large"
          color="var(--sn-web-color-action-primary)"
        />
        <SnAvatar
          :fallback-text="name"
          text-mode="last-two"
          circle
          size="large"
          color="var(--sn-web-color-feedback-success)"
        />
        <SnAvatar
          :fallback-text="name"
          text-mode="masked"
          circle
          size="large"
          color="var(--sn-web-color-feedback-warning)"
        />
      </div>
    </template>

    <p class="demo-hint">
      Left to right: full · surname · last-two · masked (surname + `*`; a
      single-glyph name stays readable).
    </p>
  </div>
</template>

<style scoped>
.demo-grid {
  display: grid;
  gap: 14px;
  justify-items: start;
}

.demo-row {
  display: flex;
  gap: 14px;
  align-items: center;
}

.demo-label {
  width: 170px;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}

.demo-hint {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
