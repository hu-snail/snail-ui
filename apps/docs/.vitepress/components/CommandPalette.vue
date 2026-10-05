<script setup lang="ts">
/**
 * CommandPalette — Cmd/Ctrl+K popover for jumping to components + demos.
 *
 * Per AUI-DOCS-019: a docs-site-wide keyboard launcher. Triggered by
 * Cmd+K (mac) / Ctrl+K (other) or by clicking the search icon in the
 * nav (the icon is wired separately in default VitePress theme).
 *
 * Search source: COMPONENT_INDEX (static, hand-maintained) — see
 * data/components-index.ts. We deliberately do not depend on fuse.js /
 * minisearch to keep the bundle small; substring + word + name scoring
 * is good enough for a 12-entry corpus.
 *
 * Why no global hotkey conflict handling? VitePress 1.x already
 * intercepts `/` for the built-in local search; our palette uses
 * Cmd/Ctrl+K which doesn't conflict. ESC closes.
 */

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { Search, X } from 'lucide-vue-next'
import { COMPONENT_INDEX } from '../data/components-index'

interface ScoredEntry {
  name: string
  label: string
  labelEn: string
  end: 'web' | 'uni'
  path: string
  enPath: string
  demos: string[]
  score: number
}

const open = ref(false)
const query = ref('')
const selectedIdx = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

const { lang } = useData()

const isEn = computed(() => lang.value === 'en-US')

const results = computed<ScoredEntry[]>(() => {
  const q = query.value.toLowerCase().trim()
  if (!q) {
    return COMPONENT_INDEX.map((c) => ({
      name: c.name,
      label: c.label,
      labelEn: c.labelEn,
      end: c.end,
      path: c.path,
      enPath: c.enPath,
      demos: c.demos,
      score: 0,
    }))
  }
  return COMPONENT_INDEX
    .map<ScoredEntry>((c) => {
      const haystack = [
        c.name,
        c.label,
        c.labelEn,
        ...(c.demos ?? []),
        ...(c.keywords ?? []),
      ]
        .join(' ')
        .toLowerCase()
      let score = 0
      if (haystack.includes(q)) score += 10
      for (const w of q.split(/\s+/)) {
        if (w && haystack.includes(w)) score += 3
      }
      if (c.name.toLowerCase().includes(q)) score += 20
      if (c.label.toLowerCase().includes(q)) score += 15
      if (c.labelEn.toLowerCase().includes(q)) score += 15
      return {
        name: c.name,
        label: c.label,
        labelEn: c.labelEn,
        end: c.end,
        path: c.path,
        enPath: c.enPath,
        demos: c.demos,
        score,
      }
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
})

watch(query, () => {
  selectedIdx.value = 0
})

watch(open, async (v) => {
  if (v) {
    await nextTick()
    inputRef.value?.focus()
  }
})

function go(entry: ScoredEntry): void {
  open.value = false
  const target = isEn.value ? entry.enPath : entry.path
  window.location.href = target
}

function onGlobalKeydown(e: KeyboardEvent): void {
  // Cmd+K (mac) or Ctrl+K (others)
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    open.value = !open.value
    if (open.value) {
      query.value = ''
      selectedIdx.value = 0
    }
    return
  }
  if (e.key === 'Escape' && open.value) {
    e.preventDefault()
    open.value = false
  }
}

function onInputKeydown(e: KeyboardEvent): void {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIdx.value = Math.min(selectedIdx.value + 1, results.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIdx.value = Math.max(0, selectedIdx.value - 1)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const r = results.value[selectedIdx.value]
    if (r) go(r)
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="sn-cmdk" role="dialog" aria-label="搜索组件">
      <div class="sn-cmdk__backdrop" @click="open = false" />
      <div class="sn-cmdk__panel">
        <div class="sn-cmdk__input-row">
          <Search :size="16" class="sn-cmdk__input-icon" />
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            class="sn-cmdk__input"
            :placeholder="isEn ? 'Search components & demos…' : '搜索组件 / demo…'"
            autocomplete="off"
            spellcheck="false"
            @keydown="onInputKeydown"
          />
          <kbd class="sn-cmdk__esc">ESC</kbd>
        </div>

        <div v-if="results.length === 0" class="sn-cmdk__empty">
          {{ isEn ? 'No matches.' : '没有匹配项。' }}
        </div>

        <ul v-else class="sn-cmdk__list">
          <li
            v-for="(r, i) in results"
            :key="r.path"
            class="sn-cmdk__item"
            :class="{ 'is-active': i === selectedIdx }"
            @mouseenter="selectedIdx = i"
            @click="go(r)"
          >
            <div class="sn-cmdk__item-main">
              <span class="sn-cmdk__item-name">{{ r.name }}</span>
              <span class="sn-cmdk__item-label">{{ isEn ? r.labelEn : r.label }}</span>
              <span class="sn-cmdk__item-end" :data-end="r.end">{{ r.end }}</span>
            </div>
            <div class="sn-cmdk__item-meta">
              <span>{{ r.demos.length }} demos</span>
            </div>
          </li>
        </ul>

        <div class="sn-cmdk__footer">
          <span class="sn-cmdk__hint">
            <kbd>↑</kbd><kbd>↓</kbd> {{ isEn ? 'navigate' : '选择' }}
          </span>
          <span class="sn-cmdk__hint">
            <kbd>↵</kbd> {{ isEn ? 'open' : '打开' }}
          </span>
          <span class="sn-cmdk__hint">
            <kbd>⌘</kbd><kbd>K</kbd> {{ isEn ? 'toggle' : '切换' }}
          </span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.sn-cmdk {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
  font-family: var(--vp-font-family-base, -apple-system, BlinkMacSystemFont, sans-serif);
}

.sn-cmdk__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
}

.sn-cmdk__panel {
  position: relative;
  width: min(560px, calc(100vw - 32px));
  background: var(--vp-c-bg-elv, #ffffff);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 70vh;
}

.sn-cmdk__input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.sn-cmdk__input-icon {
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}
.sn-cmdk__input {
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: inherit;
  font-size: 14px;
  font-family: inherit;
}
.sn-cmdk__esc {
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  padding: 2px 6px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.sn-cmdk__empty {
  padding: 24px;
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.sn-cmdk__list {
  list-style: none;
  margin: 0;
  padding: 6px;
  overflow-y: auto;
  flex: 1;
}
.sn-cmdk__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.1s;
}
.sn-cmdk__item.is-active {
  background: var(--vp-c-bg-soft);
}
.sn-cmdk__item-main {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.sn-cmdk__item-name {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: 4px;
}
.sn-cmdk__item-label {
  font-size: 13px;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}
.sn-cmdk__item-end {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 6px;
  border-radius: 4px;
  color: #fff;
}
.sn-cmdk__item-end[data-end="web"] {
  background: #3b82f6;
}
.sn-cmdk__item-end[data-end="uni"] {
  background: #22c55e;
}
.sn-cmdk__item-meta {
  font-size: 11px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.sn-cmdk__footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
.sn-cmdk__hint {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--vp-c-text-2);
}
.sn-cmdk__hint kbd {
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  padding: 1px 5px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 3px;
  background: var(--vp-c-bg-elv, #fff);
  color: var(--vp-c-text-2);
}
</style>
