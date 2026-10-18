# SnLayout Family — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end SnLayout family.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Metadata

- end: web
- package: `@snui/vue-web`
- task: AUI-WEB-LAYOUT-006
- reference-library: naive-ui `n-layout` / `n-layout-header` / `n-layout-content` / `n-layout-footer` / `n-layout-sider`
- components: SnLayout, SnLayoutHeader, SnLayoutContent, SnLayoutFooter, SnLayoutSider

## Purpose

Page-frame layout primitives: an orchestrating container (SnLayout) plus four
building blocks (Header / Content / Footer / Sider). SnLayout owns the flex
direction — vertical stack by default, horizontal row when `has-sider` is set
— and distributes style passthrough to its children through provide/inject.
The Sider adds a collapsible sidebar column with a built-in arrow trigger.

## Import

```ts
import SnLayout from '@snui/vue-web/src/layout/SnLayout.vue'
import SnLayoutSider from '@snui/vue-web/src/layout/SnLayoutSider.vue'
```

(Shared wiring exports are added by a follow-up install.ts pass; this release
is folder-local, per task scope.)

## Composition

```html
<!-- Vertical stack -->
<SnLayout>
  <SnLayoutHeader>top</SnLayoutHeader>
  <SnLayoutContent>main</SnLayoutContent>
  <SnLayoutFooter>bottom</SnLayoutFooter>
</SnLayout>

<!-- Sider + stack (nest an inner SnLayout for the stack) -->
<SnLayout has-sider>
  <SnLayoutSider show-trigger />
  <SnLayout>
    <SnLayoutHeader>top</SnLayoutHeader>
    <SnLayoutContent>main</SnLayoutContent>
  </SnLayout>
</SnLayout>
```

## Props

### SnLayout

| Name | Type | Default | Description |
|---|---|---|---|
| `hasSider` | `boolean` | `false` | Arrange children in a horizontal row (sider present). |
| `position` | `'static' \| 'absolute'` | `'static'` | `absolute` pins the root to inset 0 so children fill the viewport. |
| `contentStyle` | `string \| Record<string, string>` | — | Inline style forwarded to SnLayoutContent children. |
| `headerStyle` | `string \| Record<string, string>` | — | Inline style forwarded to SnLayoutHeader children. |
| `footerStyle` | `string \| Record<string, string>` | — | Inline style forwarded to SnLayoutFooter children. |
| `siderStyle` | `string \| Record<string, string>` | — | Inline style forwarded to SnLayoutSider children. |

### SnLayoutHeader / SnLayoutFooter

No props. Fixed-height bars (`flex: 0 0 auto`); height comes from the
component tokens below.

### SnLayoutContent

No props. Scrollable main region (`flex: 1 1 auto`, `overflow-y: auto`).

### SnLayoutSider

| Name | Type | Default | Description |
|---|---|---|---|
| `width` | `number \| string` | `272` | Expanded width (px, or any CSS length). |
| `collapsedWidth` | `number` | `64` | Width in px when collapsed. |
| `collapsed` | `boolean` | `undefined` | Controlled state (`v-model:collapsed`). Omit for uncontrolled. |
| `defaultCollapsed` | `boolean` | `false` | Uncontrolled initial state. |
| `collapseMode` | `'transform' \| 'width'` | `'transform'` | `transform` keeps the inner DOM and slides it out; `width` animates the box so content reflows. |
| `showTrigger` | `boolean \| 'arrow-circle' \| 'bar'` | `false` | Show the built-in inline-SVG arrow trigger (all truthy variants render the same trigger). |
| `bordered` | `boolean` | `false` | 1px divider on the content-facing edge. |
| `reverse` | `boolean` | `false` | Place the sider on the right side of the row. |
| `position` | `'static' \| 'absolute'` | `'static'` | Absolute positioning inside the nearest positioned ancestor. |

### Events (SnLayoutSider)

| Name | Payload | Description |
|---|---|---|
| `update:collapsed` | `boolean` | Fired by the built-in trigger click. |

## Slots

| Component | Name | Description |
|---|---|---|
| SnLayout | `default` | Layout pieces. |
| SnLayoutHeader / Content / Footer | `default` | Region content. |
| SnLayoutSider | `default` | Sider body (menus, panels…). |

## Tokens Consumed (end: web)

| Token | Default | Description |
|---|---|---|
| `--sn-web-layout-header-height` | `64px` | SnLayoutHeader height. |
| `--sn-web-layout-footer-height` | `64px` | SnLayoutFooter height. |
| `--sn-web-color-border-default` | — | Sider divider + trigger border. |
| `--sn-web-color-background-elevated` | — | Trigger background. |
| `--sn-web-color-text-primary` / `-secondary` | — | Trigger icon color / hover. |
| `--sn-web-focus-ring` | — | Trigger focus outline. |

Height tokens are not yet shipped in `@snui/tokens-web`; components use the
CSS var fallback (`var(--sn-web-layout-header-height, 64px)`), so apps can
override per-`:root` today and the alias layer can adopt them later.

## Accessibility

- Sider renders an `<aside>` landmark; the trigger is a real `<button>`
  (`type="button"`, `aria-expanded`, `aria-label="Toggle sidebar"`),
  keyboard-focusable with a visible focus ring.
- Header / Content / Footer are non-interactive containers.
- No emoji glyphs — the trigger arrow is inline SVG.

## Collapse Behavior Notes

- The sider box always declares `width: {width}` and collapses via an
  animated `max-width` clamp to `collapsedWidth` (0.2s), so the flex row
  reclaims space in both modes.
- `collapseMode: 'transform'` additionally keeps the inner content at
  `min-width: {width}` (DOM layout preserved) and slides it by
  `±(width - collapsedWidth)`; `width` mode lets content reflow.

## Simplified vs the reference surface (intentional v0.1 scope cut)

Not implemented (documented for parity tracking when a consumer needs them):

- `on-scroll` / `natively` / scrollbar props on the layout root
- `breakpoint` auto-collapse, `collapse` / `extend` / `after-*` sider events
- `inverted`, `embedded`, `show-collapsed-content`, trigger class/style props
- distinct `'arrow-circle'` / `'bar'` trigger visuals

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-LAYOUT-006
(M1 layout Web components). Folder-local release: shared wiring
(install.ts / index.ts / resolver.ts) intentionally untouched.
