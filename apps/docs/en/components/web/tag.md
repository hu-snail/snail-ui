# Tag · Web

Tag component (n-tag aligned). Six-color types, closable, checkable,
special shapes, loading state, custom colors.

## Basic

<Demo name="tag-web-basic" description="Six-color type + three sizes + pills." />

## Closable

<Demo name="tag-web-closable" description="close event + internal hide + close-icon slot + blocked while loading." />

## Checkable

<Demo name="tag-web-checkable" description="v-model:checked + type-colored checked state + Enter/Space." />

## Special shapes

<Demo name="tag-web-shapes" description="shape: square / round / skew / ribbon / fold / ticket, combinable with closable / checkable / color." />

`shape` is an AUI-additive capability (registered in AGENTS.md §112.3a):
`skew` (parallelogram), `ribbon` (pointed right end), `fold` (folded corner),
`ticket` (notches on both ends). `round` remains the sugar for
`shape: 'round'`; when both are given, `shape` wins.

## Icon & avatar

<Demo name="tag-web-icon" description="icon slot (replaced by the spinner while loading) + avatar slot." />

## Loading

<Demo name="tag-web-loading" description="loading shows an inline spinner; close and toggle are blocked; aria-busy." />

## Custom colors

<Demo name="tag-web-color" description="color accepts a string or a { color, borderColor, textColor } object; text color is auto-picked for contrast when textColor is omitted." />

## API

### SnTag Props

| Prop      | Type                                                    | Default     | Notes                                                 |
| --------- | ------------------------------------------------------- | ----------- | ----------------------------------------------------- |
| type      | six colors same as Text                                 | `'default'` | Color semantics                                       |
| size      | `'small'\|'medium'\|'large'`                            | `'medium'`  | Size (22/28/34px)                                     |
| shape     | `'square'\|'round'\|'skew'\|'ribbon'\|'fold'\|'ticket'` | `'square'`  | Special shapes (AUI additive)                         |
| round     | `boolean`                                               | `false`     | Pill (= `shape: 'round'`; `shape` wins)               |
| closable  | `boolean`                                               | `false`     | Close button                                          |
| loading   | `boolean`                                               | `false`     | Loading state (AUI additive; blocks close/check)      |
| disabled  | `boolean`                                               | `false`     | Disabled                                              |
| bordered  | `boolean`                                               | `true`      | Border                                                |
| color     | `string \| { color?, borderColor?, textColor? }`        | —           | Custom colors; auto contrast text without `textColor` |
| checkable | `boolean`                                               | `false`     | Selectable                                            |
| checked   | `boolean`                                               | `false`     | v-model:checked (checked state uses the type color)   |

Events: `close` / `update:checked`; Slots: `default` / `icon` / `avatar` /
`close-icon`. Checkable renders `role="button"` + `aria-pressed`, toggled with
Enter/Space; loading sets `aria-busy` and is unfocusable.

See the component `ai-description.md` for the full contract.
