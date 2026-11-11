<script setup lang="ts">
/**
 * MpHome — the overview page's simulator embed.
 *
 * The iframe points at the deployed uni-demo site's home directory (the
 * component index of the real uni runtime, ADR-0005). One browsing context,
 * shared dark-mode mirror, and no demo-code panel (a directory is content,
 * not a copyable example). Theme / locale follow the docs site via the
 * uni-demo-sync protocol (URL initial state + postMessage watch).
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useData } from 'vitepress';
import PhoneFrame from './PhoneFrame.vue';
import { uniDemoPageUrl } from '../utils/uni-demo-base';
import { onUniDemoReady, postUniDemoState, uniDemoStateOf } from '../utils/uni-demo-sync';

const { isDark, lang } = useData();

const frameRef = ref<HTMLIFrameElement | null>(null);

const previewUrl = computed(() =>
  uniDemoPageUrl('pages/index/index', uniDemoStateOf(isDark.value, lang.value)),
);

function syncFrameState(): void {
  postUniDemoState(frameRef, uniDemoStateOf(isDark.value, lang.value));
}

const unlistenReady = onUniDemoReady(syncFrameState);

watch([isDark, lang], syncFrameState);

onBeforeUnmount(() => {
  unlistenReady();
});
</script>

<template>
  <div class="mp-home">
    <ClientOnly>
      <PhoneFrame :height="760">
        <iframe
          ref="frameRef"
          class="mp-home__frame"
          :src="previewUrl"
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

.dark .mp-home__frame {
  background: #17171a;
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
