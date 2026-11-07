<script setup lang="ts">
/**
 * SnProLayoutAurora — the `aurora` admin layout style of @snui/admin-layout.
 *
 * 通屏背景 + 顶部条 + 悬浮一级图标栏（截图款）:
 *
 *   [shell ] 页面底色 + 一张圆角「应用卡片」承载一切（外圈留白 / 大圆角 / 柔和投影）
 *   [header] 品牌 logo · 胶囊导航（一级菜单）· 右侧：亮暗分段开关 / 中英切换 / 消息 / 头像
 *   [rail  ] 悬浮图标条（选中项是深色胶囊）+ 底部：退出登录 · 帮助说明
 *   [main  ] 标题带（大标题 + 副标题，右侧 搜索 / 筛选 / 主行动）+ 内容 + 可选页脚
 *
 * ## 与截图的对应
 *
 * | 截图元素                       | 实现                                                        |
 * | ------------------------------ | ----------------------------------------------------------- |
 * | 外圈浅紫灰底 + 圆角应用卡片     | `.sn-pro-aurora__app`（背景层在它下面）                     |
 * | 顶部胶囊导航（选中是深色药丸）  | `#modules` 默认渲染 `SnMenu horizontal`（`.sn-pro-aurora__nav`）|
 * | 右上两颗圆形开关（日/月）        | `#theme-toggle`，选中态是深色药丸                            |
 * | 心形 / 铃铛 + 红色角标           | `#notice`（`SnProNotice`，圆形容器 + 红点）                  |
 * | 圆形头像                        | `#user`（`SnProUser`，收成圆形头像）                         |
 * | 左侧窄图标栏 + 深色选中方块      | `.sn-pro-aurora__rail`（64px 宽，白底圆角，选中深色）        |
 * | 标题 + 副标题 + 右侧三个控件     | `#title` / `subtitle` + `#search` / `#filter` / `#actions`  |
 *
 * ## Background presets
 *
 * `background` — `solid` 纯色 / `image` 背景图 / `gradient` 渐变光晕 / `mesh`
 * 弥散；调色板来自 `backgroundColors`（默认 `--sn-web-*`）。几何在样式里、
 * 调色板在 props 里，解析函数 `auroraBackgroundVars()` 有单测。
 *
 * ## Slot per area
 *
 * `logo` / `modules` / `theme-toggle` / `locale` / `notice` / `user` /
 * `header-actions` / `rail-menu` / `logout` / `help` / `title` / `subtitle` /
 * `search` / `filter` / `actions` / `footer` / default。
 *
 * `actions` 与 `header-actions` 的区别：`actions` 在标题带右侧（截图里的
 * 「Create a Report / Add Wallet」），`header-actions` 在顶部条最右。
 *
 * ## Boundary (ADR-0006 + ADR-0008)
 *
 * Layout only — no auth, no request, no store, no routing, no i18n, no theme
 * engine. Everything emits and the HOST decides.
 *
 * Independent entry: `@snui/admin-layout/layouts/aurora` +
 * `@snui/admin-layout/layouts/aurora/style.css`.
 */
import { computed, ref, useSlots } from 'vue';
import { CircleHelp, LogOut, Moon, SlidersHorizontal, Sun } from 'lucide-vue-next';
import { SnMenu } from '@snui/vue-web';
import type { SnDropdownKey, SnDropdownOption, SnMenuOption } from '@snui/vue-web';
import SnProLogo from '../pro-logo/SnProLogo.vue';
import SnProSearch from '../pro-search/SnProSearch.vue';
import SnProNotice from '../pro-notice/SnProNotice.vue';
import SnProUser from '../pro-user/SnProUser.vue';
import { findTopAncestorKey, menuChildrenOf, stripMenuChildren } from '../menu/sn-admin-menu';
import { auroraBackgroundVars } from './sn-pro-aurora-background';
import type {
  SnProLayoutAuroraBackground,
  SnProLayoutAuroraLocale,
  SnProLayoutAuroraLocaleLabels,
  SnProLayoutAuroraMode,
  SnProNoticeItem,
  SnProUserProfile,
} from './sn-pro-aurora-types';

defineOptions({ name: 'SnProLayoutAurora' });

