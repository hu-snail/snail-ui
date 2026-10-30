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

## Shapes

Beyond the square baseline, `shape` offers five special forms: `round` pill, `skew` parallelogram (inner parts are counter-skewed so glyphs stay level), `ribbon` right-end flag, `fold` top-right corner (with a darker flap), and `ticket` side notches. The `round` prop equals `shape="round"`; when both are given, `shape` wins:

<Demo name="tag-mp-shape" description="Six shape values: square, round, skew, ribbon, fold, ticket." />

## Icons

Three icon tracks: a string name resolves through the built-in chain (registry → built-in catalog), so catalog names work without registration; an `IconData` object is imported from `sn-icon-set` and passed straight in; `iconUrl` renders a bitmap `<image>` sized by the icon tiers. Precedence: `icon` slot > `iconUrl` > `icon` > `cssIcon` font glyph:

<Demo name="tag-mp-icon" description="Built-in catalog names (no registration) and IconData objects (named imports from sn-icon-set); iconUrl bitmap icons sized by the icon tiers." />

## Closable / new tag

`closable` renders a close button and emits `close` (it does not bubble into `click`); `dynamic` renders an inline input that emits `confirm`:

<Demo name="tag-mp-closable" description="closable removes filter chips (tap the dashed tag to restore all); dynamic adds tags through the inline input." />

## Custom colours and root styling

`color` overrides the label colour only (inline `color`); `bgColor` overrides fill and border together (`background-color` + `border-color`) — the way to take over with a brand colour outside the semantic palette. `iconPrefix` with `cssIcon` routes a string icon explicitly to the font-glyph path, building the `{iconPrefix}-{icon}` class; a string `cssIcon` becomes the class prefix itself. `customClass` appends a root class and `customStyle` appends root inline style.

<Demo name="tag-mp-color-custom" description="bgColor brand-colour takeover (fill and border change together); color overrides the label only; iconPrefix + cssIcon font-glyph classes; customClass and customStyle." />

## Auto registration (easycom)

The component follows the easycom convention, so **no import is needed in a template**:

```vue
<sn-tag type="primary">Primary</sn-tag>
```

For an explicit import:

```ts
import { SnTag } from '@snui/uni/components/sn-tag/sn-tag.vue';
```

## Props

