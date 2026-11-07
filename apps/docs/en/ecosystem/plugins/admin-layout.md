# Admin Layout @snui/admin-layout

The admin **layout shell** ships as an official ecosystem plugin: logo, sider, top bar, content
area, footer placement and geometry, collapse state — plus **several layout styles**. Projects
already using `@snui/vue-web` install the package and replace their own `layout.vue`.

> Platform: `Web` · Package: `@snui/admin-layout` · Status: `@experimental`

> **Scope boundary (read this first)**
>
> The package **handles layout only — no business features**: no auth, no requests, no
> token/store handling, no route registration, no built-in i18n or theme engine. Where menu data
> comes from (static routes or a backend API), what a click navigates to (`router.push`) and how a
> light/dark switch re-themes are all host decisions — the layout only emits events.

## When to use

- Starting a new admin project without re-typing the sider + header + breadcrumb shell
- Switching layout shapes or swapping the whole layout style in an existing project
- Menus coming from a local static route table, or from a backend menu API
- Keeping business wiring (auth, requests, stores) in the host — the layout never touches it

## Install

```bash
pnpm add @snui/admin-layout
```

Peer requirement: `@snui/vue-web` (tokens and base components come from it; this package does not
re-emit them).

```ts
// ① Everything: one entry for every style + one full stylesheet
import { SnProLayout, SnProLayoutClassic, SnProLayoutAurora } from '@snui/admin-layout';
import '@snui/admin-layout/styles'; // shell classes only; tokens come from @snui/vue-web/styles
```

## Layout styles

Several layout styles coexist in one package, each an **independent entry with its own
stylesheet** (on-demand loading): import only the style you need.

<LayoutShowcase
  :styles="[
    { key: 'standard', name: 'pro-layout-web-side', label: 'standard', blurb: 'Four-shape shell: side / top / mix / dual' },
    { key: 'classic', name: 'pro-layout-web-classic', label: 'classic', blurb: 'Categorized sider + content header + module title band' },
    { key: 'aurora', name: 'pro-layout-web-aurora', label: 'aurora', blurb: 'Full-bleed background + top bar + floating primary rail' },
  ]"
  initial="standard"
/>

> The showcase renders **one style at a time** — click a pill to switch. Layout shells are wide,
> so side-by-side cards get squeezed; in these docs every style owns its own row.

| Style      | Component            | Entry                                 | Stylesheet                                      | Structure                                                    |
| ---------- | -------------------- | ------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------ |
| `standard` | `SnProLayout`        | `@snui/admin-layout/layouts/standard` | `@snui/admin-layout/layouts/standard/style.css` | Four-shape shell (side / top / mix / dual): sider / header / strip + content |
| `classic`  | `SnProLayoutClassic` | `@snui/admin-layout/layouts/classic`  | `@snui/admin-layout/layouts/classic/style.css`  | Classic enterprise admin: categorized sider + full-bleed content header + module title band |
| `aurora`   | `SnProLayoutAurora`  | `@snui/admin-layout/layouts/aurora`   | `@snui/admin-layout/layouts/aurora/style.css`   | Full-bleed background + top bar (logo / modules / tools) + floating primary rail |

Each style has its own page (structure, standalone import, full API and live demos):

| Style                                    | What it is                                                     |
| ---------------------------------------- | -------------------------------------------------------------- |
| [standard four-shape shell](./standard)  | One component, four shapes: side / top / mix / dual + settings drawer and tab bar |
| [classic enterprise admin](./classic)    | Categorized sider + sidebar-footer profile + content header + module title band |
| [aurora full-bleed background](./aurora) | Four background presets (solid / image / glow / mesh) + floating primary rail |
| [workbench shared dashboard](./workbench) | Layout-agnostic stats page (ECharts): account card / transactions / money flow / income |

All styles **reuse the same shared pieces** (`SnProLogo` / `SnProSearch` / `SnProNotice` /
`SnProUser`) and the same menu utilities (`routesToMenuOptions` / `menuPathTo` /
`searchMenuOptions`) — the difference is the shell, never the pieces.

### How styles load

