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

Name mode renders through the SnIcon resolution chain (`registerSnIcons` registry → built-in catalogue → provider); size and color follow `--sn-input-icon-size` / `--sn-input-icon-color`. `cssIcon` mode treats the name as a plain CSS class instead.

<Demo name="input-mp-prefix-suffix" description="prefixIcon / suffixIcon through the SnIcon resolution chain; iconPrefix / iconSuffix / cssIcon css-class fallbacks." />

## Radius (`radius`)

Radius tiers map to the shared `--sn-mp-radius-*` tokens; `pill` is the search-bar shape, `square` is right-angled.

<Demo name="input-mp-radius" description="radius: 'default' | 'sm' | 'lg' | 'xl' | 'pill' | 'square', tiers map to --sn-mp-radius-*." />

## Border / Background

<Demo name="input-mp-bordered-bg-radius" description="border: 'all' | 'bottom' | 'none' (bordered alias); bg: 'surface' | 'transparent' | 'soft'; customBg." />

## alignRight / compact / inputmode

<Demo name="input-mp-align-compact" description="amount right-align; compact mode; inputmode soft-keyboard hint." />

## MP-only runtime attrs

<Demo name="input-mp-runtime" description="confirm-type / hold-keyboard / adjust-position / always-embed / cursor / selection-start / selection-end / placeholder-style / placeholder-class." />

## Clear & focus details (`clearTrigger` / `focusWhenClear` / `focus` / `placeholderClass` / `placeholderStyle`)

`clearTrigger="focus"` shows the × only while focused; `focusWhenClear` decides whether the field re-focuses after clearing; `focus` focuses on mount; `placeholderClass` / `placeholderStyle` restyle the placeholder.

<Demo name="input-mp-clear-focus" description="clearTrigger always / focus; focusWhenClear; focus on mount; placeholderClass + placeholderStyle." />

## Word-count alias (`showWordLimit`)

`showWordLimit` is an alias of `showCount`; both are equivalent and both need `maxlength`.

<Demo name="input-mp-word-limit" description="showWordLimit + maxlength; equivalent to showCount." />

## Native keyboard attrs (`cursorSpacing` / `confirmHold` / `ignoreCompositionEvent` / `enableNative`)

`cursorSpacing` sets the caret-to-keyboard gap, `confirmHold` keeps the keyboard up on confirm, `ignoreCompositionEvent=false` lets `input` fire mid-composition and `enableNative=false` makes Alipay MP use the simulated field.

<Demo name="input-mp-native-attrs" description="cursorSpacing; confirmHold; ignoreCompositionEvent=false; enableNative=false." />

## Custom style mount points (`customClass` / `customStyle` / `customInputClass`)

`customClass` / `customStyle` land on the root node; `customInputClass` lands on the inner native `<input>` / `<textarea>`.

<Demo name="input-mp-custom-class" description="customClass + customStyle on the root; customInputClass on the inner native field." />

## Textarea

`type="textarea"` renders multi-line.

## Props

