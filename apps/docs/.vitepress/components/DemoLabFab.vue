<script setup lang="ts">
/**
 * DemoLabFab — global Floating Action Button (FAB) for component pages.
 *
 * Per AUI-PRD-v3.1 §7.3 + AUI-DOCS-018:
 *   - Fixed bottom-right FAB; only renders on `/components/**` routes
 *   - Click → expandable popover with 3 tabs:
 *       Style   风格切换 (Style Pack 列表 + 一键注入 + skin class)
 *       Theme   主题变量 (当前 pack 的 main.ts snippet, 可复制)
 *       Preview Demo 实时渲染 (FAB 内嵌 <Demo> 渲染, 可切换 demo 名)
 *   - 实时渲染: 切 Style Pack 时若 Preview tab 激活, 嵌入 demo 立即反映新主题
 *
 * Why a single FAB (instead of multiple separate widgets)?
 *   - 三个功能都围绕"组件实时调试"展开, 合并入口减少 sidebar 干扰
 *   - 一致的右下角锚点, 切换页面不需要找入口
 *   - Preview tab 是 FAB 独有功能, 跟 StyleSwitcher / ThemeCopier 是超集
 *
 * Browser-only, mounted by theme/Layout.vue in doc-after slot.
 * `@snui/style-packs` + `@snui/tokens` are statically imported → vite auto-
 * discovers them for optimizeDeps.
 */

import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import { Beaker, Palette, Code2, X, Check } from 'lucide-vue-next'
import { allPacks, getPack } from '@snui/style-packs'
import { snCssVars } from '@snui/tokens'

type Tab = 'style' | 'theme' | 'preview'

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

function applyPack(name: string): void {
  activePack.value = name
  const pack = getPack(name)
  if (!pack) return
  const css = snCssVars({
    theme: pack.theme,
    style: pack.style,
    density: pack.density,
  })
  let styleEl = document.getElementById('snui-docs-pack') as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'snui-docs-pack'
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = css
  document.body.classList.forEach((c) => {
    if (c.startsWith('snui-skin-')) document.body.classList.remove(c)
  })
  if (name !== 'default') document.body.classList.add(`snui-skin-${name}`)
}

// ─── Theme snippet ────────────────────────────────────────────────────────
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
// Collect every demo filename reachable via import.meta.glob. The user picks
// one to render inside the FAB popover. Same glob key as Demo.vue so the
// candidates are identical to the page-level <Demo /> components.
//
// Demo.vue itself uses import.meta.glob('../demo/*.vue'). We mirror that path
// here so glob resolution matches.
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

// Default to the first demo in the FAB; user can switch.
const previewName = ref<string>('')
watch(allDemos, (list) => {
  if (!previewName.value && list.length) previewName.value = list[0] || ''
}, { immediate: true })

const previewKey = computed(() => previewName.value)

// Reset FAB state when navigating between component pages so the user gets
// a clean FAB popover per page.
watch(() => route.path, () => {
  open.value = false
})

onMounted(() => {
  // Close on Escape.
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') open.value = false
  })
})
</script>

<template>
  <Teleport to="body">
    <div v-if="showFab" class="sn-lab-fab" :class="{ 'is-open': open }">
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

          <!-- Theme tab -->
          <div v-show="tab === 'theme'" class="sn-lab-fab__section">
            <div class="sn-lab-fab__theme-head">
              <span class="sn-lab-fab__theme-name">{{ activePack }}</span>
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
            <pre class="sn-lab-fab__pre"><code>{{ snippet }}</code></pre>
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
   Doodle Style — thick ink border + hard offset shadow + wavy corners +
   paper-cream background. Inspired by Excalidraw / notebook stickers.
   Always visible regardless of light/dark mode (the FAB must read clearly
   as a tool layer, not blend into the doc chrome).

   Background uses vp-c-bg-elv (VitePress 1.6+ spelling; older 1.5 used
   vp-c-bg-elevated). The previous name silently resolved to undefined →
   transparent panel, which is why "panel had no background".
   ────────────────────────────────────────────────────────────────────── */
