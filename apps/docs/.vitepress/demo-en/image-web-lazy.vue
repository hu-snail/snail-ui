<script setup lang="ts">
/** Demo: SnImage — native lazy + IntersectionObserver lazy inside a scroll box. */
import { SnImage } from '@snui/vue-web';

function svgTile(color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="${color}"/><circle cx="60" cy="40" r="18" fill="rgba(255,255,255,0.55)"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const lazyUrls = ['#205072', '#2d6a4f', '#7f5539', '#5a189a', '#9c3848', '#495057'].map(svgTile);
</script>

<template>
  <div class="demo-col">
    <p class="hint">lazy on its own (native loading="lazy"):</p>
    <SnImage lazy width="120" height="80" src="https://picsum.photos/id/1039/400/300" />

    <p class="hint">
      lazy + intersection-observer-options (loads when it enters the viewport inside the scroll
      container):
    </p>
    <div class="scroll-box">
      <SnImage
        v-for="(url, index) in lazyUrls"
        :key="url"
        lazy
        width="120"
        height="80"
        :src="url"
        :intersection-observer-options="{ root: '.scroll-box' }"
        :alt="`Lazy-load placeholder ${index + 1}`"
      >
        <template #placeholder>
          <div class="placeholder">Loading…</div>
        </template>
      </SnImage>
    </div>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 480px;
}
.hint {
  margin: 0;
  color: var(--sn-web-color-text-secondary);
  font-size: 13px;
}
.scroll-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 200px;
  overflow: auto;
  padding: 4px;
  border: 1px solid
    color-mix(in srgb, var(--sn-web-color-text-primary) 12%, var(--sn-web-color-background-surface));
  border-radius: 3px;
}
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 80px;
  color: var(--sn-web-color-text-tertiary);
  background: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 4.5%,
    var(--sn-web-color-background-surface)
  );
  border-radius: 3px;
  font-size: 12px;
}
</style>