```ts
// ① Everything: the barrel pulls in every component + one full stylesheet
import '@snui/admin-layout/styles';

// ② A single style: classic only (recommended)
import { SnProLayoutClassic } from '@snui/admin-layout/layouts/classic';
import '@snui/admin-layout/layouts/classic/style.css';

// ③ Every style
import { SnProLayout } from '@snui/admin-layout/layouts/standard';
import '@snui/admin-layout/layouts/standard/style.css';
import { SnProLayoutAurora } from '@snui/admin-layout/layouts/aurora';
import '@snui/admin-layout/layouts/aurora/style.css';
```

Each per-style stylesheet is **self-contained**: `layouts/classic/style.css` carries the classic
shell plus the shared pieces it uses (logo / search / notice / user), but none of the
standard-only rules (header / sider / strip / tabbar / settings) — and so on for the others.

> Trade-off: each subentry is a **standalone JS artifact** (no shared chunk), so an app importing
> several styles keeps one copy of the shared pieces per artifact. That costs nothing with a single
> style; if you ship several and care about the duplication, ① is the better deal.

## Menu sources

Two sources, one shape (`SnMenuOption[]`) — the layout is agnostic:

1. **Static routes** — `routesToMenuOptions(routes, { iconMap })` is a pure function over the local
   route table reading `meta.title / meta.icon / meta.hidden / meta.order` (structurally typed;
   both `RouteRecordRaw[]` and `router.options.routes` fit, no vue-router dependency);
2. **Dynamic menus (backend)** — the host maps API rows into `{ key, label, children?, icon? }`.
   The mapping (field names, permission filtering, i18n) is business logic and stays in the host.

```ts
import { routesToMenuOptions } from '@snui/admin-layout';

const menus = routesToMenuOptions(router.options.routes); // or host-mapped backend data
```

## Replace your layout.vue

```vue
<script setup lang="ts">
// Before: hand-written aside / header / menu / breadcrumb structure + styles,
//         with auth store, i18n and logout wiring in the same file.
// After:  structure goes to the layout shell; business wiring stays in the host.
import { useRoute, useRouter } from 'vue-router';
import { SnProLayout } from '@snui/admin-layout/layouts/standard';
import '@snui/admin-layout/layouts/standard/style.css';
import { routesToMenuOptions } from '@snui/admin-layout';

const route = useRoute();
const router = useRouter();
const menus = routesToMenuOptions(router.options.routes); // or host-mapped backend data
</script>

<template>
  <SnProLayout
    logo="/logo.svg"
    title="Admin"
    :menus="menus"
    :active-key="route.name"
    @select="(key) => router.push({ name: key })"
  >
    <RouterView />
  </SnProLayout>
</template>
```

## Shared pieces

Every style composes the same pieces; they also work standalone:

| Component     | Notes                                                                    |
| ------------- | ------------------------------------------------------------------------ |
| `SnProLogo`   | Brand: image / letter tile + title, title hidden when collapsed, slot replaces all |
| `SnProSearch` | Menu search: hits across levels with the ancestor trail, keyboard reachable |
| `SnProNotice` | Notification bell: badge capped at `${max}+`, `#panel` replaces the panel |
| `SnProUser`   | Profile card: avatar + name / description + dropdown, folds to the avatar |

<Demo name="pro-layout-web-search" description="SnProSearch — hits across levels with the ancestor trail, keyboard reachable; the right panel shows the same pure-function result." />

### SnProSearch Props