const props = withDefaults(
  defineProps<{
    /** Menu tree — top level drives the rail icons, their children the header modules. */
    menus?: SnMenuOption[] | undefined;
    /** Selected menu key (controlled; usually `route.name`). */
    activeKey?: string | number | null | undefined;
    /** Full-bleed background preset. Default 'gradient'. */
    background?: SnProLayoutAuroraBackground | undefined;
    /** Background image URL — used by the `image` preset. */
    backgroundImage?: string | undefined;
    /** Glow palette of the `gradient` / `mesh` presets; defaults to the token accent pair. */
    backgroundColors?: string[] | undefined;
    /** Pin the shell to the viewport (100vh); false → height 100%. Default true. */
    fixed?: boolean | undefined;
    /** Width of the floating rail (px). Default 64. */
    railWidth?: number | undefined;
    /** Minimum height of the top bar (px). Default 64. */
    headerHeight?: number | undefined;
    /** Brand image URL (through to SnProLogo). */
    logo?: string | undefined;
    /** Brand title. */
    title?: string | undefined;
    /** Fallback brand letter. Default 'S'. */
    mark?: string | undefined;
    /** Module heading in the title band (the `#title` slot replaces it). */
    pageTitle?: string | undefined;
    /** Secondary line under the heading (the `#subtitle` slot replaces it). */
    pageSubtitle?: string | undefined;
    /** Show the built-in light/dark toggle. Default true. */
    showThemeToggle?: boolean | undefined;
    /** Appearance, `v-model:mode`; omitted → the header keeps its own. */
    mode?: SnProLayoutAuroraMode | undefined;
    /** Accessible label of the light/dark toggle. */
    themeToggleLabel?: string | undefined;
    /** Show the built-in menu search. Default true. */
    showSearch?: boolean | undefined;
    /** Search box placeholder. */
    searchPlaceholder?: string | undefined;
    /** Accessible label of the search box. */
    searchLabel?: string | undefined;
    /** Show the title-band filter button. Default true. */
    showFilter?: boolean | undefined;
    /** Accessible label of the filter button. */
    filterLabel?: string | undefined;
    /** Show the built-in zh/en switch. Default true. */
    showLocale?: boolean | undefined;
    /** Locale, `v-model:locale`; omitted → the header keeps its own. */
    locale?: SnProLayoutAuroraLocale | undefined;
    /** Accessible label of the locale switch. */
    localeLabel?: string | undefined;
    /** Glyphs of the locale switch (defaults `{ zh: '中', en: 'EN' }`). */
    localeLabels?: SnProLayoutAuroraLocaleLabels | undefined;
    /** Show the built-in notification bell. Default true. */
    showNotice?: boolean | undefined;
    /** Unread notification count (through to SnProNotice). */
    noticeCount?: number | undefined;
    /** Badge cap (through to SnProNotice). Default 99. */
    noticeMax?: number | undefined;
    /** Notification rows (host-owned data). */
    noticeItems?: SnProNoticeItem[] | undefined;
    /** Show the built-in profile menu. Default true. */
    showUser?: boolean | undefined;
    /** Header profile. Omitted → nothing renders unless the `#user` slot is used. */
    user?: SnProUserProfile | undefined;
    /** Rows of the profile dropdown. */
    userMenus?: SnMenuOption[] | undefined;
    /** Show the rail's built-in logout button. Default true. */
    showLogout?: boolean | undefined;
    /** Accessible label of the logout button. */
    logoutLabel?: string | undefined;
    /** Show the rail's built-in help button. Default true. */
    showHelp?: boolean | undefined;
    /** Accessible label of the help button. */
    helpLabel?: string | undefined;
  }>(),
  {
    menus: () => [],
    activeKey: null,
    background: 'gradient',
    backgroundImage: '',
    backgroundColors: () => [],
    fixed: true,
    railWidth: 64,
    headerHeight: 64,
    logo: '',
    title: '',
    mark: 'S',
    pageTitle: '',
    pageSubtitle: '',
    showThemeToggle: true,
    // Explicit undefined keeps the toggles uncontrolled (same pattern as
    // SnProLayout's collapsed) — a boolean cast would force controlled mode.
    mode: undefined,
    themeToggleLabel: '切换亮暗模式',
    showSearch: true,
    searchPlaceholder: '搜索菜单',
    searchLabel: '搜索菜单',
    showFilter: true,
    filterLabel: '筛选',
    showLocale: true,
    locale: undefined,
    localeLabel: '切换语言',
    localeLabels: () => ({}),
    showNotice: true,
    noticeCount: 0,
    noticeMax: 99,
    noticeItems: () => [],
    showUser: true,
    user: undefined,
    userMenus: () => [],
    showLogout: true,
    logoutLabel: '退出登录',
    showHelp: true,
    helpLabel: '帮助说明',
  },
);

const emit = defineEmits<{
  /** Menu click — the HOST navigates. Covers the header nav and the rail icons. */
  (e: 'select', key: string | number | null, item: SnMenuOption): void;
  /** Light/dark switch — the HOST persists and re-themes. */
  (e: 'update:mode', mode: SnProLayoutAuroraMode): void;
  /** zh/en switch — the HOST switches i18n and persists. */
  (e: 'update:locale', locale: SnProLayoutAuroraLocale): void;
  /** Search-result click — the HOST navigates. */
  (e: 'search-select', key: string | number, item: SnMenuOption): void;
  /** Notification row click — the HOST navigates / marks read. */
  (e: 'notice-select', key: string | number, item: SnProNoticeItem): void;
  /** "Mark all read" — the HOST performs it. */
  (e: 'notice-read-all'): void;
  /** Profile dropdown click — the meaning is the HOST's call. */
  (e: 'user-select', key: SnDropdownKey, item: SnDropdownOption): void;
  /** Title-band filter button — the HOST opens its filter surface. */
  (e: 'filter'): void;
  /** Rail logout button — the HOST clears the session. */
  (e: 'logout'): void;
  /** Rail help button — the HOST opens its help surface. */
  (e: 'help'): void;
}>();

