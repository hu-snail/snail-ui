<script setup lang="ts">
/**
 * MpHome — the overview page's simulator embed.
 *
 * The overview is no longer a demo file: it is the preview route's home view
 * (`/preview-mp?home=1`, rendered by MpOverview inside MpPreview). The doc
 * page embeds it through the same iframe every other uni preview uses — one
 * browsing context, the shared dark-mode mirror, and no demo-code panel (a
 * directory is content, not a copyable example).
 */
import { withBase } from 'vitepress'
import PhoneFrame from './PhoneFrame.vue'
</script>

<template>
  <div class="mp-home">
    <ClientOnly>
      <PhoneFrame :height="760">
        <iframe
          class="mp-home__frame"
          :src="withBase('/preview-mp?home=1')"
          title="uni component overview"
          loading="lazy"
        />
      </PhoneFrame>
      <template #fallback>
        <div class="mp-home__loading">Loading overview…</div>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.mp-home {
  display: flex;
  justify-content: center;
  margin: 24px 0;
}

.mp-home__frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background: #f8f8f8;
}

.mp-home__loading {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 200px;
  justify-content: center;
  color: var(--vp-c-text-2);
  font-size: 13px;
}
</style>
