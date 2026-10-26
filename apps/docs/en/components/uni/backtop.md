# Backtop · uni-app

`sn-backtop` is the floating "back to top" button of `@snui/uni` (mobile / miniprogram / H5). Auto-registered via easycom; geometry uses `rpx` so it scales with the device.

## Basic usage

The host passes the scroll distance through `scroll-top` (from `onPageScroll` or a `scroll-view`'s `@scroll`); past the `top` threshold the button fades in:

<Demo name="backtop-mp-basic" description="scroll-top comes from the host; the button appears once the distance passes top (300px by default)." />

## Shape and position

`shape` switches circle / square, and `bottom` / `right` set the edge distance:

<Demo name="backtop-mp-shape" description="shape=square gives the square button; bottom / right set the edge offsets; duration sets the scroll duration." />

## Visibility threshold and icon style

`top` is the visibility threshold in px; `icon-style` is appended after the icon's inline style; `z-index` participates in the root's positioning style:

<Demo name="backtop-mp-threshold" description="top=120 visibility threshold; icon-style custom icon colour; z-index level." />

## Auto registration (easycom)

The component follows the easycom convention, so **no import is needed in a template**:

```vue
<sn-backtop :scroll-top="scrollTop" text="Top" />
```

For an explicit import:

```ts
import { SnBacktop } from '@snui/uni/components/sn-backtop/sn-backtop.vue';
```

## Props

| Prop          | Type                   | Default    | Description                                                |
| ------------- | ---------------------- | ---------- | ---------------------------------------------------------- |
| `scrollTop`   | `number`               | `0`        | Scroll distance, supplied by the host                      |
| `text`        | `string`               | `''`       | Button label                                               |
| `top`         | `number`               | `300`      | Visibility threshold in px                                 |
| `duration`    | `number`               | `100`      | Scroll duration in ms                                      |
| `zIndex`      | `number`               | `10`       | Stacking level                                             |
| `iconStyle`   | `string`               | `''`       | Extra icon style, layered over the default upward rotation |
| `shape`       | `'circle' \| 'square'` | `'circle'` | Button shape                                               |
| `bottom`      | `number`               | `100`      | Distance from the bottom edge in px                        |
| `right`       | `number`               | `20`       | Distance from the right edge in px                         |
| `customStyle` | `string`               | `''`       | Inline style on the root node                              |
| `customClass` | `string`               | `''`       | Extra class on the root node                               |

## Events

| Event   | Description                                               | Payload          |
| ------- | --------------------------------------------------------- | ---------------- |
| `click` | Button tapped (the host may scroll its own `scroll-view`) | `(event: Event)` |

## Slots

| Slot      | Description           |
| --------- | --------------------- |
| `default` | Custom button content |

## Theme variables

| Variable                                    | Purpose                |
| ------------------------------------------- | ---------------------- |
| `--sn-mp-color-background-surface`          | Button fill            |
| `--sn-mp-color-border-default`              | Button border          |
| `--sn-mp-color-text-primary`                | Icon and label colour  |
| `--sn-mp-color-text-secondary`              | Button label colour    |
| `--sn-mp-shadow-sm`                         | Button elevation       |
| `--sn-mp-radius-full` / `--sn-mp-radius-md` | Circle / square radius |
| `--sn-mp-font-size-xs`                      | Label size             |
| `--sn-mp-spacing-1`                         | Icon-to-label gap      |

## Accessibility

- The root is `role="button"` with `aria-label` from `text` (`Back to top` by default).
- While hidden it also carries `aria-hidden="true"` and swallows taps — a zero-size hit target must not steal touches.
- Scrolling goes through `uni.pageScrollTo`; when the host lacks that API the call is skipped and `click` still fires.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

Every colour in `sn-backtop` comes from `--sn-mp-color-*` with no light `var()` fallback, so it adapts automatically under `.sn-theme-dark`: the button fill flips to the dark surface, border and shadow use the dark tokens, and the icon plus label switch to the dark text colours.

Verify it by wrapping in sn-config-provider 的 theme 设为 dark:

## Related

- Sticky container: [`sn-sticky`](/en/components/uni/sticky)
- Pagination: [`sn-pagination`](/en/components/uni/pagination)
