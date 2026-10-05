<script setup lang="ts">
/**
 * DemoLabFab — global Floating Action Button (FAB) for component pages.
 *
 * Per AUI-PRD-v3.1 §7.3 + AUI-DOCS-018:
 *   - Fixed bottom-right FAB; only renders on `/components/**` routes
 *   - Click → expandable popover with 3 tabs:
 *       Style   Style Pack switcher (injects CSS variables + skin class)
 *       Theme   Token editor (color pickers + text inputs) + copyable snippet
 *       Preview Live demo render inside the FAB
 *   - Pack-aware visual: the FAB's own chrome morphs to match the
 *     currently active Style Pack — Default / iOS / Doodle / Dark each
 *     get a distinct look (border-radius, shadow, trigger color).
 *
 * Why a single FAB (instead of multiple separate widgets)?
 *   - Three functions all serve "live demo debugging" — one anchor
 *   - Switch pages → FAB is always in the same spot
 *   - Theme Editor is FAB-unique (not exposed in StyleSwitcher / ThemeCopier)
 */

import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import { Beaker, Palette, Code2, X, Check, RotateCcw } from 'lucide-vue-next'
import { allPacks, getPack } from '@snui/style-packs'
import { snCssVars } from '@snui/tokens'

type Tab = 'style' | 'theme' | 'preview'

interface TokenDef {
  /** CSS variable name. */
  name: string
  /** Human-readable label shown in the editor. */
  label: string
  /** Input kind: 'color' (color picker) or 'text' (free-form CSS value). */
  type: 'color' | 'text'
  /** Group header inside the editor. */
  group: 'color' | 'shape'
}

const route = useRoute()
const open = ref(false)
const tab = ref<Tab>('style')
const activePack = ref<string>('default')

const showFab = computed(() => route.path.startsWith('/components/'))

// ─── Style Pack list ──────────────────────────────────────────────────────
const PACKS = allPacks.map((p) => ({
  name: p.name,
  label: p.label,
  description: p.description ?? '',
}))

// ─── Theme: token editor + copyable snippet ──────────────────────────────
const THEMABLE_TOKENS: TokenDef[] = [
  { name: '--sn-color-action-primary', label: '主色', type: 'color', group: 'color' },
  { name: '--sn-color-background-surface', label: '纸色', type: 'color', group: 'color' },
  { name: '--sn-color-text-primary', label: '文字色', type: 'color', group: 'color' },
  { name: '--sn-color-feedback-success', label: '成功色', type: 'color', group: 'color' },
  { name: '--sn-color-feedback-warning', label: '警告色', type: 'color', group: 'color' },
  { name: '--sn-color-feedback-danger', label: '危险色', type: 'color', group: 'color' },
  { name: '--sn-button-radius', label: '按钮圆角', type: 'text', group: 'shape' },
  { name: '--sn-button-shadow', label: '按钮阴影', type: 'text', group: 'shape' },
  { name: '--sn-input-radius', label: '输入框圆角', type: 'text', group: 'shape' },
]

/**
 * User override map: token name → user-supplied CSS value.
 * Survives style-pack switches (cleared explicitly via resetOverrides
 * or when switching packs the user can still see their changes
 * layered on top).
 */
const userOverrides = ref<Record<string, string>>({})

/**
 * Read the current resolved CSS variable from `:root` (or `:host`).
 * Returns '' if the variable is not defined yet (e.g. before the pack
 * CSS was injected).
 */
