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
 * Below 1280px there is no room for a 400px side panel next to a readable
 * article, so the dock stays unmounted and every demo renders inline exactly
 * as before. `Demo.vue` keys its teleport decision off `dockState.active`, so
 * the fallback is automatic.
 */

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useData, useRoute } from 'vitepress';
import PhoneFrame from './PhoneFrame.vue';
import { dockState, setDockOpen, uniCompFromRoute, type DockEntry } from '../utils/demo-dock';
import { uniDemoPageUrl } from '../utils/uni-demo-base';
import { onUniDemoReady, postUniDemoState, uniDemoStateOf } from '../utils/uni-demo-sync';
import demoManifest from '../../../uni-demo/src/demos-manifest.json';

const { isDark, lang } = useData();
const route = useRoute();
const isEn = computed(() => lang.value === 'en-US');

/**
 * Only uni-app component pages get the dock: web demos are not phone-shaped,
 * and the guide / theme / AI pages have no demos at all.
 */
const isDockRoute = computed(() => {
  const path = route.path;
  return (
    (path.startsWith('/components/uni/') || path.startsWith('/en/components/uni/')) &&
    !path.endsWith('/')
  );
});

const entries = computed<DockEntry[]>(() => dockState.entries);

/**
 * The dock shows the deployed uni-demo page for the page's component — one
 * iframe on the real uni runtime; that page stacks every scenario of the
 * component with its own module titles. The overview page previews the
 * deployed home directory. (ADR-0005: uni demo 单一事实源在 apps/uni-demo。)
 */
interface DemoManifestEntry {
  page: string;
}

const dockPreviewUrl = computed(() => {
  const comp = uniCompFromRoute(route.path);
  const entry = (demoManifest.components as Record<string, DemoManifestEntry>)[comp];
  return uniDemoPageUrl(
    entry?.page ?? 'pages/index/index',
    uniDemoStateOf(isDark.value, lang.value),
  );
});

/**
 * Theme / locale sync into the frame: URL query carries the initial state on
 * every load, then a postMessage watch + ready-handshake covers live toggles
 * (docs theme button, locale switch) without reloading the SPA inside the
 * frame. See utils/uni-demo-sync.ts for the protocol.
 */
const frameRef = ref<HTMLIFrameElement | null>(null);

function syncFrameState(): void {
  postUniDemoState(frameRef, uniDemoStateOf(isDark.value, lang.value));
}

const unlistenReady = onUniDemoReady(syncFrameState);

onBeforeUnmount(() => {
  unlistenReady();
});

watch([isDark, lang], syncFrameState);

/**
 * Navigation title for the device chrome — the page's own `<h1>`, which is
 * what a mini program's navigation bar shows.
 *
 * Reactive per route: taken from VitePress page data (the frontmatter title)
 * instead of scraping the DOM once at mount, so switching between component
 * pages updates the bar. DOM scraping remains as a fallback because the
 * fallback 404 / bare pages have no frontmatter title.
 */
const { page } = useData();

const pageTitle = computed<string>(() => {
  const fromData = page.value.title?.trim() ?? '';
  if (fromData !== '') return fromData;
  const h1 = document.querySelector('.vp-doc h1');
  return h1?.textContent?.replace(/[#\u200b]/g, '').trim() ?? '';
});

const t = computed(() =>
  isEn.value
    ? {
        empty: 'No preview on this page',
      }
    : {
        empty: '本页暂无预览',
      },
);

/**
 * Track the viewport width so the dock only claims layout space when there is
 * actually room for it. `matchMedia` is cheaper and more reliable than a
 * resize listener, and it is available in every browser VitePress targets.
 */
const wideEnough = ref(false);
let mq: MediaQueryList | null = null;
let onMqChange: ((e: MediaQueryListEvent) => void) | null = null;

/**
 * Open / close the dock for the current route + viewport.
 *
 * Runs on mount, on media change *and on every route change*. The last one is
 * what was missing: the panel is a single long-lived instance (mounted once by
 * the theme layout), so navigating from a web page to a uni page changed
 * `isDockRoute` without ever re-running this — the dock stayed closed and the
 * phone only appeared after a full reload.
 *
 * Closing on narrow viewports is not cosmetic either: the panel is not
 * rendered below 1280px, so an "open" dock there would leave every demo
 * showing the "preview moved to the panel" note with no panel in sight.
 */
function syncDockOpen(): void {
  const open = wideEnough.value && isDockRoute.value;
  setDockOpen(open);
}

onMounted(() => {
  mq = window.matchMedia('(min-width: 1280px)');
  const apply = (matches: boolean): void => {
    wideEnough.value = matches;
    syncDockOpen();
  };
  apply(mq.matches);
  onMqChange = (e: MediaQueryListEvent) => apply(e.matches);
  mq.addEventListener('change', onMqChange);
});

// Route changes keep this component mounted: re-decide without waiting for a
// reload. `flush: 'post'` runs after the outgoing page's demos have unmounted,
// so it cannot reopen against the previous route's registry.
watch([isDockRoute, wideEnough], syncDockOpen, { flush: 'post' });

onBeforeUnmount(() => {
  if (mq !== null && onMqChange !== null) mq.removeEventListener('change', onMqChange);
  mq = null;
  onMqChange = null;
  setDockOpen(false);
});

/** The dock is live when the route qualifies, there is room, and it is open. */
const visible = computed(() => isDockRoute.value && wideEnough.value && dockState.open);
</script>

<template>
  <Teleport to="body">
    <aside v-if="visible" class="sn-dock" aria-label="Component preview">
      <!--
        One device, one iframe: the standalone preview route renders every
        scenario of the page's component with its own browsing context
        (gestures, fixed layers, in-frame history). `Demo.vue` renders no
        inline preview on uni pages while this panel is open, so each demo
        body exists exactly once — inside the frame. No PhoneFrame title: the
        preview page carries its own bar and a second one here would stack.
      -->
      <div class="sn-dock__body">
        <PhoneFrame v-if="entries.length > 0 && dockPreviewUrl !== ''">
          <iframe ref="frameRef" class="sn-dock__frame" :src="dockPreviewUrl" :title="pageTitle" />
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
  /* 与站点头栏再让开一段：手机的状态栏/灵动岛紧贴面板顶边，16px 时和
     导航条几乎叠在一起，看起来像被顶栏压住。 */
  top: calc(var(--vp-nav-height) + 32px);
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
  /* 真实手机比例：现代机约 9:19.5，400px 宽对应 867px 高。之前钉死 640px
     是 400×640 ≈ 1:1.6，读起来像早期 iPhone 的矮胖比例，内容也被裁得突兀。
     高度由比例推导，再受视口约束——矮屏上按可用高度截断，屏幕内部滚动。 */
  aspect-ratio: 9 / 19.5;
  height: auto;
  max-height: calc(100vh - var(--vp-nav-height) - 64px);
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

/* The preview surface: the demo page owns its own background and scrolling.
 * Dark keeps the surface in step with the frame (PhoneFrame #17171a) so the
 * theme toggle never flashes white inside the screen. */
.sn-dock__frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background: #f8f8f8;
}

.dark .sn-dock__frame {
  background: #17171a;
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
