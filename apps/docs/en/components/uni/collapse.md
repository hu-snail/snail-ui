# Collapse · uni-app

`sn-collapse` is the collapsible-panel container of `@snui/uni` (mobile / miniprogram / H5); `sn-collapse-item` is a single panel. Auto-registered via easycom; geometry uses `rpx` so it scales with the device.

## Basic usage

In normal mode `v-model` is a `string[]`, so several panels can be open at once:

<Demo name="collapse-mp-basic" description="v-model binds the open-name array; multiple panels can stay open together." />

## Accordion mode

With `accordion`, `v-model` is a `string` and only one panel stays open; `disabled` blocks the toggle:

<Demo name="collapse-mp-accordion" description="accordion makes v-model a string and keeps one panel open; a disabled panel cannot expand." />

## View-more mode

With `viewmore`, `v-model` is a `boolean` and the body collapses to `line-num` lines:

<Demo name="collapse-mp-viewmore" description="viewmore makes v-model a boolean; line-num sets the collapsed line count; a toggle button renders at the bottom." />

## Card form

`card` renders every panel as its own rounded card: the container goes transparent, the panels stack with a token gap, each card draws its own radius / border / shadow and the shared divider steps aside. Turn it on at `sn-collapse` level to have the whole group inherit it, or on a single `sn-collapse-item`; an explicit panel value wins over the container.

<Demo name="collapse-mp-card" description="collapse card gives every panel its own card with a configurable title icon; a single panel can be a card on its own." />

## Title icon and icon size

A panel title accepts an icon resolved from three sources in priority order: `titleIconData` (a built-in set object) > `titleIconUrl` (an image) > `titleIcon` (a name chain: built-in catalogue kebab names / registered names). `iconSize` unifies the chevron and the title icon — tier names map to `--sn-mp-icon-size-*`, numbers are px and any other string passes through. `iconColor` takes a `var(--sn-mp-color-*)` token only. The container's `iconSize` / `iconColor` are inherited by panels; a panel-level value wins.

<Demo name="collapse-mp-icon" description="Three title-icon sources: a built-in set object, an image URL and the name chain; iconSize tiers tiny/small/medium/large plus a custom length; iconColor takes a colour token." />

## The more slot, item border and before-expend

The `more` slot replaces the viewmore expand / collapse area and `custom-more-slot-class` appends a class to it; item `border=false` drops the bottom rule; `before-expend` guards the expand:

<Demo name="collapse-mp-slots" description="more slot with custom-more-slot-class; item border=false; before-expend guard; title slot." />

## Auto registration (easycom)

The component follows the easycom convention, so **no import is needed in a template**:

```vue
<sn-collapse v-model="open">
  <sn-collapse-item name="a" title="Title">Content</sn-collapse-item>
</sn-collapse>
```

For an explicit import:

```ts
import { SnCollapse } from '@snui/uni/components/sn-collapse/sn-collapse.vue';
import { SnCollapseItem } from '@snui/uni/components/sn-collapse/sn-collapse-item.vue';
```

## Props

### sn-collapse

| Prop                  | Type                            | Default | Description                                                                                     |
| --------------------- | ------------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| `modelValue`          | `string \| string[] \| boolean` | `[]`    | Bound value: `string[]` in normal mode, `string` in accordion mode, `boolean` in view-more mode |
| `accordion`           | `boolean`                       | `false` | Accordion mode                                                                                  |
| `viewmore`            | `boolean`                       | `false` | View-more mode                                                                                  |
| `useMoreSlot`         | `boolean`                       | `false` | Enable the `more` slot in view-more mode                                                        |
| `lineNum`             | `number`                        | `2`     | Collapsed line count in view-more mode                                                          |
| `customMoreSlotClass` | `string`                        | `''`    | Extra class around the `more` slot                                                              |
| `customClass`         | `string`                        | `''`    | Extra class on the root node                                                                    |
| `customStyle`         | `string`                        | `''`    | Inline style on the root node                                                                   |
| `card`                | `boolean`                       | `false` | Card form: every panel becomes its own rounded card; the container goes transparent and stacks the panels with a token gap |
| `iconSize`            | `string \| number`              | `undefined` | Icon size (chevron + title icons): tiers tiny / small / medium / large / xlarge map to `--sn-mp-icon-size-*`, numbers are px and other strings pass through; a panel value wins |
| `iconColor`           | `string`                        | `''`    | Icon colour (chevron + title icons): pass a `var(--sn-mp-color-*)` token; a panel value wins |

### sn-collapse-item

| Prop              | Type                                    | Default     | Description                        |
| ----------------- | --------------------------------------- | ----------- | ---------------------------------- |
| `name`            | `string`                                | `''`        | Unique panel name                  |
| `title`           | `string`                                | `''`        | Panel title                        |
| `disabled`        | `boolean`                               | `false`     | Disable this panel                 |
| `beforeExpend`    | `(name) => boolean \| Promise<boolean>` | `undefined` | Veto hook run before opening       |
| `border`          | `boolean`                               | `true`      | Draw the panel divider             |
| `customBodyClass` | `string`                                | `''`        | Extra class on the body container  |
| `customBodyStyle` | `string`                                | `''`        | Inline style on the body container |
| `customClass`     | `string`                                | `''`        | Extra class on the panel root      |
| `customStyle`     | `string`                                | `''`        | Inline style on the panel root     |
| `titleIconData`   | `IconData`                              | `undefined` | Title-icon data object (built-in set object / custom); highest priority |
| `titleIconUrl`    | `string`                                | `''`        | Title image URL rendered as `<image>`; below `titleIconData`, above `titleIcon` |
| `titleIcon`       | `string`                                | `''`        | Title icon name: registry (`registerSnIcons`) → built-in catalogue (kebab-case) → provider |
| `iconSize`        | `string \| number`                      | `undefined` | Icon size (chevron + title icon); inherits the container `iconSize`, then `--sn-mp-icon-size-medium` |
| `iconColor`       | `string`                                | `''`        | Icon colour (chevron + title icon); inherits the container `iconColor` |
| `iconStrokeWidth` | `number`                                | `2`         | Icon stroke weight (chevron + title icon), mirrors `--sn-mp-icon-stroke-width` |
| `card`            | `boolean`                               | `undefined` | Card form for this panel; inherits the container `card` when unset |

