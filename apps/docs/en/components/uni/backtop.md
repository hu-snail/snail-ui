# Backtop · uni-app

`sn-backtop` is the floating "back to top" button of `@snui/uni` (mobile / miniprogram / H5). Auto-registered via easycom; geometry uses `rpx` so it scales with the device.

## When to use

- Long pages or scroll areas where the user needs a one-tap way back to the top
- A floating button that should stay out of the way until the user has scrolled past a distance
- A jump entry aligned with brand or semantic colours (via `theme`)

## Basic usage

The host passes the scroll distance through `scroll-top` (from `onPageScroll` or a `scroll-view`'s `@scroll`); past the `top` threshold the button fades in. Tapping scrolls back via `uni.pageScrollTo`, and the host can also listen to `click` to scroll its own container:

<Demo name="backtop-mp-basic" description="Real scrolling inside a scroll-view: the button fades in past the threshold and scrolls back for real on tap." />

## Shape, size and content forms

`shape` switches circle / square, `size` picks the small / medium / large tier (the icon length follows the `--sn-mp-icon-size-*` tokens so the ratio stays coherent), and `bottom` / `right` set the edge distance. An icon + label button grows with its content and long labels ellipsize — nothing spills out of the button:

<Demo name="backtop-mp-shape" description="Circle / square × size × content form: icon-only buttons stay perfectly round / square, icon + label buttons adapt to the content." />

## Themes

`theme` offers semantic fills: `default` (neutral surface) / `primary` / `success` / `warning` / `danger` / `info`. The fill and border swap to the theme tokens, and the icon plus label invert to the on-primary colour; in dark mode everything follows the theme tokens:

<Demo name="backtop-mp-theme" description="Semantic themes: primary / success / warning / danger / info fills with automatic content inversion." />

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

| Prop          | Type                                                                     | Default     | Description                                                |
| ------------- | ------------------------------------------------------------------------ | ----------- | ---------------------------------------------------------- |
| `scrollTop`   | `number`                                                                 | `0`         | Scroll distance, supplied by the host                      |
| `text`        | `string`                                                                 | `''`        | Button label                                               |
| `top`         | `number`                                                                 | `300`       | Visibility threshold in px                                 |
| `duration`    | `number`                                                                 | `100`       | Scroll duration in ms                                      |
| `zIndex`      | `number`                                                                 | `10`        | Stacking level                                             |
| `iconStyle`   | `string`                                                                 | `''`        | Extra icon style, layered over the default upward rotation |
| `shape`       | `'circle' \| 'square'`                                                   | `'circle'`  | Button shape                                               |
| `bottom`      | `number`                                                                 | `100`       | Distance from the bottom edge in px                        |
| `right`       | `number`                                                                 | `20`        | Distance from the right edge in px                         |
| `customStyle` | `string`                                                                 | `''`        | Inline style on the root node                              |
| `customClass` | `string`                                                                 | `''`        | Extra class on the root node                               |
| `size`        | `'small' \| 'medium' \| 'large'`                                         | `'medium'`  | Button tier; the icon follows the icon-size tokens         |
| `theme`       | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | Semantic fill; content inverts automatically               |

## Events

| Event   | Description                                               | Payload          |
| ------- | --------------------------------------------------------- | ---------------- |
| `click` | Button tapped (the host may scroll its own `scroll-view`) | `(event: Event)` |

## Slots

| Slot      | Description           |
| --------- | --------------------- |
| `default` | Custom button content |

## Theme variables

| Variable                                                      | Purpose                             |
| ------------------------------------------------------------- | ----------------------------------- |
| `--sn-mp-color-background-surface`                            | Default button fill                 |
| `--sn-mp-color-border-default`                                | Default button border               |
| `--sn-mp-color-action-primary` / `--sn-mp-color-feedback-*`   | Fill per `theme` value              |
| `--sn-mp-color-text-on-primary`                               | Inverted icon and label on themes   |
| `--sn-mp-color-text-primary` / `--sn-mp-color-text-secondary` | Icon / label colour on the default  |
| `--sn-mp-icon-size-small` / `medium` / `large`                | Icon size per `size` tier           |
| `--sn-mp-shadow-sm`                                           | Button elevation                    |
| `--sn-mp-radius-full` / `--sn-mp-radius-md`                   | Circle / square radius              |
| `--sn-mp-font-size-xs`                                        | Label size                          |
| `--sn-mp-spacing-1` / `--sn-mp-spacing-3`                     | Icon-to-label gap / horizontal padding |

Internally the component routes themes through four local slot variables —
`--sn-backtop-bg` / `--sn-backtop-border` / `--sn-backtop-fg` / `--sn-backtop-label` — which a Style Pack can override as a whole.

## Accessibility

- The root is `role="button"` with `aria-label` from `text` (`Back to top` by default).
- While hidden it also carries `aria-hidden="true"` and swallows taps — a zero-size hit target must not steal touches.
- A long label stays complete in the DOM (for screen readers and search) and is only clipped visually.
- Scrolling goes through `uni.pageScrollTo`; when the host lacks that API the call is skipped and `click` still fires.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

Every colour in `sn-backtop` comes from `--sn-mp-color-*` with no light `var()` fallback, so it adapts automatically under `.sn-theme-dark`: the button fill flips to the dark surface, border and shadow use the dark tokens, and the icon plus label switch to the dark text colours. Themed fills flip along with the same tokens.

Verify it by wrapping in sn-config-provider with `theme="dark"`.

## AI Patch Boundary

| Safe for AI generation                                     | Needs human confirmation                                        |
| ----------------------------------------------------------- | ---------------------------------------------------------------- |
| Numeric surface: `scroll-top` / `top` / `duration` / `z-index` | Splitting scroll duties between the page and a scroll container |
| Static display surface: `text` / `icon-style`                | `default` slot content and post-click host routing / data logic |
| Static tiers: `shape` / `size` / `theme`                     | `bottom` / `right` stacked with nav bars or safe areas          |
| Static combinations in docs and demos                        | Placing the button inside another `position: fixed` container   |

- JSON Patches generated by AI may only touch the static and numeric surface above; they must not inject event handlers, slot content or component internals.

See the component's `ai-description.md` for the full contract.

## Related

- Sticky container: [`sn-sticky`](/en/components/uni/sticky)
- Pagination: [`sn-pagination`](/en/components/uni/pagination)
