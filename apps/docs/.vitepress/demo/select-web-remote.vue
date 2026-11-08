<script setup lang="ts">
/** Demo: SnSelect — remote search against a mocked API (debounce + abort). */
import { onBeforeUnmount, ref } from 'vue';
import { SnSelect } from '@snui/vue-web';

interface CityOption {
  label: string;
  value: string;
}

const ALL_CITIES: CityOption[] = [
  '北京',
  '上海',
  '广州',
  '深圳',
  '杭州',
  '成都',
  '武汉',
  '西安',
  '南京',
  '苏州',
  '重庆',
  '天津',
  '长沙',
  '青岛',
  '厦门',
  '昆明',
  '合肥',
  '郑州',
  '宁波',
  '无锡',
].map((city) => ({ label: city, value: city }));

/**
 * Mock backend: 450ms latency + substring match, capped at 8 rows.
 * Swap this for a real `fetch` / axios call — the component only cares that
 * `options` is replaced when the response lands.
 */
function mockSearchCities(pattern: string, signal: AbortSignal): Promise<CityOption[]> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const hit = ALL_CITIES.filter((city) => city.label.includes(pattern)).slice(0, 8);
      resolve(hit);
    }, 450);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('aborted', 'AbortError'));
      },
      { once: true },
    );
  });
}

const value = ref<string | null>(null);
const options = ref<CityOption[]>([]);
const loading = ref(false);
const searched = ref('');

/** In-flight request; aborting it drops the stale response (AGENTS.md §40). */
let inflight: AbortController | null = null;

async function onSearch(pattern: string) {
  searched.value = pattern;
  inflight?.abort();
  const controller = new AbortController();
  inflight = controller;
  loading.value = true;
  try {
    options.value = await mockSearchCities(pattern, controller.signal);
  } catch (error) {
    if ((error as DOMException).name === 'AbortError') return;
    options.value = [];
  } finally {
    if (inflight === controller) {
      inflight = null;
      loading.value = false;
    }
  }
}

onBeforeUnmount(() => {
  inflight?.abort();
  inflight = null;
});
</script>

<template>
  <div class="demo-col">
    <SnSelect
      v-model="value"
      filterable
      remote
      clearable
      :loading="loading"
      :options="options"
      placeholder="输入城市名远程搜索"
      style="width: 260px"
      @search="onSearch"
    />
    <p class="demo-log">query: {{ searched || '—' }} · value: {{ value ?? '—' }}</p>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.demo-log {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