defineSlots<{
  /** Routed content (usually `<RouterView />`). */
  default?(): unknown;
  /** Brand replacement (forwarded to SnProLogo's default slot). */
  logo?(): unknown;
  /** Header nav replacement (default: `SnMenu horizontal` of the top level). */
  modules?(): unknown;
  /** Light/dark control replacement. */
  'theme-toggle'?(): unknown;
  /** zh/en switch replacement. */
  locale?(): unknown;
  /** Notification area replacement (default SnProNotice). */
  notice?(): unknown;
  /** Profile area replacement (default SnProUser). */
  user?(): unknown;
  /** Extra header actions, at the very end of the top bar. */
  'header-actions'?(): unknown;
  /** Title-band search area replacement (default SnProSearch). */
  search?(): unknown;
  /** Title-band filter button replacement. */
  filter?(): unknown;
  /** Title-band actions on the right (the screenshot's Create a Report / Add Wallet). */
  actions?(): unknown;
  /** Rail icon menu replacement. */
  'rail-menu'?(): unknown;
  /** Rail logout button replacement. */
  logout?(): unknown;
  /** Rail help button replacement. */
  help?(): unknown;
  /** Module heading replacement (replaces `pageTitle`). */
  title?(): unknown;
  /** Heading subtitle replacement (replaces `pageSubtitle`). */
  subtitle?(): unknown;
  /** Optional footer under the content area. */
  footer?(): unknown;
}>();

const slots = useSlots();

// ── Background ───────────────────────────────────────────────────────────
const backgroundVars = computed<Record<string, string>>(() =>
  auroraBackgroundVars({
    type: props.background,
    image: props.backgroundImage,
    colors: props.backgroundColors,
  }),
);

const rootStyle = computed<Record<string, string>>(() => ({
  '--sn-pro-aurora-rail-width': `${props.railWidth}px`,
  '--sn-pro-aurora-header-height': `${props.headerHeight}px`,
  ...backgroundVars.value,
}));

// ── Menus: rail = top level, header nav = every top-level entry ──────────
//
// The screenshot's top bar is a *nav*, not a second-level strip: the pills are
// the app's modules (Dashboard / Wallet / Investment …). The rail carries the
// same top level as icons, so both stay in sync on `activeTopKey`, and the
// selected top-level entry's children remain reachable through the rail's
// hover flyout (`SnMenu` collapsed mode).
const activeTopKey = computed(() => findTopAncestorKey(props.menus, props.activeKey));
const navOptions = computed(() => stripMenuChildren(props.menus));
/** Icons only, no children — the flyout owns the second level. */
const railOptions = computed(() => stripMenuChildren(props.menus));
const hasNav = computed(() => navOptions.value.length > 0);

// ── Appearance: v-model:mode with an uncontrolled fallback ───────────────
const innerMode = ref<SnProLayoutAuroraMode>('light');
const currentMode = computed(() => props.mode ?? innerMode.value);
const modeIcon = computed(() => (currentMode.value === 'dark' ? Sun : Moon));

function toggleMode(): void {
  const next: SnProLayoutAuroraMode = currentMode.value === 'dark' ? 'light' : 'dark';
  innerMode.value = next;
  emit('update:mode', next);
}

// ── Locale: v-model:locale with an uncontrolled fallback ─────────────────
const innerLocale = ref<SnProLayoutAuroraLocale>('zh');
const currentLocale = computed(() => props.locale ?? innerLocale.value);
/** The switch shows the *other* locale's glyph (what a click would give you). */
const localeButtonText = computed(() =>
  currentLocale.value === 'zh' ? (props.localeLabels.en ?? 'EN') : (props.localeLabels.zh ?? '中'),
);

function toggleLocale(): void {
  const next: SnProLayoutAuroraLocale = currentLocale.value === 'zh' ? 'en' : 'zh';
  innerLocale.value = next;
  emit('update:locale', next);
}

// ── Visibility ───────────────────────────────────────────────────────────
const hasTitleBand = computed(
  () =>
    slots.title !== undefined ||
    slots.subtitle !== undefined ||
    slots.actions !== undefined ||
    props.pageTitle !== '' ||
    props.pageSubtitle !== '',
);
const hasTitleActions = computed(
  () => slots.actions !== undefined || props.showSearch || props.showFilter,
);
const hasUser = computed(() => props.showUser && (props.user !== undefined || slots.user !== undefined));
const hasRailFoot = computed(
  () => slots.logout !== undefined || slots.help !== undefined || props.showLogout || props.showHelp,
);

