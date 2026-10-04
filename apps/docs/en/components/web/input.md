# Input · Web

Controlled input. Renders a native `<input>` / `<textarea>` styled through the token alias layer.

## Basic

<Demo name="input-basic" description="Two-way v-model binding." />

## Types

12 native input types, including the mobile-friendly `digit` / `idcard` / `nickname` / `safe-password`.

<Demo name="input-types" description="12 types: text / password / email / number / digit / idcard / nickname / safe-password / tel / url / search / textarea." />

## Sizes

5 tiers `tiny` / `small` / `medium` / `large` / `huge`, mapped to `--sn-web-input-height-{size}`.

<Demo name="input-sizes" description="5 height tiers, covering compact search to hero forms." />

## Status

<Demo name="input-status" description="default / error / warning — driven by FormItem validation, manual override allowed." />

## States

<Demo name="input-states" description="disabled / readonly / required — sets aria-* attributes accordingly." />

## Clearable + Counter

<Demo name="input-clearable-count" description="clearable × button; clearTrigger 'always' | 'focus'; showCount / showWordLimit + maxlength." />

## Show Password

<Demo name="input-password-toggle" description="type='password' + showPassword renders eye toggle." />

## Prefix / Suffix Icon

<Demo name="input-prefix-suffix" description="prefixIcon / suffixIcon rendered through SnIcon; cssIcon falls back to CSS class." />

## Border / Background / Radius

<Demo name="input-bordered-bg-radius" description="border: 'all' | 'bottom' | 'none' (bordered alias); bg / customBg; radius preset." />

## alignRight / compact / inputmode

<Demo name="input-align-compact" description="amount-field right-align; compact mode; inputmode soft-keyboard hint." />

## customClass / customStyle / customInputClass

<Demo name="input-custom" description="Three class / style hooks at root / inner / via slot." />

## Textarea

Multi-line textarea via `type="textarea"`. See input-slots for an inline bio example, or:

```vue
<SnInput v-model="bio" type="textarea" :rows="4" :maxlength="280" show-count />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `''` | v-model value; `type="number"` coerces to number. |
| `type` | `'text' \| 'number' \| 'digit' \| 'idcard' \| 'safe-password' \| 'nickname' \| 'tel' \| 'password' \| 'email' \| 'url' \| 'search' \| 'textarea'` | `'text'` | Native input type; textarea renders multi-line. |
| `size` | `'mini' \| 'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Height / font-size. `mini` is wot-ui-parity. |
| `placeholder` | `string` | `''` | Placeholder text. |
| `placeholderStyle` | `string` | `''` | Inline CSS injected into `::placeholder` pseudo-element. |
| `placeholderClass` | `string` | `''` | Extra class on placeholder pseudo-element. |
| `disabled` | `boolean` | `false` | Disabled + aria-disabled. |
| `readonly` | `boolean` | `false` | Read-only. |
| `required` | `boolean` | `false` | aria-required="true". |
| `ariaLabel` | `string` | — | Accessible name. |
| `maxlength` | `number` | — | Forwarded. |
| `minlength` | `number` | — | Forwarded. |
| `showCount` | `boolean` | `false` | Show current / max counter. |
| `showWordLimit` | `boolean` | `false` | Alias for `showCount` (wot-ui). |
| `clearable` | `boolean` | `false` | Show × button. |
| `clearTrigger` | `'always' \| 'focus'` | `'always'` | When × shows: `focus` only on focus. |
| `focusWhenClear` | `boolean` | `true` | Auto-refocus after × click. |
| `showPassword` | `boolean` | `false` | Eye toggle on `type='password'`. |
| `prefixIcon` | `string` | `''` | Front icon name (resolved via SnIcon). |
| `suffixIcon` | `string` | `''` | Tail icon name. |
| `cssIcon` | `boolean \| string` | `false` | `true` treats prefix/suffix icon as CSS class (bypass SnIcon). |
| `status` | `'default' \| 'error' \| 'warning'` | `'default'` | Border color + aria-invalid. |
| `min` / `max` / `step` | `number` | — | Numeric bounds. |
| `rows` | `number` | `3` | Textarea rows. |
| `border` | `'all' \| 'bottom' \| 'none'` | `'all'` | Border mode. `all` four sides, `bottom` only bottom (inline form row), `none` no border. |
| `bordered` *(deprecated)* | `boolean` | `true` | Alias: `true === 'all'`, `false === 'none'`. |
| `bg` | `'surface' \| 'transparent' \| 'soft'` | `'surface'` | Background tone. |
| `customBg` | `string` | `''` | Inline `background-color` override. |
| `radius` | `'default' \| 'pill' \| 'square'` | `'default'` | Radius preset. |
| `alignRight` | `boolean` | `false` | Right-align value (amount fields). |
| `compact` | `boolean` | `false` | Strip padding + bg so input nests inside FormItem. |
| `focus` | `boolean` | `false` | Auto-focus on mount. |
| `inputmode` | `'none' \| 'text' \| 'decimal' \| 'numeric' \| 'tel' \| 'search' \| 'email' \| 'url'` | `'text'` | Soft-keyboard hint. |
| `customInputClass` | `string` | `''` | Inner `<input>` / `<textarea>` extra class. |
| `customClass` | `string` | `''` | Root extra class. |
| `customStyle` | `string \| Record<string,string>` | `''` | Root inline style. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:modelValue` | `(value)` | v-model sync. |
| `input` | `(value, event)` | Native input. |
| `change` | `(value, event)` | Native change. |
| `focus` | `(event: FocusEvent)` | Native focus. |
| `blur` | `(event: FocusEvent)` | Native blur. |
| `clear` | — | × button click. |
| `click` | `(event: MouseEvent)` | Root click (e.g. for embedded popup). |
| `clickPrefixIcon` | `(event: MouseEvent)` | Click on prefixIcon region. |
| `clickSuffixIcon` | `(event: MouseEvent)` | Click on suffixIcon region. |
| `confirm` | `(value: string \| number)` | Enter on single-line input. |

## Slots

| Slot | Description |
| --- | --- |
| `prefix` | Left of input. Overrides `prefixIcon`. |
| `suffix` | Right of input. Overrides `suffixIcon`. |
| `clear-icon` | Custom × button content. |
| `count` | Custom counter (receives `{ current, max }`). |

## Accessibility

| Attribute | Value |
| --- | --- |
| `aria-invalid` | `props.status === 'error'`. |
| `aria-required` | `props.required`. |
| `aria-disabled` | `props.disabled`. |
| Focus animation | border-color + outer ring, 0.18s ease-out; error/warning paints own soft outer ring. |
| Placeholder color | Distinct from input text (`--sn-web-input-placeholder-color` resolves to `text-tertiary`). |

## Source

Renderer lives at `@snui/vue-web`; uni mirror at `@snui/uni`.