| Prop                      | Type                                                                                                                                              | Default     | Description                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------- |
| `modelValue`              | `string \| number`                                                                                                                                | `''`        | v-model value.                                                                            |
| `type`                    | `'text' \| 'number' \| 'digit' \| 'idcard' \| 'safe-password' \| 'nickname' \| 'tel' \| 'password' \| 'email' \| 'url' \| 'search' \| 'textarea'` | `'text'`    | Native input type.                                                                        |
| `size`                    | `'small' \| 'medium' \| 'large'`                                                                                                                  | `'medium'`  | rpx height / font-size.                                                                   |
| `placeholder`             | `string`                                                                                                                                          | `''`        | Placeholder text.                                                                         |
| `placeholderStyle`        | `string`                                                                                                                                          | `''`        | Inline placeholder styling (native `placeholder-style` passthrough; no pseudo-element on App).                                                 |
| `placeholderClass`        | `string`                                                                                                                                          | `''`        | Extra class on placeholder.                                                               |
| `disabled`                | `boolean`                                                                                                                                         | `false`     | Disabled.                                                                                 |
| `readonly`                | `boolean`                                                                                                                                         | `false`     | Read-only.                                                                                |
| `required`                | `boolean`                                                                                                                                         | `false`     | aria-required.                                                                            |
| `maxlength` / `minlength` | `number`                                                                                                                                          | —           | Forwarded.                                                                                |
| `showCount`               | `boolean`                                                                                                                                         | `false`     | Show counter.                                                                             |
| `showWordLimit`           | `boolean`                                                                                                                                         | `false`     | `showCount` alias.                                                                        |
| `clearable`               | `boolean`                                                                                                                                         | `false`     | × button.                                                                                 |
| `clearTrigger`            | `'always' \| 'focus'`                                                                                                                             | `'always'`  | × button visibility trigger.                                                              |
| `focusWhenClear`          | `boolean`                                                                                                                                         | `true`      | Re-focus the field after × click (H5 focuses directly; MP keyboards open on tap).        |
| `showPassword`            | `boolean`                                                                                                                                         | `false`     | Eye toggle on `type='password'`.                                                          |
| `prefixIcon`              | `string`                                                                                                                                          | `''`        | Front icon name (resolved via SnIcon).                                                    |
| `suffixIcon`              | `string`                                                                                                                                          | `''`        | Tail icon name.                                                                           |
| `iconPrefix`              | `string`                                                                                                                                          | `''`        | Front icon CSS class (bypass SnIcon).                                                     |
| `iconSuffix`              | `string`                                                                                                                                          | `''`        | Tail icon CSS class.                                                                      |
| `cssIcon`                 | `boolean \| string`                                                                                                                               | `false`     | `true` treats prefix/suffix icon as CSS class.                                            |
| `status`                  | `'default' \| 'error' \| 'warning'`                                                                                                               | `'default'` | Border + aria-invalid.                                                                    |
| `min` / `max` / `step`    | `number`                                                                                                                                          | —           | Numeric bounds.                                                                           |
| `rows`                    | `number`                                                                                                                                          | `3`         | Textarea rows.                                                                            |
| `border`                  | `'all' \| 'bottom' \| 'none'`                                                                                                                     | `'all'`     | Border mode (2rpx).                                                                       |
| `bordered` _(deprecated)_ | `boolean`                                                                                                                                         | `true`      | Alias: `true / false` ↔ `'all' / 'none'`.                                                 |
| `bg`                      | `'surface' \| 'transparent' \| 'soft'`                                                                                                            | `'surface'` | Background tone.                                                                          |
| `customBg`                | `string`                                                                                                                                          | `''`        | Inline bg override.                                                                       |
| `radius`                  | `'default' \| 'sm' \| 'lg' \| 'xl' \| 'pill' \| 'square'`                                                                                       | `'default'` | Radius tier (maps to `--sn-mp-radius-*`; `default` = `--sn-mp-input-radius`).             |
| `alignRight`              | `boolean`                                                                                                                                         | `false`     | Right-align value.                                                                        |
| `compact`                 | `boolean`                                                                                                                                         | `false`     | Compact layout.                                                                           |
| `focus`                   | `boolean`                                                                                                                                         | `false`     | Auto-focus on mount.                                                                      |
| `inputmode`               | `'none' \| 'text' \| 'decimal' \| 'numeric' \| 'tel' \| 'search' \| 'email' \| 'url'`                                                             | `'text'`    | Soft-keyboard hint.                                                                       |
| `customInputClass`        | `string`                                                                                                                                          | `''`        | Inner `<input>` / `<textarea>` class.                                                     |
| `customClass`             | `string`                                                                                                                                          | `''`        | Root class.                                                                               |
| `customStyle`             | `string \| Record<string,string>`                                                                                                                 | `''`        | Root inline style.                                                                        |
| `error`                   | `boolean`                                                                                                                                         | `false`     | Error chrome: `sn-input--error` class + `aria-invalid` (same visual as `status="error"`). |