| Prop          | Type                                                                                                                       | Default     | Description                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| `size`        | `'small' \| 'medium' \| 'large' \| 'extra-large' \| 'default'`                                                             | `'default'` | Tag scale; drives padding and font size                                                      |
| `type`        | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'volcano' \| 'lightblue' \| 'cyan' \| 'pink' \| 'purple'` | `'default'` | Semantic colour                                                                              |
| `icon`        | `string \| IconData`                                                                                                       | `''`        | Left icon: a string resolves through the built-in chain (registry → catalog); an object renders as SVG data directly |
| `iconUrl`     | `string`                                                                                                                   | `''`        | Bitmap icon URL rendered as an `<image>`; wins over `icon`, loses to the `icon` slot          |
| `iconPrefix`  | `string`                                                                                                                   | `''`        | Iconfont class prefix, used when `cssIcon` is on                                             |
| `cssIcon`     | `boolean \| string`                                                                                                        | `false`     | Routes a string icon to the font-glyph path; a string value is the class prefix              |
| `shape`       | `'square' \| 'round' \| 'skew' \| 'ribbon' \| 'fold' \| 'ticket'`                                                          | `'square'`  | Special shape; wins over the `round` sugar                                                   |
| `closable`    | `boolean`                                                                                                                  | `false`     | Render the close button                                                                      |
| `dynamic`     | `boolean`                                                                                                                  | `false`     | Render the inline "new tag" input                                                            |
| `color`       | `string`                                                                                                                   | `''`        | Inline text-colour override                                                                  |
| `bgColor`     | `string`                                                                                                                   | `''`        | Inline background + border-colour override                                                   |
| `round`       | `boolean`                                                                                                                  | `false`     | Pill shape, sugar for `shape="round"`; `shape` wins when both are given                      |
| `mark`        | `boolean`                                                                                                                  | `false`     | Marker shape (asymmetric corners)                                                            |
| `variant`     | `'light' \| 'dark' \| 'plain' \| 'dashed' \| 'text'`                                                                       | `'dark'`    | Fill / border treatment                                                                      |
| `customClass` | `string`                                                                                                                   | `''`        | Extra class on the root node                                                                 |
| `customStyle` | `string`                                                                                                                   | `''`        | Inline style on the root node                                                                |

## Events

| Event     | Description                                        | Payload               |
| --------- | -------------------------------------------------- | --------------------- |
| `click`   | Tapped anywhere on the tag                         | `(event: Event)`      |
| `close`   | Close button tapped (does not bubble into `click`) | `(event: Event)`      |
| `confirm` | Inline input confirmed                             | `({ value: string })` |

## Slots

| Slot      | Description                                               |
| --------- | --------------------------------------------------------- |
| `default` | Tag label                                                 |
| `icon`    | Custom icon; overrides the `icon` prop                    |
| `add`     | Custom "new tag" content, rendered when `dynamic` is true |

## Theme variables

| Variable                                                             | Purpose                      |
| -------------------------------------------------------------------- | ---------------------------- |
| `--sn-mp-color-action-primary` / `--sn-mp-color-action-primary-soft` | `primary` fill and tint      |
| `--sn-mp-color-feedback-success` / `-soft`                           | `success` type               |
| `--sn-mp-color-feedback-warning` / `-soft`                           | `warning` type               |
| `--sn-mp-color-feedback-danger` / `-soft`                            | `danger` type                |
| `--sn-mp-color-feedback-info`                                        | `default` type fill          |
| `--sn-mp-color-volcano` / `-soft`                                    | `volcano` type               |
| `--sn-mp-color-lightblue` / `-soft`                                  | `lightblue` type             |
| `--sn-mp-color-cyan` / `-soft`                                       | `cyan` type                  |
| `--sn-mp-color-pink` / `-soft`                                       | `pink` type                  |
| `--sn-mp-color-purple` / `-soft`                                     | `purple` type                |
| `--sn-mp-color-background-subtle`                                    | `default` type tint          |
| `--sn-mp-color-text-on-primary`                                      | Label colour on a solid fill |
| `--sn-mp-color-text-secondary`                                       | `default` type label colour  |
| `--sn-mp-icon-size-{medium,large,xlarge}`                            | Vector / bitmap icon box     |
| `--sn-mp-font-size-{xs,sm,md,lg}`                                    | Font size per size step      |
| `--sn-mp-font-weight-bold`                                           | Doodle skin weight           |
| `--sn-mp-radius-{sm,md,lg,full}`                                     | Corner / pill / marker shape |
| `--sn-mp-spacing-1`                                                  | Icon-to-label gap            |

## Accessibility

- Root carries `role="button"` — the tag is tappable in every variant.
- The close control is its own `role="button"` with `aria-label="Close"`, so assistive tech reaches it without triggering the tag action.
- Font icons and bitmap icons (`iconUrl`) render inside `aria-hidden="true"`; the label carries the meaning.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## AI Patch Boundary

- AI may patch display configuration: `type` / `size` / `variant` / `shape` / `round` / `mark` / `closable` / `icon` (name or object) / `iconUrl` / `color` / `bgColor` / `customClass` / `customStyle`.
- The label text is `default` slot content (business data) — patches adjust container configuration, not slot structure.
- `close` / `confirm` are events the host reacts to; patches must not fake or suppress them.
- The `shape` special forms are pure visuals (transform / clip-path / mask); renderers without them degrade to the square tag — patches must not rely on shape for layout.

See the component `ai-description.md` for the full contract.

## Dark mode

Every colour in `sn-tag` comes from `--sn-mp-color-*` with no light `var()` fallback, so it adapts automatically under `.sn-theme-dark`:

- The solid (`dark`) variant keeps its fill in dark mode; the label stays white, so contrast is unchanged.
- The tinted (`light`) variant's fill is an alpha tint; the dark block raises that alpha from 12% to 22% so it stays visible on a near-black surface.
- The bordered variants (`plain` / `dashed` / `text`) use the semantic hue directly, which remains recognisable in dark mode.

Verify it by wrapping the tag in a `sn-config-provider` with `theme` set to `dark`:

## Related

- Web end: [`SnTag`](/en/components/web/tag)
- Count marker: [`sn-badge`](/en/components/uni/badge)
