# Loading · uni-app

`sn-loading` is the loading indicator of `@snui/uni` (mobile / miniprogram / H5): four spinner shapes (`circular` / `spinner` / `dots` / `wave`), an optional label and a vertical / horizontal layout. Auto-registered through easycom (`components/sn-loading/sn-loading.vue` → `<sn-loading>`); geometry uses `rpx`.

## Basic usage

Defaults to the `circular` ring; `type` switches between the four shapes.

<Demo name="loading-mp-basic" description="circular / spinner / dots / wave — the four spinner shapes." />

## Text, direction and size

- `text` renders the label; the `default` slot takes precedence over `text`
- `direction` lays out spinner + label (default `vertical`)
- `size` is the base size: a number is treated as `rpx`, a string passes through (`'3em'` / `'48rpx'` / `'24px'`)
- `color` overrides the spinner color; `inheritColor` switches to the parent's color

<Demo name="loading-mp-text" description="text label, horizontal layout, size, color and the default slot." />

## Inherited color and custom class names

`inheritColor` inherits the parent color instead; `customClass` / `customStyle` land on the root node while `customSpinnerClass` only targets the spinner box.

<Demo name="loading-mp-custom" description="inherit-color from the parent / root class and inline style / scaling the spinner alone." />

## Props

| Prop                 | Type                                          | Default      | Description                                         |
| -------------------- | --------------------------------------------- | ------------ | --------------------------------------------------- |
| `type`               | `'circular' \| 'spinner' \| 'dots' \| 'wave'` | `'circular'` | Spinner shape                                       |
| `color`              | `string`                                      | `''`         | Spinner color                                       |
| `size`               | `number \| string`                            | `''`         | Base size; a number is rpx, a string passes through |
| `text`               | `string`                                      | `''`         | Loading label                                       |
| `direction`          | `'vertical' \| 'horizontal'`                  | `'vertical'` | Layout direction                                    |
| `inheritColor`       | `boolean`                                     | `false`      | Inherit the parent's color                          |
| `customClass`        | `string`                                      | `''`         | Custom class for the root node                      |
| `customStyle`        | `string`                                      | `''`         | Custom inline style for the root node               |
| `customSpinnerClass` | `string`                                      | `''`         | Custom class for the spinner box                    |

## Events

None — `sn-loading` is purely presentational.

## Slots

| Slot      | Description                              |
| --------- | ---------------------------------------- |
| `default` | Loading label content (overrides `text`) |

## Tokens

| Variable                          | Purpose                                 |
| --------------------------------- | --------------------------------------- |
| `--sn-mp-color-action-primary`    | Default spinner color                   |
| `--sn-mp-color-text-secondary`    | Label color                             |
| `--sn-mp-font-size-md`            | Label size                              |
| `--sn-mp-font-line-height-normal` | Label line height                       |
| `--sn-mp-spacing-3`               | Spinner ↔ label gap / horizontal margin |
| `--sn-mp-radius-xs`               | Bar corners under the Doodle skin       |

## Accessibility

- Root carries `role="status"` + `aria-live="polite"` + `aria-busy="true"`
- The spinner graphic is `aria-hidden="true"`; the label carries the meaning
- No keyboard interaction (mobile indicator)

## Dark mode

The spinner and label use `--sn-mp-color-action-primary` / `--sn-mp-color-text-secondary`, both overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:

## Related

- Progress percentage: [`sn-progress`](/en/components/uni/progress)
- Empty state: [`sn-empty`](/en/components/uni/empty)