function readCurrentToken(name: string): string {
  if (typeof window === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/**
 * Display value: prefer user override, fall back to current resolved value.
 */
function displayValue(name: string): string {
  return userOverrides.value[name] ?? readCurrentToken(name)
}

/**
 * Apply a user override on a token. Re-injects the merged CSS into
 * `<style id="snui-docs-pack">`. Other tokens (and the pack's own
 * non-overridden vars) stay intact.
 */
function setToken(name: string, value: string): void {
  userOverrides.value = { ...userOverrides.value, [name]: value }
  refreshStyle()
}

function resetOverrides(): void {
  userOverrides.value = {}
  refreshStyle()
}

// ─── Style injection (pack CSS + user overrides) ─────────────────────────
let styleEl: HTMLStyleElement | null = null

function ensureStyleEl(): HTMLStyleElement {
  let el = document.getElementById('snui-docs-pack') as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = 'snui-docs-pack'
    document.head.appendChild(el)
  }
  styleEl = el
  return el
}

function refreshStyle(): void {
  const pack = getPack(activePack.value)
  if (!pack) return
  const el = ensureStyleEl()
  let css = snCssVars({
    theme: pack.theme,
    style: pack.style,
    density: pack.density,
  })
  const overrideEntries = Object.entries(userOverrides.value)
  if (overrideEntries.length) {
    const overrideLines = overrideEntries
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n')
    css += `\n:root {\n${overrideLines}\n}\n`
  }
  el.textContent = css
}

function applyPack(name: string): void {
  activePack.value = name
  const pack = getPack(name)
  if (!pack) return
  refreshStyle()
  // Skin class: component packages ship `.snui-skin-{name}` overrides
  // (see @snui/vue-web/src/button/SnButton.vue Doodle skin block, etc.).
  // Toggling here is what makes components visually re-theme live.
  document.body.classList.forEach((c) => {
    if (c.startsWith('snui-skin-')) document.body.classList.remove(c)
  })
  if (name !== 'default') document.body.classList.add(`snui-skin-${name}`)
}

// ─── Copyable snippet for the active pack ────────────────────────────────
const snippet = ref('')
const copied = ref(false)
function buildSnippet(name: string): string {
  const pack = getPack(name) ?? allPacks[0]
  if (!pack) return ''
  const header = `import { snCssVars } from '@snui/tokens'\nimport { ${name}Pack } from '@snui/style-packs/${name}'\n`
  const callParts: string[] = []
  if (pack.theme) callParts.push('theme: ' + name + 'Pack.theme')
  if (pack.style) callParts.push('style: ' + name + 'Pack.style')
  if (pack.density) callParts.push('density: ' + name + 'Pack.density')
  const call = 'snCssVars({\n  ' + callParts.join(',\n  ') + ',\n})'
  return `${header}
const el = document.createElement('style')
el.textContent = ${call}
document.head.appendChild(el)
`
}
watch(activePack, () => {
  snippet.value = buildSnippet(activePack.value)
  copied.value = false
  // Refresh display values so the editor reflects the new pack's defaults.
  // (Don't clobber userOverrides — those stay applied on top.)
}, { immediate: true })

async function copySnippet(): Promise<void> {
  try {
    await navigator.clipboard.writeText(snippet.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1400)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = snippet.value
    document.body.appendChild(ta)
    ta.select()
    try { document.execCommand('copy') } finally { document.body.removeChild(ta) }
    copied.value = true
    setTimeout(() => { copied.value = false }, 1400)
  }
}

// ─── Demo preview ─────────────────────────────────────────────────────────
interface DemoMap {
  [k: string]: () => Promise<unknown>
}
const demoMap = import.meta.glob<unknown>('../demo/*.vue') as DemoMap
const allDemos = computed<string[]>(() => {
  return Object.keys(demoMap)
    .map((k) => {
      const m = k.match(/\/([^/]+)\.vue$/)
      return m ? m[1] : ''
    })
    .filter(Boolean)
    .sort()
})

const previewName = ref<string>('')
watch(allDemos, (list) => {
  if (!previewName.value && list.length) previewName.value = list[0] || ''
}, { immediate: true })
const previewKey = computed(() => previewName.value)

watch(() => route.path, () => {
  open.value = false
})

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') open.value = false
  })
})

