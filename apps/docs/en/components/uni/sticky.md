# Sticky · uni-app

`sn-sticky` is the sticky container of `@snui/uni` (mobile / miniprogram / H5). Auto-registered via easycom; geometry uses `rpx` so it scales with the device.

## Basic usage

Wrap the content that should stay pinned; it stays visible while the scroll container (page or `scroll-view`) scrolls:

<Demo name="sticky-mp-basic" description="Used inside a scroll-view; offset-top sets the sticky distance; z-index sets the stacking level." />

## Custom offset and stacking level

sets the sticky distance and sets the level against neighbouring sticky elements:

<Demo name="sticky-mp-offset" description="offset-top=24 sticks 24px from the top; z-index=20 sets the stacking level." />

## Stacked layers and custom styling

`custom-class` / `custom-style` land on the root; increasing `offset-top` per layer produces stacked sticky headers, and `z-index` decides the stacking order:

<Demo name="sticky-mp-layers" description="custom-class / custom-style on the root; two layers with different offset-top pin in sequence; z-index ordering." />

## Auto registration (easycom)

The component follows the easycom convention, so **no import is needed in a template**:

```vue
<sn-sticky :offset-top="0">
  <view>Sticky content</view>
</sn-sticky>
```

For an explicit import:

```ts
import { SnSticky } from '@snui/uni/components/sn-sticky/sn-sticky.vue';
```

## Props

| Prop          | Type     | Default | Description                   |
| ------------- | -------- | ------- | ----------------------------- |
| `zIndex`      | `number` | `1`     | Stacking level                |
| `offsetTop`   | `number` | `0`     | Sticky offset in px           |
| `customClass` | `string` | `''`    | Extra class on the root node  |
| `customStyle` | `string` | `''`    | Inline style on the root node |

## Events

None. `sn-sticky` is pure CSS (`position: sticky`): it registers no scroll listener, so there is no event surface and no subscription to dispose (AGENTS.md §41).

## Slots

| Slot      | Description    |
| --------- | -------------- |
| `default` | Content to pin |

## Theme variables

| Variable                           | Purpose                                             |
| ---------------------------------- | --------------------------------------------------- |
| `--sn-mp-color-background-surface` | Sticky surface (keeps content from showing through) |

## Accessibility

- The component adds no role or aria attributes: it is a pure layout container and the inner content carries the semantics.
- Because it does not listen to scrolling, no focus / announcement state changes.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

`sn-sticky` consumes exactly one colour token, `--sn-mp-color-background-surface`, with no light `var()` fallback, so the surface flips to the dark background automatically under `.sn-theme-dark` and no light content shows through while pinned.

Verify it by wrapping in sn-config-provider 的 theme 设为 dark:

## Related

- Index bar: [`sn-index-bar`](/en/components/uni/index-bar)
- Sticky tabs: `sn-tabs` `sticky` / `offsetTop`
- Back to top: [`sn-backtop`](/en/components/uni/backtop)
