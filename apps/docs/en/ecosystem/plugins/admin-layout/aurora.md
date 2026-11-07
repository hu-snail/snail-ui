# aurora — full-bleed background + top bar + floating primary rail

`aurora` is the third layout style of `@snui/admin-layout`: a **configurable full-bleed
background + top bar + floating primary-icon rail**, with a slot for every area so the host can
drop in its own buttons.

> Platform: `Web` · Component: `SnProLayoutAurora` · Entry: `@snui/admin-layout/layouts/aurora` · Status: `@experimental`

## Standalone import

```ts
import { SnProLayoutAurora } from '@snui/admin-layout/layouts/aurora';
import '@snui/admin-layout/layouts/aurora/style.css'; // aurora shell CSS only
```

The barrel entry (`@snui/admin-layout` + `@snui/admin-layout/styles`) works too — see
[the overview](../admin-layout#how-styles-load).

## Structure

| Region         | Contents                                                                                                              |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| App card       | Page tint + one rounded "app card" holding everything (14px inset / 22px radius / soft shadow)                       |
| Top bar        | Brand (`#logo`) · **pill nav** (`#modules`, the top level; the selected pill is dark ink) · right: light/dark circle (`#theme-toggle`) · zh/en (`#locale`) · bell (`#notice`, red dot) · avatar (`#user`) · `#header-actions` |
| Floating rail  | Primary icons (64px white rounded rail; the selected tile is dark ink; `#rail-menu` replaces it) · bottom: logout (`#logout`) · help (`#help`) |
| Title band     | `pageTitle` (`#title`) + `pageSubtitle` (`#subtitle`) · right: search (`#search`) · filter (`#filter`) · primary actions (`#actions`) |
| Content        | Transparent scroll container; the title band and each module are separate glass panes, and the background shows between them · default slot · footer (`#footer`) |
| Background     | `background`: `solid` / `image` / `gradient` (光晕) / `mesh` (弥散); palette via `backgroundColors`                   |

<Demo name="pro-layout-web-aurora" description="aurora — switch solid / image / gradient / mesh above; pill nav, circular tools, floating rail and title band included, and the content area is the shared workbench (same data, different shell)." />

## Putting the workbench inside

The default slot of aurora hosts the **shared workbench** (`@snui/admin-layout/workbench`, ECharts-powered).
It is layout-agnostic on purpose: standard / classic / aurora all render the same data, so switching shells
changes no number on the page.

```vue
<script setup lang="ts">
import { SnProLayoutAurora } from '@snui/admin-layout/layouts/aurora';
import '@snui/admin-layout/layouts/aurora/style.css';
import { ProWorkbench } from '@snui/admin-layout/workbench';
import '@snui/admin-layout/workbench/style.css';

import { demoKpis, demoMoneyFlow, demoIncomeSources, demoTransactions } from "./workbench-demo";
</script>

<template>
  <SnProLayoutAurora page-title="Workbench" page-subtitle="Your summary for today." ...>
    <ProWorkbench
      :kpis="demoKpis"
      :money-flow="demoMoneyFlow"
      :income-sources="demoIncomeSources"
      :transactions="demoTransactions"
      :show-heading="false"
    />
  </SnProLayoutAurora>
</template>
```

`:show-heading="false"` is deliberate: aurora prints its own title band, so the workbench must not repeat
the same heading. Keep the default when the shell has no title band (classic / standard).
See [workbench](./workbench) for props / slots / events.

## Background presets

The preset's geometry (positions / radii / blur) lives in the stylesheet, the palette in the props:

```vue
<!-- gradient / mesh: swap the brand colors, keep the shape -->
<SnProLayoutAurora background="mesh" :background-colors="['#7c5cff', '#22c1a4']" … />

<!-- image -->
<SnProLayoutAurora background="image" background-image="/bg/aurora.png" … />
```

| `background` | Effect                       | Config                                                    |
| ------------ | ---------------------------- | --------------------------------------------------------- |
| `solid`      | Flat token surface           | —                                                         |
| `image`      | Background image (cover)     | `backgroundImage`                                         |
| `gradient`   | Two soft glow accents (default) | `backgroundColors?` (defaults to the token accent pair) |
| `mesh`       | Four blurred color patches   | `backgroundColors?`                                       |

The pure function `auroraBackgroundVars()` computes the same CSS variables on the host side
(`--sn-pro-aurora-glow-1..4` / `--sn-pro-aurora-bg-image`), and any ancestor can dial the strength
through `--sn-pro-aurora-glow-opacity` / `--sn-pro-aurora-mesh-opacity` / `--sn-pro-aurora-glow-blur`.

## Usage

```vue
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { SnProLayoutAurora } from '@snui/admin-layout/layouts/aurora';
import '@snui/admin-layout/layouts/aurora/style.css';

const route = useRoute();
const router = useRouter();
</script>

<template>
  <SnProLayoutAurora
    v-model:mode="mode"
    v-model:locale="locale"
    background="mesh"
    :background-colors="brandGlow"
    :menus="menus"
    :active-key="route.name"
    :page-title="pageTitle"
    :user="user"
    :notice-count="unread"
    :notice-items="notices"
    @select="(key) => router.push({ name: key })"
    @update:mode="applyTheme"
    @update:locale="switchI18n"
    @logout="logout"
    @help="openHelp"
  >
    <template #actions>
      <button type="button" @click="createSomething">＋Create</button>
    </template>

    <RouterView />
  </SnProLayoutAurora>
</template>
```

## API

### SnProLayoutAurora Props

| Prop                | Type                                              | Default      | Description                                     |
| ------------------- | ------------------------------------------------- | ------------ | ----------------------------------------------- |
| menus               | `SnMenuOption[]`                                  | `[]`         | Menu tree: top level feeds the rail, children the header modules |
| activeKey           | `string \| number \| null`                        | `null`       | Selected menu key (usually `route.name`)        |
| background          | `'solid' \| 'image' \| 'gradient' \| 'mesh'`      | `'gradient'` | Full-bleed background preset                    |
| backgroundImage     | `string`                                          | —            | Image URL (used by `background='image'`)        |
| backgroundColors    | `string[]`                                        | `[]`         | Glow / mesh palette; defaults to the token accent pair |
| fixed               | `boolean`                                         | `true`       | Pin to viewport (100vh); `false` → height 100%  |
| railWidth           | `number`                                          | `64`         | Floating rail width (px)                        |
| headerHeight        | `number`                                          | `64`         | Top-bar min height (px)                         |
| logo / title / mark | `string`                                          | —            | Brand trio                                      |
| pageTitle           | `string`                                          | —            | Title-band heading (`#title` replaces it)       |
| pageSubtitle        | `string`                                          | —            | Subtitle under it (`#subtitle` replaces it)      |
| showThemeToggle     | `boolean`                                         | `true`       | Show the light/dark button                      |
| mode                | `'light' \| 'dark'`                               | —            | Appearance, `v-model:mode`; omit = uncontrolled |
| themeToggleLabel    | `string`                                          | built-in zh  | Accessible label of the toggle                  |
| showSearch          | `boolean`                                         | `true`       | Show the menu search                            |
| searchPlaceholder   | `string`                                          | built-in zh  | Search placeholder                              |
| searchLabel         | `string`                                          | built-in zh  | Accessible label of the search field            |
| showFilter          | `boolean`                                         | `true`       | Show the title-band filter button               |
| filterLabel         | `string`                                          | built-in zh  | Accessible label of the filter button           |
| showLocale          | `boolean`                                         | `true`       | Show the zh/en switch                           |
| locale              | `'zh' \| 'en'`                                    | —            | Locale, `v-model:locale`; omit = uncontrolled   |
| localeLabel         | `string`                                          | built-in zh  | Accessible label of the switch                  |
| localeLabels        | `{ zh?: string; en?: string }`                    | `{zh:'中',en:'EN'}` | Switch glyphs (shows the *other* locale)  |
| showNotice          | `boolean`                                         | `true`       | Show the notification bell                      |
| noticeCount         | `number`                                          | `0`          | Unread badge count                              |
| noticeMax           | `number`                                          | `99`         | Badge cap                                       |
| noticeItems         | `SnProNoticeItem[]`                               | `[]`         | Notification rows (host data)                   |
| showUser            | `boolean`                                         | `true`       | Show the profile area                           |
| user                | `SnProUserProfile`                                | —            | Profile (omitted → not rendered)                |
| userMenus           | `SnMenuOption[]`                                  | `[]`         | Profile dropdown rows                           |
| showLogout          | `boolean`                                         | `true`       | Rail-footer logout button                       |
| logoutLabel         | `string`                                          | built-in zh  | Accessible label of the logout button           |
| showHelp            | `boolean`                                         | `true`       | Rail-footer help button                         |
| helpLabel           | `string`                                          | built-in zh  | Accessible label of the help button             |

### SnProLayoutAurora Events

| Event             | Payload       | Description                                          |
| ----------------- | ------------- | ---------------------------------------------------- |
| `select`          | `(key, item)` | Rail / module click — **navigation is the host's job** |
| `update:mode`     | `(mode)`      | `v-model:mode`, **re-theming is the host's job**     |
| `update:locale`   | `(locale)`    | `v-model:locale`, **i18n is the host's job**         |
| `search-select`   | `(key, item)` | Search hit — **navigation is the host's job**        |
| `notice-select`   | `(key, item)` | Notification click — **open / mark read is the host's job** |
| `notice-read-all` | —             | "Mark all read" — **the host performs it**           |
| `user-select`     | `(key, item)` | Profile menu click — **the meaning is the host's call** |
| `filter`          | —             | Title-band filter button — **the host opens its filter surface** |
| `logout`          | —             | Logout — **clearing the session / redirect is the host's job** |
| `help`            | —             | Help — **opening the help center is the host's job** |

### SnProLayoutAurora Slots (a custom button per area)

| Slot           | Description                                    |
| -------------- | ---------------------------------------------- |
| default        | Routed content (`<RouterView />`)              |
| `logo`         | Full brand replacement                         |
| `modules`      | Full secondary module row replacement          |
| `theme-toggle` | Light/dark button replacement                  |
| `search`       | Title-band search replacement (default SnProSearch) |
| `filter`       | Title-band filter button replacement           |
| `locale`       | zh/en switch replacement                       |
| `notice`       | Notification area replacement (default SnProNotice) |
| `user`         | Profile area replacement (default SnProUser)   |
| `header-actions` | Extra actions at the very end of the top bar  |
| `rail-menu`    | Full primary rail replacement                  |
| `logout`       | Logout button replacement                      |
| `help`         | Help button replacement                        |
| `title`        | Full heading replacement (title band)          |
| `subtitle`     | Full subtitle replacement (title band)         |
| `actions`      | Title-band primary actions on the right (the screenshot's Report / ＋Wallet) |
| `footer`       | Footer under the content area                  |

## Theming & dark mode

Colors build on the `--sn-web-*` tokens, with a shell palette on top: `--sn-pro-aurora-page`
(page tint), `-app` (app card), `-panel` (floating rail / circles), `-ink` / `-ink-contrast`
(selected pill & tile + its foreground) and `-muted`; geometry hooks `-inset` / `-radius-app` /
`-radius-pill` / `-rail-width` / `-header-height` / `-gap`; ambient-light strength
`-glow-opacity` / `-mesh-opacity` / `-glow-blur`.

The app card and the floating surfaces are **opaque** — the ambient light only shows in the inset
around the card, never over the content.

`mode` is only an appearance switch: the host applies the `.dark` class / token overrides in its
`update:mode` handler.

## AI contract

The machine-readable contract lives at `src/pro-aurora/ai-description.md` (background presets /
header tools / floating rail / logout & help are patchable; navigation, logout, re-theming, i18n
and auth never are).
