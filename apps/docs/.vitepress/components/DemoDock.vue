<script setup lang="ts">
/**
 * DemoDock — the fixed phone preview panel on uni-app component pages.
 *
 * ## Why this exists
 *
 * The previous layout put every demo inline: a heading, a live preview card,
 * then a collapsible code block, repeated down the page. On mobile component
 * pages that reads badly — the phone-frame preview is 400px wide and, inline,
 * it eats the article column while the actual teaching content (the code) is
 * pushed below the fold on every single section.
 *
 * The reference docs (wot-ui) solve this the other way round: the article is
 * code + prose, and one persistent device preview sits on the right. Reading
 * the page never loses the preview, and the preview never steals the column.
 *
 * ## How it works
 *
 * This component owns the panel chrome and the active-demo selection. The
 * actual demo bodies stay where they are (rendered by `Demo.vue`); they
 * *teleport* their render root into `#sn-demo-dock-slot` when the dock is
 * active, and fall back to inline rendering when it is not (narrow viewport,
 * non-uni page, or the user closed the dock).
 *
 * Two stores coordinate that hand-off, both module-level (no prop drilling
 * across the VitePress markdown boundary, which cannot pass props into
 * globally-registered components):
 *
 *   - `dockState`   — is the dock mounted / open, and which demo is active
 *   - `demoRegistry` — every mounted demo, in document order
 *
 * ## Mobile / narrow viewport
 *
 * Below 1200px there is no room for a 400px side panel next to a readable
 * article, so the dock stays unmounted and every demo renders inline exactly
 * as before. `Demo.vue` keys its teleport decision off `dockState.active`, so
 * the fallback is automatic.
 */

import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData, useRoute } from 'vitepress'
import PhoneFrame from './PhoneFrame.vue'
import { dockState, setDockOpen, type DockEntry } from '../utils/demo-dock'
import { loadDemoComponent } from '../utils/demo-loader'

const { lang } = useData()
const route = useRoute()
const isEn = computed(() => lang.value === 'en-US')

/**
 * Only uni-app component pages get the dock: web demos are not phone-shaped,
 * and the guide / theme / AI pages have no demos at all.
 */
const isDockRoute = computed(() => {
  const path = route.path
  return (
    (path.startsWith('/components/uni/') || path.startsWith('/en/components/uni/')) &&
    !path.endsWith('/')
  )
})

const entries = computed<DockEntry[]>(() => dockState.entries)
const activeName = computed(() => dockState.active)
/**
 * Async component cache, keyed by demo name.
 *
 * `defineAsyncComponent` returns a *new* component object on every call, and
 * Vue treats a new object as a different component — so resolving inside the
 * template would remount the demo (and re-run its side effects) on every
 * reactive tick. Caching per name keeps identity stable for the page.
 */
const componentCache = new Map<string, ReturnType<typeof loadDemoComponent>>()

function demoFor(name: string): ReturnType<typeof loadDemoComponent> {
  let component = componentCache.get(name)
  if (component === undefined) {
    component = loadDemoComponent(name, isEn.value)
    componentCache.set(name, component)
  }
  return component
}

/**
 * Navigation title for the device chrome — the page's own `<h1>`, which is
 * what a mini program's navigation bar shows.
 *
 * Reactive per route: taken from VitePress page data (the frontmatter title)
 * instead of scraping the DOM once at mount, so switching between component
 * pages updates the bar. DOM scraping remains as a fallback because the
 * fallback 404 / bare pages have no frontmatter title.
 */
const { page } = useData()