| Prop          | Type                             | Default    | Description                                        |
| ------------- | -------------------------------- | ---------- | -------------------------------------------------- |
| menus         | `SnMenuOption[]`                 | `[]`       | Menu tree to search (usually the layout's `menus`) |
| modelValue    | `string`                         | —          | Query text, `v-model`; omitted → uncontrolled      |
| placeholder   | `string`                         | built-in zh | Placeholder                                       |
| minLength     | `number`                         | `1`        | Minimum (trimmed) length before the panel opens    |
| maxResults    | `number`                         | `10`       | Maximum hits offered                               |
| size          | `'small' \| 'medium' \| 'large'` | `'medium'` | Field size (forwarded to SnInput)                  |
| clearable     | `boolean`                        | `true`     | Clear (×) button                                   |
| disabled      | `boolean`                        | `false`    | Disable the field                                  |
| searchLabel   | `string`                         | built-in zh | Accessible label of field / result list           |
| emptyText     | `string`                         | built-in zh | Copy when nothing matches                         |
| includeGroups | `boolean`                        | `false`    | Offer group rows (nodes with children) too         |
| filter        | `(query, hit) => boolean`        | —          | Extra predicate (e.g. permission trimming)         |
| closeOnSelect | `boolean`                        | `true`     | Close the panel after a hit is chosen              |

### SnProSearch Events

| Event               | Payload       | Description                                        |
| ------------------- | ------------- | -------------------------------------------------- |
| `update:modelValue` | `(value)`     | `v-model`                                          |
| `search`            | `(query)`     | Every keystroke (analytics / remote candidates)    |
| `select`            | `(key, item)` | Hit activated — **navigation is the host's job**   |
| `open` / `close`    | —             | Result-panel visibility                            |

> Pure-function twin: `searchMenuOptions(menus, query, { maxResults, includeGroups, filter })` →
> `{ key, label, path }[]`, sharing the component's exact rules (case-insensitive, matches its own
> or an ancestor label, leaves only by default, disabled skipped, stable order) for host-side
> command palettes or remote search.

### SnProNotice Props

| Prop        | Type                | Default     | Description                          |
| ----------- | ------------------- | ----------- | ------------------------------------ |
| count       | `number`            | `0`         | Unread badge (`0` hides it)          |
| max         | `number`            | `99`        | Badge cap; higher counts show `${max}+` |
| items       | `SnProNoticeItem[]` | `[]`        | Notification rows (host-owned data)  |
| label       | `string`            | built-in zh | Accessible label of the bell button  |
| panelTitle  | `string`            | built-in zh | Panel heading                        |
| readAllText | `string`            | built-in zh | "Mark all read" copy                 |
| emptyText   | `string`            | built-in zh | Copy when there are no rows          |

Events: `select(key, item)` (opening / marking read is the host's job), `read-all`.
Slots: `#panel` replaces the entire panel body (head and list alike).

### SnProUser Props

| Prop        | Type                   | Default       | Description                                   |
| ----------- | ---------------------- | ------------- | --------------------------------------------- |
| name        | `string`               | —             | Display name (letter tile when no avatar URL)  |
| description | `string`               | —             | Second line (role / e-mail)                    |
| avatar      | `string`               | —             | Avatar image URL                               |
| collapsed   | `boolean`              | `false`       | Folded: avatar only                            |
| menus       | `SnMenuOption[]`       | `[]`          | Dropdown rows                                  |
| trigger     | `'click' \| 'hover' …` | `'click'`     | What opens the menu (forwarded to SnDropdown)  |
| placement   | `SnDropdownPlacement`  | `'top-start'` | Panel placement (bottom-anchored card opens upwards) |
| menuLabel   | `string`               | built-in zh   | Accessible label of the trigger button         |

Events: `select(key, item)` — **the meaning is the host's call (logout / profile)**; the default
slot replaces the card content.

## Theming & dark mode

All colors go through `--sn-web-*` tokens and follow the host dark-mode mechanism. Each style
documents its own override hooks on its page.

## AI contract

The machine-readable contracts are split per style inside the package:

- `src/pro-layout/ai-description.md` (`standard`)
- `src/pro-classic/ai-description.md` (`classic`)
- `src/pro-aurora/ai-description.md` (`aurora`)
- `src/pro-search/ai-description.md` (the shared search piece and the `searchMenuOptions` rules)

Shared boundary: **patchable** are layout data and geometry (`menus` / `activeKey` / `collapsed` /
brand trio / breadcrumb / each area's `show*` and copy / slots); **never patchable** are
navigation, requests, auth, permission filtering, real re-theming, i18n translation and install
logic.

Architecture decisions: ADR-0006 (the package), ADR-0008 (multi-style + on-demand styles),
ADR-0009 (`aurora` and its background presets) — see `.ai/decisions/` in the repo.
