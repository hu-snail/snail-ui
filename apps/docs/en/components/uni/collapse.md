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
import { SnCollapse } from '@snui/uni/components/sn-collapse/sn-collapse.vue'
import { SnCollapseItem } from '@snui/uni/components/sn-collapse/sn-collapse-item.vue'
```

## Props

### sn-collapse

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| string[] \| boolean` | `[]` | Bound value: `string[]` in normal mode, `string` in accordion mode, `boolean` in view-more mode |
| `accordion` | `boolean` | `false` | Accordion mode |
| `viewmore` | `boolean` | `false` | View-more mode |
| `useMoreSlot` | `boolean` | `false` | Enable the `more` slot in view-more mode |
| `lineNum` | `number` | `2` | Collapsed line count in view-more mode |
| `customMoreSlotClass` | `string` | `''` | Extra class around the `more` slot |
| `customClass` | `string` | `''` | Extra class on the root node |
| `customStyle` | `string` | `''` | Inline style on the root node |

### sn-collapse-item

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | `''` | Unique panel name |
| `title` | `string` | `''` | Panel title |
| `disabled` | `boolean` | `false` | Disable this panel |
| `beforeExpend` | `(name) => boolean \| Promise<boolean>` | `undefined` | Veto hook run before opening |
| `border` | `boolean` | `true` | Draw the panel divider |
| `customBodyClass` | `string` | `''` | Extra class on the body container |
| `customBodyStyle` | `string` | `''` | Inline style on the body container |
| `customClass` | `string` | `''` | Extra class on the panel root |
| `customStyle` | `string` | `''` | Inline style on the panel root |

> `beforeExpend` keeps wot-ui's original spelling (an upstream typo) so the prop surface stays 1:1. It runs only when **opening**; collapsing never asks. A rejected promise is treated as "stay closed" and is not rethrown.

## Events

| Event | Description | Payload |
| --- | --- | --- |
| `update:modelValue` | Bound value changed | `(value: string \| string[] \| boolean)` |
| `change` | Bound value changed | `({ value })` |
| `change` (item) | One panel's state changed | `({ name, expanded })` |

## Methods

| Method | Description | Parameters |
| --- | --- | --- |
| `toggleAll` | Toggle every panel. `{ expanded: true }` opens all, `{ expanded: false }` closes all, no argument flips the whole set | `(options?: { expanded?: boolean; skipDisabled?: boolean })` |

## Slots

| Slot | Description |
| --- | --- |
| `default` (collapse) | Panel list |
| `more` (collapse) | Custom expand / collapse area in view-more mode; scope `{ expanded }` |
| `title` (item) | Custom title area; scope `{ expanded, disabled, isFirst }` |
| `default` (item) | Panel content |

## Theme variables

| Variable | Purpose |
| --- | --- |
| `--sn-mp-color-background-surface` | Panel surface |
| `--sn-mp-color-background-soft` | Title tap feedback |
| `--sn-mp-color-border-subtle` | Panel divider |
| `--sn-mp-color-text-primary` | Title colour |
| `--sn-mp-color-text-secondary` | Body and arrow colour |
| `--sn-mp-color-action-primary` | Expand / collapse label colour |
| `--sn-mp-font-size-md` / `--sn-mp-font-size-sm` | Title / body size |
| `--sn-mp-font-line-height-normal` | Body line height (`line-num` clamps against it) |
| `--sn-mp-spacing-3` / `--sn-mp-spacing-4` | Header / body padding |

## Accessibility

- The panel header is `role="button"` with `aria-expanded`, `aria-disabled` and `aria-label` from `title`.
- The body is `role="region"`; while collapsed it is hidden with `v-show` and is not announced.
- The expand / collapse control is `role="button"` with `aria-expanded`.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

Every colour in `sn-collapse` comes from `--sn-mp-color-*` with no light `var()` fallback, so it adapts automatically under `.sn-theme-dark`: the panel surface flips to the dark surface, the divider uses the dark border token, the title moves to the dark primary text and the body to the dark secondary text.

Verify it by wrapping in sn-config-provider 的 theme 设为 dark:


## Related

- Cells: [`sn-cell`](/en/components/uni/cell)
- Tabs: [`sn-tabs`](/en/components/uni/tabs)
- Steps: [`sn-steps`](/en/components/uni/steps)