const tokenGroups = computed(() => {
  const groups: Record<string, TokenDef[]> = { color: [], shape: [] }
  for (const t of THEMABLE_TOKENS) groups[t.group].push(t)
  return groups
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="showFab"
      class="sn-lab-fab"
      :data-pack="activePack"
      :class="{ 'is-open': open }"
    >
      <div v-if="open" class="sn-lab-fab__panel" role="dialog" aria-label="Demo Lab">
        <div class="sn-lab-fab__header">
          <span class="sn-lab-fab__title">
            <Beaker :size="14" />
            Demo Lab
          </span>
          <button
            type="button"
            class="sn-lab-fab__close"
            aria-label="关闭"
            @click="open = false"
          >
            <X :size="14" />
          </button>
        </div>

        <div class="sn-lab-fab__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            :aria-selected="tab === 'style'"
            class="sn-lab-fab__tab"
            :class="{ 'is-active': tab === 'style' }"
            @click="tab = 'style'"
          >
            <Palette :size="14" />
            风格
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="tab === 'theme'"
            class="sn-lab-fab__tab"
            :class="{ 'is-active': tab === 'theme' }"
            @click="tab = 'theme'"
          >
            <Code2 :size="14" />
            主题
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="tab === 'preview'"
            class="sn-lab-fab__tab"
            :class="{ 'is-active': tab === 'preview' }"
            @click="tab = 'preview'"
          >
            <Beaker :size="14" />
            预览
          </button>
        </div>

        <div class="sn-lab-fab__body">
          <!-- Style tab -->
          <div v-show="tab === 'style'" class="sn-lab-fab__section">
            <button
              v-for="p in PACKS"
              :key="p.name"
              type="button"
              class="sn-lab-fab__pack"
              :class="{ 'is-active': activePack === p.name }"
              @click="applyPack(p.name)"
            >
              <span class="sn-lab-fab__pack-label">{{ p.label }}</span>
              <span class="sn-lab-fab__pack-desc">{{ p.description }}</span>
            </button>
          </div>

          <!-- Theme tab: token editor + copyable snippet -->
          <div v-show="tab === 'theme'" class="sn-lab-fab__section">
            <div class="sn-lab-fab__theme-head">
              <span class="sn-lab-fab__theme-name">{{ activePack }}</span>
              <div class="sn-lab-fab__theme-actions">
                <button
                  type="button"
                  class="sn-lab-fab__icon-btn"
                  title="重置所有 token"
                  :disabled="Object.keys(userOverrides).length === 0"
                  @click="resetOverrides"
                >
                  <RotateCcw :size="12" />
                  重置
                </button>
                <button
                  type="button"
                  class="sn-lab-fab__copy"
                  :class="{ 'is-copied': copied }"
                  @click="copySnippet"
                >
                  <Check v-if="copied" :size="12" />
                  <span>{{ copied ? '已复制' : '复制' }}</span>
                </button>
              </div>
            </div>

            <div v-for="(tokens, groupName) in tokenGroups" :key="groupName" class="sn-lab-fab__token-group">
              <div class="sn-lab-fab__token-group-label">
                {{ groupName === 'color' ? '颜色' : '形状' }}
              </div>
              <div
                v-for="t in tokens"
                :key="t.name"
                class="sn-lab-fab__token-row"
              >
                <label class="sn-lab-fab__token-label" :title="t.name">{{ t.label }}</label>
                <div class="sn-lab-fab__token-control">
                  <input
                    v-if="t.type === 'color'"
                    type="color"
                    class="sn-lab-fab__color-picker"
                    :value="displayValue(t.name) || '#000000'"
                    @input="(e: Event) => setToken(t.name, (e.target as HTMLInputElement).value)"
                  />
                  <input
                    v-else
                    type="text"
                    class="sn-lab-fab__text-input"
                    :value="displayValue(t.name)"
                    :placeholder="readCurrentToken(t.name)"
                    @input="(e: Event) => setToken(t.name, (e.target as HTMLInputElement).value)"
                  />
                </div>
              </div>
            </div>

            <details class="sn-lab-fab__snippet">
              <summary>复制 main.ts 片段</summary>
              <pre class="sn-lab-fab__pre"><code>{{ snippet }}</code></pre>
            </details>
          </div>

          <!-- Preview tab — embed <Demo> in real time -->
          <div v-show="tab === 'preview'" class="sn-lab-fab__section sn-lab-fab__section--preview">
            <div class="sn-lab-fab__preview-head">
              <span class="sn-lab-fab__preview-title">选择 demo</span>
              <span class="sn-lab-fab__preview-count">{{ allDemos.length }}</span>
            </div>
            <div class="sn-lab-fab__demos">
              <button
                v-for="d in allDemos"
                :key="d"
                type="button"
                class="sn-lab-fab__demo-pill"
                :class="{ 'is-active': d === previewName }"
                @click="previewName = d"
              >
                {{ d }}
              </button>
            </div>
            <div class="sn-lab-fab__preview-stage">
              <Demo v-if="previewKey" :key="previewKey" :name="previewKey" bare />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="sn-lab-fab__trigger"
        :aria-expanded="open"
        :aria-label="open ? '关闭 Demo Lab' : '打开 Demo Lab'"
        @click="open = !open"
      >
        <X v-if="open" :size="20" />
        <Beaker v-else :size="20" />
      </button>
    </div>
  </Teleport>
</template>

<style scoped>
/* ──────────────────────────────────────────────────────────────────────
   Pack-aware visual tokens. The FAB reads these local custom properties
   for its own chrome so that each Style Pack has its own look. The pack
   itself doesn't drive these — they're per-FAB concerns (a panel has to
   stay legible against any theme) — but the four families cover the
   official packs.
   ────────────────────────────────────────────────────────────────────── */
.sn-lab-fab {
  /* Default (modern) — neutral, soft shadow, plain rounded. */
  --sn-fab-border-w: 1px;
  --sn-fab-border-c: var(--vp-c-divider);
  --sn-fab-radius: 12px;
  --sn-fab-shadow: 0 8px 24px rgba(0, 0, 0, 0.10), 0 2px 6px rgba(0, 0, 0, 0.05);
  --sn-fab-bg: var(--vp-c-bg-elv, #ffffff);
  --sn-fab-fg: var(--vp-c-text-1);
  --sn-fab-accent: var(--vp-c-brand-1);
  --sn-fab-accent-soft: var(--vp-c-bg-soft);
  --sn-fab-trigger-bg: var(--vp-c-bg-elv, #ffffff);
  --sn-fab-trigger-fg: var(--vp-c-text-1);
  --sn-fab-trigger-shadow: 0 4px 12px rgba(0, 0, 0, 0.10);
  --sn-fab-tilt: 0deg;

  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  font-family: var(--vp-font-family-base, -apple-system, BlinkMacSystemFont, sans-serif);
}

/* iOS — flat borderless, larger radius, no shadow. */
.sn-lab-fab[data-pack="ios"] {
  --sn-fab-border-w: 0.5px;
  --sn-fab-border-c: rgba(0, 0, 0, 0.12);
  --sn-fab-radius: 14px;
  --sn-fab-shadow: 0 0 0 rgba(0, 0, 0, 0);
  --sn-fab-bg: rgba(255, 255, 255, 0.96);
  --sn-fab-trigger-bg: var(--sn-color-action-primary, #007AFF);
  --sn-fab-trigger-fg: #ffffff;
  --sn-fab-trigger-shadow: 0 4px 12px rgba(0, 122, 255, 0.30);
  --sn-fab-tilt: 0deg;
}

/* Doodle — sticker: thick ink border, hard offset shadow, wavy corners,
   paper-cream body, tilted slightly. */
.sn-lab-fab[data-pack="doodle"] {
  --sn-fab-border-w: 2.5px;
  --sn-fab-border-c: #1a1a1a;
  --sn-fab-radius: 22px 6px / 6px 22px;
  --sn-fab-shadow: 6px 6px 0 #1a1a1a;
  --sn-fab-bg: var(--vp-c-bg-elv, #FFFBEB);
  --sn-fab-fg: #1a1a1a;
  --sn-fab-accent: #FF6B9D;
  --sn-fab-accent-soft: #FFF8E7;
  --sn-fab-trigger-bg: #FFD93D;
  --sn-fab-trigger-fg: #1a1a1a;
  --sn-fab-trigger-shadow: 4px 4px 0 #1a1a1a;
  --sn-fab-tilt: 0.6deg;
}

/* Dark — low-saturation dark surface, soft shadow, no tilt. */
.sn-lab-fab[data-pack="dark"] {
  --sn-fab-border-w: 1px;
  --sn-fab-border-c: rgba(255, 255, 255, 0.08);
  --sn-fab-radius: 12px;
  --sn-fab-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
  --sn-fab-bg: #202127;
  --sn-fab-fg: #fafafa;
  --sn-fab-accent: #3b82f6;
  --sn-fab-accent-soft: #27272a;
  --sn-fab-trigger-bg: #27272a;
  --sn-fab-trigger-fg: #fafafa;
  --sn-fab-trigger-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  --sn-fab-tilt: 0deg;
}

/* ── Trigger ── */
.sn-lab-fab__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: var(--sn-fab-border-w) solid var(--sn-fab-border-c);
  background: var(--sn-fab-trigger-bg);
  color: var(--sn-fab-trigger-fg);
  cursor: pointer;
  box-shadow: var(--sn-fab-trigger-shadow);
  transform: rotate(calc(var(--sn-fab-tilt) * -2));
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s, color 0.18s;
}
.sn-lab-fab__trigger:hover {
  transform: rotate(0deg) translate(-1px, -1px);
  box-shadow: calc(var(--sn-fab-trigger-shadow) + 2px 2px 0 rgba(0,0,0,0.1));
}
.sn-lab-fab__trigger:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
}
.sn-lab-fab.is-open .sn-lab-fab__trigger {
  background: var(--sn-fab-fg);
  color: var(--sn-fab-bg);
  transform: rotate(0deg);
}

/* ── Panel ── */
.sn-lab-fab__panel {
  position: absolute;
  bottom: calc(100% + 12px);
  right: 0;
  width: min(440px, calc(100vw - 32px));
  max-height: min(680px, calc(100vh - 96px));
  background: var(--sn-fab-bg);
  color: var(--sn-fab-fg);
  border: var(--sn-fab-border-w) solid var(--sn-fab-border-c);
  border-radius: var(--sn-fab-radius);
  box-shadow: var(--sn-fab-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: rotate(var(--sn-fab-tilt));
}

/* Optional paper-grain only when in doodle mode (uses pack signal,
   not a hand-coded selector, so it follows whichever pack is active
   — currently only doodle opts in). */
.sn-lab-fab[data-pack="doodle"] .sn-lab-fab__panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    repeating-linear-gradient(0deg, rgba(26, 26, 26, 0.025) 0 1px, transparent 1px 22px),
    repeating-linear-gradient(90deg, rgba(26, 26, 26, 0.025) 0 1px, transparent 1px 22px);
  border-radius: inherit;
  z-index: 0;
}
.sn-lab-fab__panel > * {
  position: relative;
  z-index: 1;
}

/* ── Header ── */
.sn-lab-fab__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: var(--sn-fab-border-w) solid var(--sn-fab-border-c);
}
.sn-lab-fab__title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--sn-fab-fg);
}
.sn-lab-fab__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: var(--sn-fab-border-w) solid var(--sn-fab-border-c);
  background: var(--sn-fab-bg);
  color: var(--sn-fab-fg);
  cursor: pointer;
  transition: transform 0.15s;
}
.sn-lab-fab__close:hover {
  transform: rotate(90deg);
}