> `beforeExpend` keeps its historical spelling (`Expend`, not `Expand`) for backward compatibility. It runs only when **opening**; collapsing never asks. A rejected promise is treated as "stay closed" and is not rethrown.

## Events

| Event               | Description               | Payload                                  |
| ------------------- | ------------------------- | ---------------------------------------- |
| `update:modelValue` | Bound value changed       | `(value: string \| string[] \| boolean)` |
| `change`            | Bound value changed       | `({ value })`                            |
| `change` (item)     | One panel's state changed | `({ name, expanded })`                   |

## Methods

| Method      | Description                                                                                                           | Parameters                                                   |
| ----------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `toggleAll` | Toggle every panel. `{ expanded: true }` opens all, `{ expanded: false }` closes all, no argument flips the whole set | `(options?: { expanded?: boolean; skipDisabled?: boolean })` |

## Slots

| Slot                 | Description                                                           |
| -------------------- | --------------------------------------------------------------------- |
| `default` (collapse) | Panel list                                                            |
| `more` (collapse)    | Custom expand / collapse area in view-more mode; scope `{ expanded }` |
| `title` (item)       | Custom title area; scope `{ expanded, disabled, isFirst }`            |
| `default` (item)     | Panel content                                                         |

## Theme variables

| Variable                                        | Purpose                                         |
| ----------------------------------------------- | ----------------------------------------------- |
| `--sn-mp-color-background-surface`              | Panel surface                                   |
| `--sn-mp-color-background-soft`                 | Title tap feedback                              |
| `--sn-mp-color-border-subtle`                   | Panel divider / card outline                    |
| `--sn-mp-color-text-primary`                    | Title colour                                    |
| `--sn-mp-color-text-secondary`                  | Body and title-icon colour                      |
| `--sn-mp-color-text-tertiary`                   | Chevron colour                                  |
| `--sn-mp-color-action-primary`                  | Expand / collapse label and open-state icon colour |
| `--sn-mp-color-action-primary-soft`             | Open-state chevron backing                      |
| `--sn-mp-font-size-md` / `--sn-mp-font-size-sm` | Title / body size                               |
| `--sn-mp-font-line-height-normal`               | Body line height (`line-num` clamps against it) |
| `--sn-mp-spacing-1` / `--sn-mp-spacing-2` / `--sn-mp-spacing-3` / `--sn-mp-spacing-4` | Chevron padding / title-icon gap / card gap / header padding |
| `--sn-mp-radius-lg` / `--sn-mp-radius-full`     | Card radius / chevron pill radius               |
| `--sn-mp-shadow-sm`                             | Card shadow                                     |
| `--sn-mp-icon-size-tiny` … `--sn-mp-icon-size-xlarge` | Icon lengths behind the `iconSize` tiers  |
| `--sn-mp-icon-stroke-width`                     | SVG icon stroke width (2 by default)            |

Icon standard (one per family):

| Slot       | Rest                           | Open                            |
| ---------- | ------------------------------ | ------------------------------- |
| Chevron    | `--sn-mp-color-text-tertiary`  | `--sn-mp-color-action-primary`  |
| Title icon | `--sn-mp-color-text-secondary` | `--sn-mp-color-action-primary`  |

The chevron defaults to `--sn-mp-icon-size-medium` and shares that tier with the title icon; the view-more chevron uses `--sn-mp-icon-size-small` (overridden when the container sets `iconSize`).

## AI Patch Boundary

- An AI may patch `title` / `titleIconData` / `titleIcon` / `titleIconUrl` / `iconSize` / `iconColor` / `iconStrokeWidth` / `card` / `border` / `disabled` / `beforeExpend` and other presentation or interaction settings.
- `v-model` (`update:modelValue`) and the `toggleAll` method are the open-state contract; the `change` event is a host business signal — a patch may adjust the initial `modelValue` but must not fabricate events.
- Slot content (`title` / `default` / `more`) is business data; a patch should adjust container settings only, never rewrite the slot structure.
- Colours and sizes must go through `--sn-mp-color-*` / `--sn-mp-icon-size-*` tokens; a patch must never inject colour or size literals.

## Accessibility

- The panel header is `role="button"` with `aria-expanded`, `aria-disabled` and `aria-label` from `title`.
- The body is `role="region"`; while collapsed it is hidden with `v-show` and is not announced.
- The expand / collapse control is `role="button"` with `aria-expanded`.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

Every colour in `sn-collapse` comes from `--sn-mp-color-*` with no light `var()` fallback, so it adapts automatically under `.sn-theme-dark`: the panel surface flips to the dark surface, the divider uses the dark border token, the title moves to the dark primary text, the body and title icons to the dark secondary text, and the chevron to the dark tertiary text. Cards keep their token-driven outline and shadow.

Verify it by wrapping the component in `sn-config-provider` with `theme="dark"`.

## Related

- Cells: [`sn-cell`](/en/components/uni/cell)
- Tabs: [`sn-tabs`](/en/components/uni/tabs)
- Steps: [`sn-steps`](/en/components/uni/steps)