// ── SnMenu needs concrete (non-optional) values ──────────────────────────
const railWidthPx = computed(() => props.railWidth ?? 64);
const activeKeyValue = computed(() => props.activeKey ?? null);

// ── Event forwarding (navigation / business stays in the host) ───────────
function onSelect(key: string | number | null, item: SnMenuOption): void {
  emit('select', key, item);
}

function onSearchSelect(key: string | number, item: SnMenuOption): void {
  emit('search-select', key, item);
}

function onNoticeSelect(key: string | number, item: SnProNoticeItem): void {
  emit('notice-select', key, item);
}

function onUserSelect(key: SnDropdownKey, item: SnDropdownOption): void {
  emit('user-select', key, item);
}
</script>

<template>
  <div
    class="sn-pro-aurora"
    :class="[`sn-pro-aurora--bg-${background}`, { 'sn-pro-aurora--fixed': fixed }]"
    :style="rootStyle"
  >
    <!-- Painter only: the preset shapes live in the stylesheet, the palette in
         the variables `auroraBackgroundVars` resolved. -->
    <div class="sn-pro-aurora__bg" aria-hidden="true" />

    <!-- 内容层：铺满布局自身（背景在它下面铺满整个布局，不是布局外面的页面底色）。 -->
    <div class="sn-pro-aurora__app">
      <header class="sn-pro-aurora__header">
        <div class="sn-pro-aurora__brand">
          <slot name="logo">
            <SnProLogo :logo="logo" :title="title" :mark="mark" />
          </slot>
        </div>

        <nav v-if="slots.modules !== undefined || hasNav" class="sn-pro-aurora__nav" aria-label="主导航">
          <slot name="modules">
            <SnMenu
              v-if="hasNav"
              class="sn-pro-aurora__menu"
              mode="horizontal"
              :options="navOptions"
              :value="activeTopKey"
              @select="onSelect"
            />
          </slot>
        </nav>

        <div class="sn-pro-aurora__tools">
          <slot name="theme-toggle">
            <button
              v-if="showThemeToggle"
              type="button"
              class="sn-pro-aurora__round-btn"
              :class="{ 'sn-pro-aurora__round-btn--dark': currentMode === 'dark' }"
              :aria-label="themeToggleLabel"
              :aria-pressed="currentMode === 'dark'"
              :title="themeToggleLabel"
              @click="toggleMode"
            >
              <component :is="modeIcon" :size="16" aria-hidden="true" />
            </button>
          </slot>

          <slot name="locale">
            <button
              v-if="showLocale"
              type="button"
              class="sn-pro-aurora__locale"
              :aria-label="localeLabel"
              :title="localeLabel"
              @click="toggleLocale"
            >
              {{ localeButtonText }}
            </button>
          </slot>

          <slot name="notice">
            <SnProNotice
              v-if="showNotice"
              class="sn-pro-aurora__notice"
              :count="noticeCount"
              :max="noticeMax"
              :items="noticeItems"
              @select="onNoticeSelect"
              @read-all="emit('notice-read-all')"
            />
          </slot>

          <slot name="user">
            <SnProUser
              v-if="hasUser && user !== undefined"
              class="sn-pro-aurora__user"
              :name="user.name"
              :description="user.description"
              :avatar="user.avatar"
              :menus="userMenus"
              placement="bottom-end"
              @select="onUserSelect"
            />
          </slot>

          <slot name="header-actions" />
        </div>
      </header>

      <div class="sn-pro-aurora__body">
        <aside class="sn-pro-aurora__rail">
          <div class="sn-pro-aurora__rail-menu">
            <slot name="rail-menu">
              <SnMenu
                class="sn-pro-aurora__rail-sn-menu"
                mode="vertical"
                collapsed
                :options="railOptions"
                :value="activeTopKey"
                :collapsed-width="railWidthPx"
                dropdown-placement="right-start"
                @select="onSelect"
              />
            </slot>
          </div>

          <div v-if="hasRailFoot" class="sn-pro-aurora__rail-foot">
            <slot name="logout">
              <button
                v-if="showLogout"
                type="button"
                class="sn-pro-aurora__rail-btn"
                :aria-label="logoutLabel"
                :title="logoutLabel"
                @click="emit('logout')"
              >
                <LogOut :size="18" aria-hidden="true" />
              </button>
            </slot>

            <slot name="help">
              <button
                v-if="showHelp"
                type="button"
                class="sn-pro-aurora__rail-btn"
                :aria-label="helpLabel"
                :title="helpLabel"
                @click="emit('help')"
              >
                <CircleHelp :size="18" aria-hidden="true" />
              </button>
            </slot>
          </div>
        </aside>

        <main class="sn-pro-aurora__main">
          <div v-if="hasTitleBand" class="sn-pro-aurora__title-band">
            <div class="sn-pro-aurora__title-text">
              <slot name="title">
                <h1 class="sn-pro-aurora__heading">{{ pageTitle }}</h1>
              </slot>
              <slot name="subtitle">
                <p v-if="pageSubtitle !== ''" class="sn-pro-aurora__subtitle">{{ pageSubtitle }}</p>
              </slot>
            </div>

            <div v-if="hasTitleActions" class="sn-pro-aurora__title-actions">
              <slot name="search">
                <SnProSearch
                  v-if="showSearch"
                  class="sn-pro-aurora__search"
                  :menus="menus"
                  :placeholder="searchPlaceholder"
                  :search-label="searchLabel"
                  size="small"
                  @select="onSearchSelect"
                />
              </slot>

              <slot name="filter">
                <button
                  v-if="showFilter"
                  type="button"
                  class="sn-pro-aurora__title-icon"
                  :aria-label="filterLabel"
                  :title="filterLabel"
                  @click="emit('filter')"
                >
                  <SlidersHorizontal :size="16" aria-hidden="true" />
                </button>
              </slot>

              <slot name="actions" />
            </div>
          </div>

          <div class="sn-pro-aurora__content">
            <slot />
          </div>

          <footer v-if="slots.footer !== undefined" class="sn-pro-aurora__footer">
            <slot name="footer" />
          </footer>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
 * Shell hooks (AGENTS.md §112 additive pattern): an ancestor can re-point any
 * of these without touching the component. Every default is a `--sn-web-*`
 * token (or a `color-mix()` of one), so dark mode follows the host.
 */
