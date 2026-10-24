# Pagination · uni-app

`sn-pagination` is the page stepper of `@snui/uni` (mobile / miniprogram / H5). Auto-registered via easycom; geometry uses `rpx` so it scales with the device.

## Basic usage

`v-model` binds the current page and `total-page` sets the page count:

<Demo name="pagination-mp-basic" description="v-model binds the page; total-page sets the count; show-message renders the current / total counter." />

## Button variants and total-derived pages

`total` + `page-size` wins over `total-page`; `button-variant` and `show-icon` change the button look:

<Demo name="pagination-mp-variant" description="total=95 with page-size=10 gives 10 pages; button-variant=base adds a border and the step icons; dashed draws a dashed border." />

## Single-page hiding and custom slots

`hide-if-one-page` skips rendering entirely when the page count is 1; the `prev` / `size` / `next` / `message` slots share the `{ modelValue, totalPageNum, total, pageSize }` scope:

<Demo name="pagination-mp-slots" description="hide-if-one-page skips rendering; all four slots customised." />

## Auto registration (easycom)

The component follows the easycom convention, so **no import is needed in a template**:

```vue
<sn-pagination v-model="page" :total-page="8" />
```

For an explicit import:

```ts
import { SnPagination } from '@snui/uni/components/sn-pagination/sn-pagination.vue'
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number` | `1` | Current page |
| `totalPage` | `number` | `1` | Page count (overridden when `total` is given) |
| `total` | `number` | `0` | Total records (takes precedence over `totalPage`) |
| `pageSize` | `number` | `10` | Records per page |
| `prevText` | `string` | `''` | Previous button label |
| `nextText` | `string` | `''` | Next button label |
| `showIcon` | `boolean` | `false` | Show the step icons |
| `showMessage` | `boolean` | `false` | Show the text counter |
| `buttonVariant` | `'base' \| 'plain' \| 'dashed' \| 'text'` | `'text'` | Button look |
| `hideIfOnePage` | `boolean` | `false` | Hide when there is a single page |
| `customClass` | `string` | `''` | Extra class on the root node |
| `customStyle` | `string` | `''` | Inline style on the root node |

## Events

| Event | Description | Payload |
| --- | --- | --- |
| `update:modelValue` | Page changed | `(value: number)` |
| `change` | Page changed | `({ value })` |

## Slots

| Slot | Description |
| --- | --- |
| `prev` | Custom previous button; scope `{ modelValue, totalPageNum, total, pageSize }` |
| `size` | Custom page-list area; same scope |
| `next` | Custom next button; same scope |
| `message` | Custom counter, rendered when `showMessage` is true |

## Theme variables

| Variable | Purpose |
| --- | --- |
| `--sn-mp-color-background-surface` | `base` variant button fill |
| `--sn-mp-color-background-soft` | Active item hover state |
| `--sn-mp-color-border-default` | `base` variant border |
| `--sn-mp-color-text-secondary` | Page label |
| `--sn-mp-color-text-tertiary` | Ellipsis and counter text |
| `--sn-mp-color-text-disabled` | Disabled prev / next |
| `--sn-mp-color-action-primary` | Active page fill and button labels |
| `--sn-mp-color-text-on-primary` | Active page label |
| `--sn-mp-font-size-sm` / `--sn-mp-font-size-xs` | Button / counter sizes |
| `--sn-mp-font-weight-medium` | Active page weight |
| `--sn-mp-radius-sm` | Button radius |

## Accessibility

- The root is `role="navigation"` with `aria-label="Pagination"`.
- Every page entry is `role="button"`; the current one also carries `aria-current="page"`.
- The prev / next buttons are `role="button"` and become `aria-disabled="true"` at the ends, which also blocks the tap.
- Ellipses are `aria-hidden="true"` — they carry no tappable meaning.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

Every colour in `sn-pagination` comes from `--sn-mp-color-*` with no light `var()` fallback, so it adapts automatically under `.sn-theme-dark`: borders flip to the dark border token, page labels move to the dark secondary text colour, and the active page keeps the brand fill with white text.

Verify it by wrapping in sn-config-provider 的 theme 设为 dark:


## Related

- Long lists: pair with [`sn-sticky`](/en/components/uni/sticky) for a pinned header
- Back to top: [`sn-backtop`](/en/components/uni/backtop)
