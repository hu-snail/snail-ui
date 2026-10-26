# Statistic · Web

Statistic display (n-statistic aligned): a small label above a large value, with prefix / suffix decorations and tabular numerals.

## When to use

- Highlight a key metric (balance, progress, active users).
- The value needs prefix / suffix context (currency, unit, denominator).
- Rolling numbers should not jitter (pair with `tabular-nums`).

## Basic

<Demo name="statistic-web-basic" description="label + value, prefix / suffix slots and the default slot." />

## API

### SnStatistic Props

| Prop         | Type               | Default     | Notes                                                                 |
| ------------ | ------------------ | ----------- | --------------------------------------------------------------------- |
| label        | `string`           | `undefined` | Label above the value                                                 |
| value        | `string \| number` | `undefined` | Statistic value; takes precedence over the default slot, `0` is valid |
| tabular-nums | `boolean`          | `false`     | Equal-width digits (font-variant-numeric: tabular-nums)               |

### SnStatistic Slots

| Slot    | Notes                                                |
| ------- | ---------------------------------------------------- |
| default | Value content (used only when `value` is not passed) |
| label   | Label (used only when `label` is not passed)         |
| prefix  | Prefix before the value                              |
| suffix  | Suffix after the value                               |

No events. Metrics mirror the naive cssr: label 14px / value 24px / value margin-top 4px / prefix-suffix gutters 4px.

See the component `ai-description.md` for the full contract.
