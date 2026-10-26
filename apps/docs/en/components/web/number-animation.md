# NumberAnimation · Web

Animated number (n-number-animation aligned): tweens a number from `from` to `to` with decimal precision, thousand separators and locale support.

## When to use

- Dashboards rolling a number up from 0 to its target.
- Pair with SnStatistic `tabular-nums` to avoid jitter.
- Manual replay via the exposed `play()` method.

## Basic

<Demo name="number-animation-web-basic" description="Rolling inside SnStatistic + play() replay." />

### Precision

<Demo name="number-animation-web-precision" description="precision keeps decimal digits." />

### Separator

<Demo name="number-animation-web-separator" description="show-separator groups thousands." />

### Locale

<Demo name="number-animation-web-intl" description="locale drives decimal marks / separators (Intl.NumberFormat)." />

### Finish

<Demo name="number-animation-web-finish" description="finish fires when the tween reaches `to`." />

## API

### SnNumberAnimation Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| from | `number` | `0` | Start value |
| to | `number` | `0` | Target value |
| precision | `number` | `0` | Decimal digits |
| show-separator | `boolean` | `false` | Group the integer part |
| locale | `string` | `undefined` | BCP-47 locale (defaults to the runtime locale) |
| active | `boolean` | `true` | Play the animation (restarts from `from`) |
| duration | `number` | `2000` | Animation duration in ms (non-reactive) |

### SnNumberAnimation Events

| Event | Parameters | Notes |
| --- | --- | --- |
| finish | — | The animation reached `to` |

### SnNumberAnimation Methods

| Method | Parameters | Notes |
| --- | --- | --- |
| play | — | Replay; ignored while running |

See the component `ai-description.md` for the full contract.