.sn-pro-aurora {
  --sn-pro-aurora-rail-width: 64px;
  --sn-pro-aurora-header-height: 64px;
  --sn-pro-aurora-gap: var(--sn-web-spacing-3);
  --sn-pro-aurora-inset: 14px;

  /*
   * 三层次（参考图的分层）：
   *   1. 布局底 —— 环境光页底，铺满整个布局（背景层在它上面）；
   *   2. 顶栏 —— 透明，浮在环境光上；
   *   3. 内容面 —— 右侧白色圆角面板（含标题带），和悬浮图标栏并排。
   *
   * 背景属于**布局本身**：不透明的内容面只覆盖面板那一块，环境光在顶栏、面板
   * 圆角外与悬浮栏之间的缝隙里都看得见 —— 不是布局外面的页面底色。
   */
  /* 布局自身的底：浅紫灰，环境光铺在它上面（不透明，不透到布局外面）。 */
  --sn-pro-aurora-page: #f3f4fa;
  /* 内容面：近白，极轻的冷调。 */
  --sn-pro-aurora-app: #ffffff;
  /*
   * 浮层（悬浮图标栏 / 内容面板）：半透明白 + 背景模糊 —— 通屏背景会**透过**
   * 面板露出来，所以背景读起来属于布局本身，而不是围在布局外面的一圈边框。
   */
  --sn-pro-aurora-panel: rgba(255, 255, 255, 0.86);
  --sn-pro-aurora-panel-blur: 18px;
  --sn-pro-aurora-panel-solid: #ffffff;
  /* Preset strength — a host can dial the glow down without a new preset. */
  --sn-pro-aurora-glow-opacity: 0.34;
  --sn-pro-aurora-mesh-opacity: 0.45;
  --sn-pro-aurora-ink: #23203c;
  --sn-pro-aurora-ink-contrast: #ffffff;
  --sn-pro-aurora-border: rgba(24, 24, 46, 0.07);
  --sn-pro-aurora-hairline: rgba(24, 24, 46, 0.05);
  --sn-pro-aurora-muted: var(--sn-web-color-text-tertiary);

  /* 模糊半径 / 圆角 / 胶囊半径 —— 几何单独一组，便于宿主覆盖。 */
  --sn-pro-aurora-glow-blur: 56px;
  --sn-pro-aurora-radius-app: 22px;
  --sn-pro-aurora-radius-pill: 999px;

  position: relative;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background-color: var(--sn-pro-aurora-page);
  color: var(--sn-web-color-text-primary);
  font-size: var(--sn-web-font-size-sm);
  isolation: isolate;
}

.sn-pro-aurora--fixed {
  height: 100vh;
}

/* ── Background layer (通屏背景) ───────────────────────────────────────── */
.sn-pro-aurora__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-color: var(--sn-pro-aurora-page);
  background-repeat: no-repeat;
}

/* 纯色 — the page colour is the whole background. */

/* 背景图 */
.sn-pro-aurora--bg-image .sn-pro-aurora__bg {
  background-image: var(--sn-pro-aurora-bg-image);
  background-size: cover;
  background-position: center;
}