const pageTitle = computed<string>(() => {
  const fromData = page.value.title?.trim() ?? ''
  if (fromData !== '') return fromData
  const h1 = document.querySelector('.vp-doc h1')
  return h1?.textContent?.replace(/[#\u200b]/g, '').trim() ?? ''
})

const t = computed(() =>
  isEn.value
    ? {
        empty: 'No preview on this page',
      }
    : {
        empty: '本页暂无预览',
      },
)


/**
 * Track the viewport width so the dock only claims layout space when there is
 * actually room for it. `matchMedia` is cheaper and more reliable than a
 * resize listener, and it is available in every browser VitePress targets.
 */
const wideEnough = ref(false)
let mq: MediaQueryList | null = null
let onMqChange: ((e: MediaQueryListEvent) => void) | null = null

onMounted(() => {
  mq = window.matchMedia('(min-width: 1200px)')
  const apply = (matches: boolean): void => {
    wideEnough.value = matches
    if (!matches) setDockOpen(false)
  }
  apply(mq.matches)
  onMqChange = (e: MediaQueryListEvent) => apply(e.matches)
  mq.addEventListener('change', onMqChange)
  // The dock must be open before the demos register, so the first demo can
  // claim the active slot; `Demo.vue` also seeds this synchronously on uni
  // routes to survive the opposite mount order.
  if (isDockRoute.value) setDockOpen(true)
})

onBeforeUnmount(() => {
  if (mq !== null && onMqChange !== null) mq.removeEventListener('change', onMqChange)
  mq = null
  onMqChange = null
  setDockOpen(false)
})

/** The dock is live when the route qualifies, there is room, and it is open. */
const visible = computed(() => isDockRoute.value && wideEnough.value && dockState.open)
</script>

<template>
  <Teleport to="body">
    <aside
      v-if="visible"
      class="sn-dock"
      aria-label="Component preview"
    >
      <!--
        One device, one scroll surface, every demo stacked inside it.

        Rendering all demos here (instead of only the selected one) is what
        makes the preview read like a real page: section headings, spacing and
        scroll behaviour are exactly what a mini program shows. It also removes
        the mount-order coupling the teleport design had — nothing crosses a
        component boundary, so no `<Teleport>` target can go missing.

        `Demo.vue` renders no inline preview on uni pages while this panel is
        open, so each demo body exists exactly once.
      -->
      <div class="sn-dock__body">
        <PhoneFrame
          v-if="entries.length > 0"
          :title="pageTitle"
        >
          <section
            v-for="(entry, index) in entries"
            :id="'sn-dock-section-' + entry.name"
            :key="entry.name"
            class="sn-dock__section"
            :class="[entry.name === activeName ? 'sn-dock__section--active' : '']"
          >
            <h4 class="sn-dock__section-title">
              <span class="sn-dock__section-num">{{ index + 1 }}</span>
              {{ entry.label }}
            </h4>
            <component :is="demoFor(entry.name)" />
          </section>
        </PhoneFrame>
        <p v-else class="sn-dock__empty">{{ t.empty }}</p>
      </div>

    </aside>
  </Teleport>
</template>

<style scoped>
/*
 * The panel *is* the phone.
 *
 * No border and no title bar: the surface should read as a device, not as a
 * widget with chrome. Depth comes from a soft shadow and a large radius, which
 * is what lifts it off the article without drawing a visible frame around the
 * component being documented.
 */
.sn-dock {
  position: fixed;
  top: calc(var(--vp-nav-height) + 16px);
  right: 24px;
  z-index: 60;
  display: flex;
  flex-direction: column;
  width: 400px;
  /*
   * A fixed height, not a max-height.
   *
   * With `max-height` the panel shrank to its content, so a short page gave a
   * stubby device and a long page a tall one — the frame moved every time the
   * reader switched pages. Pinning the height keeps the device stable; content
   * that overflows scrolls inside the screen, which is what a real device does.
   */
  height: calc(100vh - var(--vp-nav-height) - 48px);
  border: 0;
  border-radius: 44px;
  background: var(--vp-c-bg);
  box-shadow: 0 18px 48px -18px rgba(0, 0, 0, 0.22);
  overflow: hidden;
}

.dark .sn-dock {
  box-shadow: 0 18px 48px -18px rgba(0, 0, 0, 0.7);
}

/*
 * Device area.
 *
 * The dock is a column flexbox and this area takes the rest, so the phone fills
 * the panel. Anything taller scrolls inside the phone's own screen, which is
 * what a real page does — the surface never gets a page scrollbar.
 */
.sn-dock__body {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  padding: 0;
  overflow: hidden;
}

/* One section per demo, stacked in document order inside the device. */
.sn-dock__section {
  padding: 4px 0 20px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.sn-dock__section:last-child {
  border-bottom: 0;
  padding-bottom: 4px;
}

/* Section heading: small numbered label, so the stacked page stays scannable. */
.sn-dock__section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 12px;
  padding: 0;
  border: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.sn-dock__section-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-3);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}

.sn-dock__section--active .sn-dock__section-title {
  color: var(--vp-c-text-1);
}

.sn-dock__empty {
  margin: 0;
  padding: 24px 8px;
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 13px;
}
</style>

<style>
/*
 * Device sizing inside the dock (unscoped on purpose).
 *
 * `PhoneFrame` owns its own surface styling and is rendered by this component,
 * but its *layout slot* is decided here: the phone fills the panel exactly, so
 * the panel's rounded corners and the screen's rounded corners coincide and the
 * surface reads as one device.
 */
.sn-dock__body .sn-phone {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  /* The panel is the device here, so drop the inline phone-width cap. */
  max-width: none;
  margin: 0;
}

.sn-dock__body .sn-phone__screen {
  flex: 1 1 auto;
  min-height: 0;
  /* The panel already clips to its own radius; matching it here keeps the
     screen flush with the panel edge instead of floating inside it. */
  border-radius: inherit;
}
</style>
