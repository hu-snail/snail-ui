# sn-loading — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-loading component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Loading indicator for mobile / miniprogram with four spinner shapes
(`circular` / `spinner` / `dots` / `wave`), an optional text line and a
vertical / horizontal layout. Pure presentation — it never fetches data and has
no open / close state.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-loading`
(https://wot-ui.cn/component/loading.html). New props added here MUST also be
added to the wd-loading parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-loading type="wave" text="加载中" />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnLoading } from '@snui/uni';
```

## Props

| Name                 | Type                                          | Default      | Required | Description                                                |
| -------------------- | --------------------------------------------- | ------------ | -------- | ---------------------------------------------------------- |
| `type`               | `'circular' \| 'spinner' \| 'dots' \| 'wave'` | `'circular'` | no       | Spinner shape.                                             |
| `color`              | `string`                                      | `''`         | no       | Spinner color override (any CSS color value).              |
| `size`               | `number \| string`                            | `''`         | no       | Base size; a bare number is rpx, a string passes through.  |
| `text`               | `string`                                      | `''`         | no       | Text shown next to / below the spinner.                    |
| `direction`          | `'vertical' \| 'horizontal'`                  | `'vertical'` | no       | Layout direction of spinner + text.                        |
| `inheritColor`       | `boolean`                                     | `false`      | no       | Inherit the parent's `color` instead of the token default. |
| `customClass`        | `string`                                      | `''`         | no       | Custom class for the root node.                            |
| `customStyle`        | `string`                                      | `''`         | no       | Custom inline style for the root node.                     |
| `customSpinnerClass` | `string`                                      | `''`         | no       | Custom class for the spinner box only.                     |

## Events

None — `sn-loading` is purely presentational.

## Slots

| Name      | Description                              |
| --------- | ---------------------------------------- |
| `default` | Loading text content (overrides `text`). |

## Tokens Consumed (end: mp)

| Token              | CSS Variable                      | Purpose                                 |
| ------------------ | --------------------------------- | --------------------------------------- |
| Action primary     | `--sn-mp-color-action-primary`    | Default spinner color                   |
| Text secondary     | `--sn-mp-color-text-secondary`    | Label color                             |
| Font size MD       | `--sn-mp-font-size-md`            | Label size                              |
| Line height normal | `--sn-mp-font-line-height-normal` | Label line height                       |
| Spacing 3          | `--sn-mp-spacing-3`               | Spinner ↔ label gap / horizontal margin |
| Radius XS          | `--sn-mp-radius-xs`               | Doodle skin bar corners                 |

## Accessibility

- Root carries `role="status"`, `aria-live="polite"` and `aria-busy="true"`
- The spinner graphic is `aria-hidden="true"` — the label carries the meaning
- No keyboard interaction (mobile indicator)

## Versioning

`@snui/uni@0.4.0` — initial release. Part of the M1 feedback-category uni
components (popup / overlay / loading / progress / empty).