.sn-lab-fab {
  --sn-doodle-ink: #1a1a1a;
  --sn-doodle-paper: #FFF8E7;
  --sn-doodle-yellow: #FFD93D;
  --sn-doodle-pink: #FF7AB6;
  --sn-doodle-cyan: #6BCBEF;
  --sn-doodle-green: #B8E986;
  --sn-doodle-shadow: 4px 4px 0 var(--sn-doodle-ink);
  --sn-doodle-shadow-lg: 6px 6px 0 var(--sn-doodle-ink);

  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  font-family: var(--vp-font-family-base, -apple-system, BlinkMacSystemFont, sans-serif);
}

/* ── Trigger: round sticker, ink-bordered, offset shadow, slight tilt ── */
.sn-lab-fab__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2.5px solid var(--sn-doodle-ink);
  background: var(--sn-doodle-yellow);
  color: var(--sn-doodle-ink);
  cursor: pointer;
  box-shadow: var(--sn-doodle-shadow);
  transform: rotate(-6deg);
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s;
}
.sn-lab-fab__trigger:hover {
  transform: rotate(-2deg) translate(-1px, -1px);
  background: var(--sn-doodle-pink);
  box-shadow: 5px 5px 0 var(--sn-doodle-ink);
}
.sn-lab-fab__trigger:active {
  transform: rotate(-4deg) translate(2px, 2px);
  box-shadow: 1px 1px 0 var(--sn-doodle-ink);
}
.sn-lab-fab.is-open .sn-lab-fab__trigger {
  background: var(--sn-doodle-ink);
  color: var(--sn-doodle-yellow);
  border-color: var(--sn-doodle-ink);
  transform: rotate(0deg);
  box-shadow: 3px 3px 0 var(--sn-doodle-ink);
}

/* ── Panel: notebook paper with wavy corners + hard offset shadow ── */
.sn-lab-fab__panel {
  position: absolute;
  bottom: calc(100% + 12px);
  right: 0;
  width: min(420px, calc(100vw - 32px));
  max-height: min(640px, calc(100vh - 96px));
  background: var(--vp-c-bg-elv, #ffffff);
  border: 2.5px solid var(--sn-doodle-ink);
  border-radius: 22px 6px 22px 6px / 6px 22px 6px 22px;
  box-shadow: var(--sn-doodle-shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: rotate(0.6deg);
}

/* Subtle paper-grain texture: two crossing diagonal lines, very low opacity.
   Avoids depending on extra asset files; pure CSS noise via repeating gradients. */
.sn-lab-fab__panel::before {
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

.sn-lab-fab__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 2px dashed var(--sn-doodle-ink);
  background: var(--sn-doodle-yellow);
}
.sn-lab-fab__title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--sn-doodle-ink);
  letter-spacing: 0.2px;
}
.sn-lab-fab__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid var(--sn-doodle-ink);
  background: var(--sn-doodle-paper);
  color: var(--sn-doodle-ink);
  cursor: pointer;
  box-shadow: 1px 1px 0 var(--sn-doodle-ink);
  transition: transform 0.15s, box-shadow 0.15s;
}
.sn-lab-fab__close:hover {
  transform: rotate(90deg);
  box-shadow: 2px 2px 0 var(--sn-doodle-ink);
}