### MP-only runtime attrs (uni-app compile-time passthrough)

| Prop                     | Type                                             | Default  | Description                                                                 |
| ------------------------ | ------------------------------------------------ | -------- | --------------------------------------------------------------------------- |
| `confirmType`            | `'send' \| 'search' \| 'next' \| 'go' \| 'done'` | `'done'` | Soft-keyboard confirm button label.                                         |
| `holdKeyboard`           | `boolean`                                        | `false`  | Keep keyboard up after field blurs.                                         |
| `adjustPosition`         | `boolean`                                        | `true`   | Auto-scroll page when keyboard covers field.                                |
| `alwaysEmbed`            | `boolean`                                        | `false`  | Input stays mounted even when detached.                                     |
| `cursor`                 | `number`                                         | `-1`     | Initial caret position. `-1` means unset.                                   |
| `selectionStart`         | `number`                                         | `-1`     | Initial selection range start.                                              |
| `selectionEnd`           | `number`                                         | `-1`     | Initial selection range end.                                                |
| `cursorSpacing`          | `number`                                         | `0`      | Gap between the caret and the soft keyboard.                                |
| `confirmHold`            | `boolean`                                        | `false`  | Keep the keyboard up after the confirm key.                                 |
| `ignoreCompositionEvent` | `boolean`                                        | `true`   | Ignore IME composition events (`false` also fires `input` mid-composition). |
| `enableNative`           | `boolean`                                        | `true`   | Alipay MP: use the native input widget.                                     |

## Events

| Event               | Payload          | Notes                                     |
| ------------------- | ---------------- | ----------------------------------------- |
| `update:modelValue` | `(value)`        | v-model sync.                             |
| `input`             | `(value, event)` | Native input.                             |
| `change`            | `(value, event)` | Native change.                            |
| `focus`             | `(event)`        | Native focus.                             |
| `blur`              | `(event)`        | Native blur.                              |
| `clear`             | —                | × button click.                           |
| `click`             | `(event)`        | Root click.                               |
| `clickPrefixIcon`   | `(event)`        | Click on prefix icon region.              |
| `clickSuffixIcon`   | `(event)`        | Click on suffix icon region.              |
| `confirm`           | `(value)`        | Soft-keyboard confirm / textarea confirm. |

## Slots

| Slot          | Description                                           |
| ------------- | ----------------------------------------------------- |
| `prefix`      | Left of input.                                        |
| `suffix`      | Right of input.                                       |
| `prefix-icon` | Custom SnIcon front content (overrides `prefixIcon`). |
| `suffix-icon` | Custom SnIcon tail content.                           |
| `clear-icon`  | Custom × button content.                              |
| `count`       | Custom counter (receives `{ current, max }`).         |

## Tokens

Every glyph inside the field (prefix / suffix / clear × / password eye) shares one size and one color; override on any ancestor:

| Token                    | Default                            | Description                              |
| ------------------------ | ---------------------------------- | ---------------------------------------- |
| `--sn-input-icon-size`   | `var(--sn-mp-icon-size-medium)`    | In-field icon edge length (32rpx).       |
| `--sn-input-icon-color`  | `var(--sn-mp-color-text-tertiary)` | In-field icon color.                     |
| `--sn-mp-input-radius`   | `12rpx`                            | Default radius (`radius="default"`).     |
| `--sn-mp-input-padding-x`| `20rpx`                            | Horizontal padding.                      |
| `--sn-mp-input-bg`       | `--sn-mp-color-background-surface` | Background (`bg="surface"`).             |

## Source

Cross-end protocol shared, uni renderer at `@snui/uni` (`packages/uni/src/components/sn-input/`).
