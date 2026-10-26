# Tag · uni-app (Mobile)

`sn-tag` is the compact label component of `@snui/uni` (mobile / miniprogram / H5). It carries status words, categories and applied filters. Auto-registered via easycom; geometry uses `rpx` so it scales with the device.

## Basic usage

Ten semantic colours covering both status and category cases:

<Demo name="tag-mp-basic" description="Ten semantic colours: default / primary / success / warning / danger / volcano / lightblue / cyan / pink / purple." />

## Size and shape

Five size steps (`default` is the baseline) combined with the `round` pill and `mark` marker shapes:

<Demo name="tag-mp-size" description="Sizes small / medium / large / extra-large; round pill; mark asymmetric-corner marker." />

## Variants

`variant` controls fill and border, so one `type` can express five levels of emphasis:

<Demo name="tag-mp-variant" description="Five variants: dark solid fill, light tinted fill, plain bordered, dashed dashed border, text label only." />

## Closable / icon / new tag

`closable` renders a close button and emits `close`; `icon` resolves through the icon registry; `dynamic` renders an inline input that emits `confirm`:

<Demo name="tag-mp-closable" description="closable removes a tag; icon uses the Check / Star registry entries; dynamic adds a tag through the inline input." />

## Custom colours, iconfont glyphs and root styling

`color` overrides the label colour only (inline `color`); `bgColor` overrides fill and border together (`background-color` + `border-color`). `iconPrefix` with `cssIcon` builds the `{iconPrefix}-{icon}` iconfont class, and a string `cssIcon` becomes the class prefix itself. `customClass` appends a root class and `customStyle` appends root inline style.

<Demo name="tag-mp-color-custom" description="Inline color / bgColor overrides; the iconfont classes built from iconPrefix + cssIcon; a string cssIcon prefix; customClass and customStyle." />

## Auto registration (easycom)

The component follows the easycom convention, so **no import is needed in a template**:

```vue
<sn-tag type="primary">Primary</sn-tag>
```

For an explicit import:

```ts
import { SnTag } from '@snui/uni/components/sn-tag/sn-tag.vue'
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'small' \| 'medium' \| 'large' \| 'extra-large' \| 'default'` | `'default'` | Tag scale; drives padding and font size |
| `type` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'volcano' \| 'lightblue' \| 'cyan' \| 'pink' \| 'purple'` | `'default'` | Semantic colour |
| `icon` | `string` | `''` | Left icon name (registered via `registerSnIcons()`) |
| `iconPrefix` | `string` | `''` | Iconfont class prefix, used when `cssIcon` is on |
| `cssIcon` | `boolean \| string` | `false` | Render a font icon; a string value is the class prefix |
| `closable` | `boolean` | `false` | Render the close button |
| `dynamic` | `boolean` | `false` | Render the inline "new tag" input |
| `color` | `string` | `''` | Inline text-colour override |
| `bgColor` | `string` | `''` | Inline background + border-colour override |
| `round` | `boolean` | `false` | Pill shape |
| `mark` | `boolean` | `false` | Marker shape (asymmetric corners) |
| `variant` | `'light' \| 'dark' \| 'plain' \| 'dashed' \| 'text'` | `'dark'` | Fill / border treatment |
| `customClass` | `string` | `''` | Extra class on the root node |
| `customStyle` | `string` | `''` | Inline style on the root node |

## Events

| Event | Description | Payload |
| --- | --- | --- |
| `click` | Tapped anywhere on the tag | `(event: Event)` |
| `close` | Close button tapped (does not bubble into `click`) | `(event: Event)` |
| `confirm` | Inline input confirmed | `({ value: string })` |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Tag label |
| `icon` | Custom icon; overrides the `icon` prop |
| `add` | Custom "new tag" content, rendered when `dynamic` is true |

## Theme variables

| Variable | Purpose |
| --- | --- |
| `--sn-mp-color-action-primary` / `--sn-mp-color-action-primary-soft` | `primary` fill and tint |
| `--sn-mp-color-feedback-success` / `-soft` | `success` type |
| `--sn-mp-color-feedback-warning` / `-soft` | `warning` type |
| `--sn-mp-color-feedback-danger` / `-soft` | `danger` type |
| `--sn-mp-color-feedback-info` | `default` type fill |
| `--sn-mp-color-volcano` / `-soft` | `volcano` type |
| `--sn-mp-color-lightblue` / `-soft` | `lightblue` type |
| `--sn-mp-color-cyan` / `-soft` | `cyan` type |
| `--sn-mp-color-pink` / `-soft` | `pink` type |
| `--sn-mp-color-purple` / `-soft` | `purple` type |
| `--sn-mp-color-background-subtle` | `default` type tint |
| `--sn-mp-color-text-on-primary` | Label colour on a solid fill |
| `--sn-mp-color-text-secondary` | `default` type label colour |
| `--sn-mp-font-size-{xs,sm,md,lg}` | Font size per size step |
| `--sn-mp-font-weight-bold` | Doodle skin weight |
| `--sn-mp-radius-{sm,md,lg,full}` | Corner / pill / marker shape |
| `--sn-mp-spacing-1` | Icon-to-label gap |

## Accessibility

- Root carries `role="button"` — the tag is tappable in every variant.
- The close control is its own `role="button"` with `aria-label="Close"`, so assistive tech reaches it without triggering the tag action.
- Font-icon containers are `aria-hidden="true"`; the label carries the meaning.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Dark mode

Every colour in `sn-tag` comes from `--sn-mp-color-*` with no light `var()` fallback, so it adapts automatically under `.sn-theme-dark`:

- The solid (`dark`) variant keeps its fill in dark mode; the label stays white, so contrast is unchanged.
- The tinted (`light`) variant's fill is an alpha tint; the dark block raises that alpha from 12% to 22% so it stays visible on a near-black surface.
- The bordered variants (`plain` / `dashed` / `text`) use the semantic hue directly, which remains recognisable in dark mode.

Verify it by wrapping in sn-config-provider 的 theme 设为 dark:


## Related

- Web end: [`SnTag`](/en/components/web/tag)
- Count marker: [`sn-badge`](/en/components/uni/badge)