/* 渐变光晕 — two soft accents behind the app card. */
.sn-pro-aurora--bg-gradient .sn-pro-aurora__bg {
  background-image:
    radial-gradient(52% 52% at 8% 2%, var(--sn-pro-aurora-glow-1) 0%, transparent 68%),
    radial-gradient(48% 48% at 96% 0%, var(--sn-pro-aurora-glow-2) 0%, transparent 66%);
  opacity: var(--sn-pro-aurora-glow-opacity);
}

/* 弥散 — four blurred color patches; the scale hides the blur's soft edge. */
.sn-pro-aurora--bg-mesh .sn-pro-aurora__bg {
  background-image:
    radial-gradient(38% 38% at 12% 8%, var(--sn-pro-aurora-glow-1) 0%, transparent 70%),
    radial-gradient(42% 42% at 88% 6%, var(--sn-pro-aurora-glow-2) 0%, transparent 70%),
    radial-gradient(46% 46% at 78% 92%, var(--sn-pro-aurora-glow-3) 0%, transparent 72%),
    radial-gradient(40% 40% at 22% 96%, var(--sn-pro-aurora-glow-4) 0%, transparent 72%);
  opacity: var(--sn-pro-aurora-mesh-opacity);
  filter: blur(var(--sn-pro-aurora-glow-blur));
  transform: scale(1.12);
}

/* ── Content layer ─────────────────────────────────────────────────────── */
/*
 * 内容层本身**不上色**：背景层就在它下面铺满整个布局，顶栏、面板之间的缝隙、
 * 面板圆角外的角落看到的都是布局自己的背景。白色只出现在两块浮层面板
 * （悬浮图标栏 + 内容面板）上，所以背景属于布局内部，而不是布局外面的页面底色。
 */
.sn-pro-aurora__app {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: transparent;
}


/* ── Top bar ───────────────────────────────────────────────────────────── */
.sn-pro-aurora__header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-4);
  flex-shrink: 0;
  box-sizing: border-box;
  min-height: var(--sn-pro-aurora-header-height);
  padding: 0 var(--sn-web-spacing-5);
  /* 让背景从顶栏后面透出来（顶栏不属于内容面）。 */
  background: transparent;
}

.sn-pro-aurora__brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding-right: var(--sn-web-spacing-2);
}

/* Wordmark, not a tile: transparent mark + solid ink title. */
.sn-pro-aurora__brand :deep(.sn-pro-logo) {
  gap: var(--sn-web-spacing-2);
}

.sn-pro-aurora__brand :deep(.sn-pro-logo__mark) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: var(--sn-pro-aurora-ink);
  color: var(--sn-pro-aurora-ink-contrast);
  font-size: 13px;
  font-weight: 700;
}

.sn-pro-aurora__brand :deep(.sn-pro-logo__img) {
  width: 26px;
  height: 26px;
  border-radius: 8px;
}

.sn-pro-aurora__brand :deep(.sn-pro-logo__title) {
  color: var(--sn-web-color-text-primary);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.sn-pro-aurora__nav {
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
}

/*
 * The pill nav. `SnMenu horizontal` ships its own item styling (plain
 * underline-free text buttons), so the shell only supplies the pill shape and
 * the selected ink — that keeps the geometry here and the interaction in
 * vue-web.
 */
.sn-pro-aurora__menu {
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.sn-pro-aurora__menu::-webkit-scrollbar {
  display: none;
}

.sn-pro-aurora__menu :deep(.sn-menu-item) {
  height: 34px;
  padding: 0 16px;
  border-radius: var(--sn-pro-aurora-radius-pill);
  color: var(--sn-pro-aurora-muted);
  font-size: var(--sn-web-font-size-sm);
  font-weight: 500;
  white-space: nowrap;
}

.sn-pro-aurora__menu :deep(.sn-menu-item:hover) {
  background: rgba(24, 24, 46, 0.05);
  color: var(--sn-web-color-text-primary);
}

.sn-pro-aurora__menu :deep(.sn-menu-item--active),
.sn-pro-aurora__menu :deep(.sn-menu-item--active:hover) {
  background: var(--sn-pro-aurora-ink);
  color: var(--sn-pro-aurora-ink-contrast);
  font-weight: 600;
}

.sn-pro-aurora__tools {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
  margin-left: auto;
  flex-shrink: 0;
}

/* Round icon buttons (theme / locale / notice / avatar all read as circles). */
.sn-pro-aurora__round-btn,
.sn-pro-aurora__locale {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--sn-pro-aurora-panel);
  color: var(--sn-pro-aurora-muted);
  font-size: var(--sn-web-font-size-xs);
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(24, 24, 46, 0.05);
  transition:
    background-color 160ms ease,
    color 160ms ease,
    box-shadow 160ms ease;
}

.sn-pro-aurora__round-btn:hover,
.sn-pro-aurora__locale:hover {
  color: var(--sn-web-color-text-primary);
  box-shadow: 0 2px 8px rgba(24, 24, 46, 0.12);
}

/* The locale switch is text, so it needs a hair more width than the icon buttons. */
.sn-pro-aurora__locale {
  width: auto;
  min-width: 34px;
  padding: 0 9px;
  border-radius: var(--sn-pro-aurora-radius-pill);
}

/* Selected appearance = the dark ink pill (the screenshot's active sun/moon). */
.sn-pro-aurora__round-btn--dark {
  background: var(--sn-pro-aurora-ink);
  color: var(--sn-pro-aurora-ink-contrast);
}

.sn-pro-aurora__round-btn--dark:hover {
  background: var(--sn-pro-aurora-ink);
  color: var(--sn-pro-aurora-ink-contrast);
}

.sn-pro-aurora__round-btn:focus-visible,
.sn-pro-aurora__locale:focus-visible,
.sn-pro-aurora__rail-btn:focus-visible,
.sn-pro-aurora__title-icon:focus-visible {
  outline: 2px solid var(--sn-pro-aurora-ink);
  outline-offset: 2px;
}

/* Notice bell + profile avatar shrink into the same circular rhythm. */
.sn-pro-aurora__notice :deep(.sn-pro-notice__trigger) {
  box-sizing: border-box;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--sn-pro-aurora-panel);
  color: var(--sn-pro-aurora-muted);
  box-shadow: 0 1px 2px rgba(24, 24, 46, 0.05);
}