/* ── Tabs: chunky pill buttons with hard offset shadows ── */
.sn-lab-fab__tabs {
  display: flex;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 2px dashed var(--sn-doodle-ink);
  background: var(--sn-doodle-paper);
}
.sn-lab-fab__tab {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: center;
  height: 30px;
  border: 2px solid var(--sn-doodle-ink);
  border-radius: 8px 2px 8px 2px / 2px 8px 2px 8px;
  background: var(--vp-c-bg-elv, #ffffff);
  color: var(--sn-doodle-ink);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--sn-doodle-ink);
  transition: transform 0.12s, box-shadow 0.12s;
}
.sn-lab-fab__tab:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 var(--sn-doodle-ink);
}
.sn-lab-fab__tab:active {
  transform: translate(1px, 1px);
  box-shadow: 0 0 0 var(--sn-doodle-ink);
}
.sn-lab-fab__tab.is-active {
  background: var(--sn-doodle-pink);
  color: var(--sn-doodle-ink);
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

/* ── Style pack cards: hand-drawn bordered boxes ── */
.sn-lab-fab__pack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 10px 12px;
  border: 2px solid var(--sn-doodle-ink);
  border-radius: 10px 2px 10px 2px / 2px 10px 2px 10px;
  background: var(--vp-c-bg-elv, #ffffff);
  color: var(--sn-doodle-ink);
  text-align: left;
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--sn-doodle-ink);
  transition: transform 0.12s, box-shadow 0.12s, background 0.12s;
}
.sn-lab-fab__pack:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 var(--sn-doodle-ink);
  background: var(--sn-doodle-paper);
}
.sn-lab-fab__pack.is-active {
  background: var(--sn-doodle-green);
}
.sn-lab-fab__pack-label {
  font-weight: 700;
  font-size: 13px;
}
.sn-lab-fab__pack-desc {
  font-size: 11px;
  opacity: 0.7;
}

.sn-lab-fab__theme-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.sn-lab-fab__theme-name {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border: 2px solid var(--sn-doodle-ink);
  border-radius: 6px 2px 6px 2px / 2px 6px 2px 6px;
  background: var(--sn-doodle-cyan);
  color: var(--sn-doodle-ink);
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
}
.sn-lab-fab__copy {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 26px;
  padding: 0 12px;
  border: 2px solid var(--sn-doodle-ink);
  border-radius: 6px 2px 6px 2px / 2px 6px 2px 6px;
  background: var(--vp-c-bg-elv, #ffffff);
  color: var(--sn-doodle-ink);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--sn-doodle-ink);
  transition: transform 0.12s, box-shadow 0.12s;
}
.sn-lab-fab__copy:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 var(--sn-doodle-ink);
}
.sn-lab-fab__copy:active {
  transform: translate(1px, 1px);
  box-shadow: 0 0 0 var(--sn-doodle-ink);
}
.sn-lab-fab__copy.is-copied {
  background: var(--sn-doodle-green);
}

.sn-lab-fab__pre {
  margin: 0;
  padding: 10px 12px;
  border: 2px solid var(--sn-doodle-ink);
  border-radius: 8px 2px 8px 2px / 2px 8px 2px 8px;
  background: var(--sn-doodle-paper);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  line-height: 1.55;
  white-space: pre;
  overflow-x: auto;
  color: var(--sn-doodle-ink);
  max-height: 320px;
  overflow-y: auto;
  box-shadow: 2px 2px 0 var(--sn-doodle-ink);
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
  color: var(--sn-doodle-ink);
}
.sn-lab-fab__preview-count {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  border: 2px solid var(--sn-doodle-ink);
  border-radius: 10px 2px 10px 2px / 2px 10px 2px 10px;
  background: var(--sn-doodle-yellow);
  font-size: 11px;
  font-weight: 700;
  color: var(--sn-doodle-ink);
}
.sn-lab-fab__demos {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.sn-lab-fab__demo-pill {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border: 2px solid var(--sn-doodle-ink);
  border-radius: 12px 2px 12px 2px / 2px 12px 2px 12px;
  background: var(--vp-c-bg-elv, #ffffff);
  color: var(--sn-doodle-ink);
  font-size: 11px;
  font-weight: 500;
  font-family: var(--vp-font-family-mono);
  cursor: pointer;
  box-shadow: 1px 1px 0 var(--sn-doodle-ink);
  transition: transform 0.12s, box-shadow 0.12s;
}
.sn-lab-fab__demo-pill:hover {
  transform: translate(-1px, -1px);
  box-shadow: 2px 2px 0 var(--sn-doodle-ink);
  background: var(--sn-doodle-paper);
}
.sn-lab-fab__demo-pill.is-active {
  background: var(--sn-doodle-pink);
  color: var(--sn-doodle-ink);
}

.sn-lab-fab__preview-stage {
  border: 2px dashed var(--sn-doodle-ink);
  border-radius: 10px 2px 10px 2px / 2px 10px 2px 10px;
  padding: 12px;
  background: var(--sn-doodle-paper);
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