/* ── Tabs ── */
.sn-lab-fab__tabs {
  display: flex;
  gap: 4px;
  padding: 8px;
  border-bottom: var(--sn-fab-border-w) solid var(--sn-fab-border-c);
}
.sn-lab-fab__tab {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: center;
  height: 28px;
  border: var(--sn-fab-border-w) solid transparent;
  border-radius: calc(var(--sn-fab-radius) / 2);
  background: transparent;
  color: var(--sn-fab-fg);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.15s, background 0.15s;
}
.sn-lab-fab__tab:hover {
  opacity: 1;
}
.sn-lab-fab__tab.is-active {
  opacity: 1;
  background: var(--sn-fab-accent-soft);
  border-color: var(--sn-fab-border-c);
}

.sn-lab-fab__body {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}
.sn-lab-fab__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ── Style pack cards ── */
.sn-lab-fab__pack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 10px 12px;
  border: var(--sn-fab-border-w) solid var(--sn-fab-border-c);
  border-radius: calc(var(--sn-fab-radius) / 2);
  background: var(--sn-fab-bg);
  color: var(--sn-fab-fg);
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;
}
.sn-lab-fab__pack:hover {
  background: var(--sn-fab-accent-soft);
}
.sn-lab-fab__pack.is-active {
  background: var(--sn-fab-accent);
  color: #fff;
  border-color: var(--sn-fab-accent);
}
.sn-lab-fab__pack.is-active .sn-lab-fab__pack-desc {
  opacity: 0.85;
}
.sn-lab-fab__pack-label {
  font-weight: 600;
  font-size: 13px;
}
.sn-lab-fab__pack-desc {
  font-size: 11px;
  opacity: 0.7;
}