.sn-pro-aurora__notice :deep(.sn-pro-notice__trigger:hover) {
  color: var(--sn-web-color-text-primary);
}

/* Unread dot, not a badge: the screenshot keeps it a 6px red dot. */
.sn-pro-aurora__notice :deep(.sn-pro-notice__badge) {
  top: 7px;
  right: 8px;
  min-width: 0;
  height: auto;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #ef4b5f;
  font-size: 0;
  line-height: 0;
}

.sn-pro-aurora__notice :deep(.sn-pro-notice__badge)::after {
  content: '';
  display: block;
  width: 6px;
  height: 6px;
}

.sn-pro-aurora__user :deep(.sn-pro-user) {
  width: auto;
}

.sn-pro-aurora__user :deep(.sn-pro-user__trigger) {
  gap: 0;
  box-sizing: border-box;
  width: 34px;
  height: 34px;
  min-height: 0;
  padding: 0;
  border: 0;
  border-radius: 50%;
}

.sn-pro-aurora__user :deep(.sn-pro-user__trigger:hover) {
  background: transparent;
  box-shadow: 0 2px 8px rgba(24, 24, 46, 0.12);
}

.sn-pro-aurora__user :deep(.sn-pro-user__meta) {
  display: none;
}

/* ── Body: floating rail + content panel ───────────────────────────────── */
/*
 * 两块浮层并排：左边悬浮图标栏，右边内容面板。两者都留出圆角与投影，中间的缝
 * 隙露出布局自己的通屏背景 —— 参考图就是这个关系。
 */
.sn-pro-aurora__body {
  position: relative;
  display: flex;
  gap: var(--sn-pro-aurora-gap);
  box-sizing: border-box;
  flex: 1 1 auto;
  min-height: 0;
  padding: 0 var(--sn-pro-aurora-inset) var(--sn-pro-aurora-inset);
}

/*
 * 悬浮一级菜单图标：detached rounded rail. 半透明 + 背景模糊，通屏背景从它后面
 * 透出来（和内容面板同一层语言：浮在布局背景之上，而不是布局外的实体）。
 */
.sn-pro-aurora__rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  box-sizing: border-box;
  width: var(--sn-pro-aurora-rail-width);
  padding: var(--sn-web-spacing-3) 0;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 18px;
  background: var(--sn-pro-aurora-panel);
  backdrop-filter: blur(var(--sn-pro-aurora-panel-blur));
  -webkit-backdrop-filter: blur(var(--sn-pro-aurora-panel-blur));
  box-shadow: 0 10px 26px -18px rgba(24, 24, 46, 0.35);
}

.sn-pro-aurora__rail-menu {
  width: 100%;
}

/*
 * The rail's icon menu: every entry is a square tile, the selected one is the
 * dark ink tile from the screenshot. `SnMenu collapsed` already centres the
 * icons; we only give them the tile geometry.
 */
.sn-pro-aurora__rail-sn-menu :deep(.sn-menu),
.sn-pro-aurora__rail-sn-menu :deep(.sn-menu__list) {
  width: 100%;
  padding: 0;
}

/* SnMenu's vertical list is a stretch column; the rail needs the 38px tiles
 * centred on the rail axis, so pin both the list and each tile. */
.sn-pro-aurora__rail-sn-menu :deep(.sn-menu > .sn-menu__list) {
  align-items: center;
  justify-items: center;
}

