# Input · Web

Controlled input. Renders a native `<input>` / `<textarea>` styled through the token alias layer.

## Basic

<Demo name="input-basic" description="Two-way v-model binding." />

## Types

<Demo name="input-types" description="8 native input types: text / password / email / number / tel / url / search." />

## Sizes

<Demo name="input-sizes" description="4 size presets: tiny / small / medium / large." />

## Status

<Demo name="input-status" description="default / error / warning — driven by FormItem validation, manual override allowed." />

## States

<Demo name="input-states" description="disabled / readonly / required — sets aria-* attributes accordingly." />

## Clearable + Counter

<Demo name="input-clearable-count" description="clearable shows × button; showCount + maxlength renders current / max." />

## Slots

<Demo name="input-slots" description="prefix / suffix / clear-icon / count slots. Combined with SnIcon + lucide." />

## Border / Background / Radius

<Demo name="input-bordered-bg-radius" description="bordered toggles 1px border; bg surface / transparent / soft; radius default / pill / square." />

## Textarea

Multi-line textarea via `type="textarea"`. See input-slots for an inline bio example, or:

```vue
<SnInput v-model="bio" type="textarea" :rows="4" :maxlength="280" show-count />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `''` | v-model value; `type="number"` coerces to number. |
| `type` | `text \| password \| email \| number \| tel \| url \| search \| textarea` | `text` | Native input type; textarea renders multi-line. |
| `size` | `tiny \| small \| medium \| large` | `medium` | Height / font-size. |
| `placeholder` | `string` | `''` | Placeholder text. |
| `disabled` | `boolean` | `false` | Disabled + aria-disabled. |
| `readonly` | `boolean` | `false` | Read-only. |
| `required` | `boolean` | `false` | aria-required="true". |
| `ariaLabel` | `string` | — | Accessible name. |
| `maxlength` | `number` | — | Forwarded. |
| `minlength` | `number` | — | Forwarded. |
| `showCount` | `boolean` | `false` | Show current / max counter. |
| `clearable` | `boolean` | `false` | Show × button. |
| `status` | `default \| error \| warning` | `default` | Border color + aria-invalid. |
| `min / max / step` | `number` | — | Numeric bounds. |
| `rows` | `number` | `3` | Textarea rows. |
| `autosize` | `boolean \| { minRows, maxRows }` | `false` | Auto-grow textarea. |
| `bordered` | `boolean` | `true` | Show 1px border. |
| `bg` | `surface \| transparent \| soft` | `surface` | Background tone. |
| `radius` | `default \| pill \| square` | `default` | Radius preset. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:modelValue` | `(value)` | v-model sync. |
| `input` | `(value, event)` | Native input. |
| `change` | `(value, event)` | Native change. |
| `focus` | `(event: FocusEvent)` | Native focus. |
| `blur` | `(event: FocusEvent)` | Native blur. |
| `clear` | — | × button click. |

## Slots

| Slot | Description |
| --- | --- |
| `prefix` | Left of input. |
| `suffix` | Right of input. |
| `clear-icon` | Custom × button content. |
| `count` | Custom counter (receives `{ current, max }`). |

## Accessibility

| Attribute | Value |
| --- | --- |
| `aria-invalid` | `props.status === 'error'`. |
| `aria-required` | `props.required`. |
| `aria-disabled` | `props.disabled`. |
| Focus animation | border-color + outer ring, 0.18s ease-out; error/warning paints own soft outer ring. |

## Source

Contract shared across ends. Web renderer lives at `@snui/vue-web`, uni renderer at `@snui/uni`.