/* ── Theme tab header ── */
.sn-lab-fab__theme-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  gap: 6px;
}
.sn-lab-fab__theme-name {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border: var(--sn-fab-border-w) solid var(--sn-fab-border-c);
  border-radius: calc(var(--sn-fab-radius) / 2);
  background: var(--sn-fab-accent-soft);
  color: var(--sn-fab-fg);
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}
.sn-lab-fab__theme-actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.sn-lab-fab__icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 24px;
  padding: 0 8px;
  border: var(--sn-fab-border-w) solid var(--sn-fab-border-c);
  border-radius: calc(var(--sn-fab-radius) / 2);
  background: var(--sn-fab-bg);
  color: var(--sn-fab-fg);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
}
.sn-lab-fab__icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.sn-lab-fab__icon-btn:hover:not(:disabled) {
  background: var(--sn-fab-accent-soft);
}
.sn-lab-fab__copy {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 24px;
  padding: 0 8px;
  border: var(--sn-fab-border-w) solid var(--sn-fab-border-c);
  border-radius: calc(var(--sn-fab-radius) / 2);
  background: var(--sn-fab-bg);
  color: var(--sn-fab-fg);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
}
.sn-lab-fab__copy.is-copied {
  background: var(--sn-fab-accent);
  color: #fff;
  border-color: var(--sn-fab-accent);
}

