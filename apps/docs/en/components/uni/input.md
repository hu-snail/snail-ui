# Input · uni-app

Cross-end controlled input for uni-app (H5 / WeChat MP / App). Geometry in rpx, tokens drive the surface.

## Basic

<Demo name="input-mp-basic" description="v-model binding." />

## Types

16 native input types, including the mobile-friendly `digit` / `idcard` / `nickname` / `safe-password`.

<Demo name="input-mp-types" description="16 types: text / password / email / number / digit / idcard / nickname / safe-password / tel / url / search / textarea." />

## Sizes

3 tiers `small` / `medium` / `large` (mobile rhythm).

<Demo name="input-mp-sizes" description="3 sizes (rpx: 56/72/88)." />

## Status

<Demo name="input-mp-status" description="default / error / warning." />

## States

<Demo name="input-mp-states" description="disabled / readonly / required + aria-*." />

## Clearable + Counter

<Demo name="input-mp-clearable-count" description="clearable × button; clearTrigger 'always' | 'focus'; showCount / showWordLimit + maxlength counter." />

## Show Password

<Demo name="input-mp-password-toggle" description="type='password' + showPassword renders eye toggle." />

## Prefix / Suffix Icon

<Demo name="input-mp-prefix-suffix" description="prefixIcon / suffixIcon via SnIcon; iconPrefix / iconSuffix / cssIcon css-class fallbacks." />

## Border / Background / Radius

<Demo name="input-mp-bordered-bg-radius" description="border: 'all' | 'bottom' | 'none' (bordered alias); bg / customBg; radius preset." />

## alignRight / compact / inputmode

<Demo name="input-mp-align-compact" description="amount right-align; compact mode; inputmode soft-keyboard hint." />

## MP-only runtime attrs

<Demo name="input-mp-runtime" description="confirm-type / hold-keyboard / adjust-position / always-embed / cursor / selection-start / selection-end / placeholder-style / placeholder-class." />

## Textarea

`type="textarea"` renders multi-line.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `''` | v-model value. |
| `type` | `'text' \| 'number' \| 'digit' \| 'idcard' \| 'safe-password' \| 'nickname' \| 'tel' \| 'password' \| 'email' \| 'url' \| 'search' \| 'textarea'` | `'text'` | Native input type. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | rpx height / font-size. |
| `placeholder` | `string` | `''` | Placeholder text. |
| `placeholderStyle` | `string` | `''` | Inline CSS injected into `::placeholder`. |
| `placeholderClass` | `string` | `''` | Extra class on placeholder. |
| `disabled` | `boolean` | `false` | Disabled. |
| `readonly` | `boolean` | `false` | Read-only. |
| `required` | `boolean` | `false` | aria-required. |
| `maxlength` / `minlength` | `number` | — | Forwarded. |
| `showCount` | `boolean` | `false` | Show counter. |
| `showWordLimit` | `boolean` | `false` | `showCount` wot-ui alias. |
| `clearable` | `boolean` | `false` | × button. |
| `clearTrigger` | `'always' \| 'focus'` | `'always'` | × button visibility trigger. |
| `focusWhenClear` | `boolean` | `true` | Auto-refocus after × click (uni-side placeholder — soft-keyboard dismissal). |
| `showPassword` | `boolean` | `false` | Eye toggle on `type='password'`. |
| `prefixIcon` | `string` | `''` | Front icon name (resolved via SnIcon). |
| `suffixIcon` | `string` | `''` | Tail icon name. |
| `iconPrefix` | `string` | `''` | Front icon CSS class (bypass SnIcon). |
| `iconSuffix` | `string` | `''` | Tail icon CSS class. |
| `cssIcon` | `boolean \| string` | `false` | `true` treats prefix/suffix icon as CSS class. |
| `status` | `'default' \| 'error' \| 'warning'` | `'default'` | Border + aria-invalid. |
| `min` / `max` / `step` | `number` | — | Numeric bounds. |
| `rows` | `number` | `3` | Textarea rows. |
| `border` | `'all' \| 'bottom' \| 'none'` | `'all'` | Border mode (2rpx). |
| `bordered` *(deprecated)* | `boolean` | `true` | Alias: `true / false` ↔ `'all' / 'none'`. |
| `bg` | `'surface' \| 'transparent' \| 'soft'` | `'surface'` | Background tone. |
| `customBg` | `string` | `''` | Inline bg override. |
| `radius` | `'default' \| 'pill' \| 'square'` | `'default'` | Radius preset. |
| `alignRight` | `boolean` | `false` | Right-align value. |
| `compact` | `boolean` | `false` | Compact layout. |
| `focus` | `boolean` | `false` | Auto-focus on mount. |
| `inputmode` | `'none' \| 'text' \| 'decimal' \| 'numeric' \| 'tel' \| 'search' \| 'email' \| 'url'` | `'text'` | Soft-keyboard hint. |
| `customInputClass` | `string` | `''` | Inner `<input>` / `<textarea>` class. |
| `customClass` | `string` | `''` | Root class. |
| `customStyle` | `string \| Record<string,string>` | `''` | Root inline style. |

### MP-only runtime attrs (uni-app compile-time passthrough)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `confirmType` | `'send' \| 'search' \| 'next' \| 'go' \| 'done'` | `'done'` | Soft-keyboard confirm button label. |
| `holdKeyboard` | `boolean` | `false` | Keep keyboard up after field blurs. |
| `adjustPosition` | `boolean` | `true` | Auto-scroll page when keyboard covers field. |
| `alwaysEmbed` | `boolean` | `false` | Input stays mounted even when detached. |
| `cursor` | `number` | `-1` | Initial caret position. `-1` means unset. |
| `selectionStart` | `number` | `-1` | Initial selection range start. |
| `selectionEnd` | `number` | `-1` | Initial selection range end. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:modelValue` | `(value)` | v-model sync. |
| `input` | `(value, event)` | Native input. |
| `change` | `(value, event)` | Native change. |
| `focus` | `(event)` | Native focus. |
| `blur` | `(event)` | Native blur. |
| `clear` | — | × button click. |
| `click` | `(event)` | Root click. |
| `clickPrefixIcon` | `(event)` | Click on prefix icon region. |
| `clickSuffixIcon` | `(event)` | Click on suffix icon region. |
| `confirm` | `(value)` | Soft-keyboard confirm / textarea confirm. |

## Slots

| Slot | Description |
| --- | --- |
| `prefix` | Left of input. |
| `suffix` | Right of input. |
| `prefix-icon` | Custom SnIcon front content (overrides `prefixIcon`). |
| `suffix-icon` | Custom SnIcon tail content. |
| `clear-icon` | Custom × button content. |
| `count` | Custom counter (receives `{ current, max }`). |

## Source

Cross-end protocol shared, uni renderer at `@snui/uni` (`packages/uni/src/components/sn-input/`).