.sn-pro-aurora__rail-sn-menu :deep(.sn-menu__list > .sn-menu-item) {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  margin: 4px auto;
  padding: 0;
  border-radius: 12px;
  color: var(--sn-pro-aurora-muted);
}

.sn-pro-aurora__rail-sn-menu :deep(.sn-menu-item:hover) {
  background: rgba(24, 24, 46, 0.05);
  color: var(--sn-web-color-text-primary);
}

.sn-pro-aurora__rail-sn-menu :deep(.sn-menu-item--active),
.sn-pro-aurora__rail-sn-menu :deep(.sn-menu-item--active:hover) {
  background: var(--sn-pro-aurora-ink);
  color: var(--sn-pro-aurora-ink-contrast);
}

.sn-pro-aurora__rail-foot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sn-web-spacing-1);
  box-sizing: border-box;
  width: 100%;
  padding-top: var(--sn-web-spacing-2);
}

.sn-pro-aurora__rail-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 38px;
  height: 38px;
  padding: 0;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--sn-pro-aurora-muted);
  cursor: pointer;
  transition:
    background-color 160ms ease,
    color 160ms ease;
}

.sn-pro-aurora__rail-btn:hover {
  background: rgba(24, 24, 46, 0.05);
  color: var(--sn-web-color-text-primary);
}

/* ── Content area ─────────────────────────────────────────────────────── */
/*
 * 内容区是**透明的滚动容器**，不是一整块白面板：
 *   标题带只是内容里的第一个元素（不是壳的“顶栏”），
 *   内容区里的每个模块（KPI / 图表 / 表格…）各自是一张浮层卡片。
 * 于是模块之间有间距、能看到布局背景 —— 模块边界清楚，而不是糊成一大块。
 */
.sn-pro-aurora__main {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  padding: var(--sn-web-spacing-2) var(--sn-web-spacing-2) var(--sn-web-spacing-2) 0;
  overflow: auto;
  background: transparent;
}
/* Title band: big heading + subtitle on the left, controls on the right. */
/*
 * 标题带也是一块「浮层」：它属于内容，不是壳的顶栏 —— 和下面的模块卡片同一层玻璃，
 * 于是页面读起来是「一个标题 + 一组卡片」，而不是一整块糊在一起的面板。
 */
.sn-pro-aurora__title-band {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sn-web-spacing-6);
  flex-shrink: 0;
  padding: var(--sn-web-spacing-4) var(--sn-web-spacing-5);
  margin-bottom: var(--sn-web-spacing-3);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: var(--sn-pro-aurora-radius-app);
  background: var(--sn-pro-aurora-panel);
  backdrop-filter: blur(var(--sn-pro-aurora-panel-blur));
  -webkit-backdrop-filter: blur(var(--sn-pro-aurora-panel-blur));
  box-shadow: 0 10px 30px -24px rgba(24, 24, 46, 0.4);
}

.sn-pro-aurora__title-text {
  min-width: 0;
}

.sn-pro-aurora__heading {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--sn-web-color-text-primary);
}

.sn-pro-aurora__subtitle {
  margin: var(--sn-web-spacing-2) 0 0;
  color: var(--sn-pro-aurora-muted);
  font-size: var(--sn-web-font-size-sm);
}

.sn-pro-aurora__title-actions {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
  flex-shrink: 0;
}

.sn-pro-aurora__search {
  width: 200px;
}

.sn-pro-aurora__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--sn-pro-aurora-panel);
  color: var(--sn-pro-aurora-muted);
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(24, 24, 46, 0.05);
  transition:
    color 160ms ease,
    box-shadow 160ms ease;
}

.sn-pro-aurora__title-icon:hover {
  color: var(--sn-web-color-text-primary);
  box-shadow: 0 2px 8px rgba(24, 24, 46, 0.12);
}

/*
 * 内容区：aurora 把「浮层」这套语言交给内容 —— 任何放在内容区里的模块
 * （工作台的卡片、宿主自己的卡片）都自动获得同一层玻璃面，于是模块之间有间距、
 * 能看到布局背景，模块边界清楚，而不是糊成一大块。
 * 钩子见 ProWorkbench 的 --sn-pro-workbench-card-*。
 */
.sn-pro-aurora__content {
  flex: 1 1 auto;
  min-height: 0;
  --sn-pro-workbench-card: var(--sn-pro-aurora-panel);
  --sn-pro-workbench-card-border: rgba(255, 255, 255, 0.7);
  --sn-pro-workbench-card-blur: var(--sn-pro-aurora-panel-blur);
  --sn-pro-workbench-card-shadow: 0 10px 30px -24px rgba(24, 24, 46, 0.4);
}

.sn-pro-aurora__footer {
  flex-shrink: 0;
  padding-top: var(--sn-web-spacing-4);
}
</style>