/* ── Token editor ── */
.sn-lab-fab__token-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sn-lab-fab__token-group-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--sn-fab-fg);
  opacity: 0.55;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.sn-lab-fab__token-row {
  display: grid;
  grid-template-columns: 70px 1fr;
  align-items: center;
  gap: 8px;
}
.sn-lab-fab__token-label {
  font-size: 11px;
  color: var(--sn-fab-fg);
  opacity: 0.85;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sn-lab-fab__token-control {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.sn-lab-fab__color-picker {
  width: 24px;
  height: 24px;
  padding: 0;
  border: var(--sn-fab-border-w) solid var(--sn-fab-border-c);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
}
.sn-lab-fab__color-picker::-webkit-color-swatch-wrapper {
  padding: 2px;
}
.sn-lab-fab__color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 2px;
}
.sn-lab-fab__text-input {
  flex: 1;
  min-width: 0;
  height: 24px;
  padding: 0 8px;
  border: var(--sn-fab-border-w) solid var(--sn-fab-border-c);
  border-radius: 4px;
  background: var(--sn-fab-bg);
  color: var(--sn-fab-fg);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
}
.sn-lab-fab__text-input:focus,
.sn-lab-fab__color-picker:focus {
  outline: 2px solid var(--sn-fab-accent);
  outline-offset: 1px;
}

.sn-lab-fab__snippet {
  margin-top: 6px;
  border: var(--sn-fab-border-w) solid var(--sn-fab-border-c);
  border-radius: calc(var(--sn-fab-radius) / 2);
  background: var(--sn-fab-accent-soft);
  color: var(--sn-fab-fg);
}
.sn-lab-fab__snippet summary {
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
}
.sn-lab-fab__pre {
  margin: 0;
  padding: 10px 12px;
  border-top: var(--sn-fab-border-w) solid var(--sn-fab-border-c);
  background: var(--sn-fab-bg);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  line-height: 1.55;
  white-space: pre;
  overflow-x: auto;
  color: var(--sn-fab-fg);
}

/* ── Preview tab ── */
.sn-lab-fab__section--preview {
  gap: 10px;
}
.sn-lab-fab__preview-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
  color: var(--sn-fab-fg);
}
.sn-lab-fab__preview-count {
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 6px;
  border: var(--sn-fab-border-w) solid var(--sn-fab-border-c);
  border-radius: 9px;
  background: var(--sn-fab-accent-soft);
  font-size: 10px;
  color: var(--sn-fab-fg);
}
.sn-lab-fab__demos {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.sn-lab-fab__demo-pill {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border: var(--sn-fab-border-w) solid var(--sn-fab-border-c);
  border-radius: 11px;
  background: var(--sn-fab-bg);
  color: var(--sn-fab-fg);
  font-size: 11px;
  font-family: var(--vp-font-family-mono);
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.12s, background 0.12s;
}
.sn-lab-fab__demo-pill:hover {
  opacity: 1;
}
.sn-lab-fab__demo-pill.is-active {
  opacity: 1;
  background: var(--sn-fab-accent);
  color: #fff;
  border-color: var(--sn-fab-accent);
}
.sn-lab-fab__preview-stage {
  border: var(--sn-fab-border-w) dashed var(--sn-fab-border-c);
  border-radius: calc(var(--sn-fab-radius) / 2);
  padding: 12px;
  background: var(--sn-fab-accent-soft);
  min-height: 80px;
}

@media (max-width: 640px) {
  .sn-lab-fab {
    bottom: 16px;
    right: 16px;
  }
  .sn-lab-fab__panel {
    width: calc(100vw - 32px);
    right: 0;
  }
}
</style>
