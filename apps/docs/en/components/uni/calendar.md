# Calendar · uni-app

`sn-calendar` is the calendar sheet of `@snui/uni`: `sn-popup` supplies the scrim and animation, optional shortcut chips and a confirm footer sit around the `sn-calendar-view` body. easycom auto-registration (`components/sn-calendar/sn-calendar.vue` → `<sn-calendar>`); geometry in `rpx`. The component owns the draft value and writes `v-model` on confirm; cancel discards the draft.

## When to use

- A date, a date span or several dates must be picked inside a bounded range while the page cannot host a permanent calendar grid.
- The page already has a date entry row (e.g. `sn-cell`) that opens the picker.
- Preset shortcut chips (today / last 7 days / last 30 days) should cut the number of taps.
- Lunar captions (the month name on 初一) help the pick.
- Otherwise: use `sn-calendar-view` for an always-visible panel, `sn-datetime-picker` when only the clock is picked.

## Code demos

### Basic usage

Sheet calendar: rolling only updates the draft and `v-model` is written on confirm; cancel discards the draft. The entry row uses the `sn-cell` card form and shows the confirmed value on the right.

<Demo name="calendar-mp-basic" description="Sheet calendar: rolling only updates the draft and `v-model` is written on confirm; cancel discards the draft." />

### Card entries (cells card pattern)

With `sn-cell`'s `card` on, every row renders as an independent rounded card (radius / border / shadow from tokens) and row spacing is owned by the outer flex gap. Three cards open the `date` / `daterange` / `dates` modes; the last line echoes the confirmed value of all three.

<Demo name="calendar-mp-card" description="Card-form cell entries: date / daterange / dates, one independent card each." />

### Grid & range constraints (`firstDayOfWeek` / `formatter` / `maxRange` / `rangePrompt` / `allowSameDay` / `defaultTime`)

`firstDayOfWeek` moves the week start; `formatter` returns a subset of `{ text, topInfo, bottomInfo, disabled }` to rewrite a cell; `maxRange` caps the span (`0` = unconstrained) and `rangePrompt` is shown when it is exceeded; `allowSameDay` allows a zero-length range; `defaultTime` fills the clock part of a date value. Each constraint gets its own cell card whose right-hand side echoes the matching value.

<Demo name="calendar-mp-grid-range" description="firstDayOfWeek; formatter with custom topInfo / bottomInfo / disabled; maxRange + rangePrompt; allowSameDay; defaultTime." />

### Sheet header slot (`header`, AUI-added)

The `header` slot replaces the default title row at the top of the sheet, so a host can drop a cell summary row (or any richer section) inside the sheet; without the slot the `title` text renders as before. The demo pairs it with `immediate-change` so the in-sheet summary follows the picks live.

<Demo name="calendar-mp-header" description="The header slot replaces the default title row; without it the title text renders as before; combined with immediateChange the summary follows the picks." />

### Shortcut callback & declared props (`onShortcutsClick` / `beforeConfirm`)

`onShortcutsClick` runs after a shortcut chip writes its value and `beforeConfirm` can veto a confirm. `timeFilter` / `hideSecond` / `innerDisplayFormat` / `ellipsis` / `showTypeSwitch` are declared so a configuration written against the surface stays valid; this build has no time roller and no range tabs, so they are **declared but visually inert**.

<Demo name="calendar-mp-hooks-parity" description="onShortcutsClick shortcut callback; beforeConfirm; innerDisplayFormat / ellipsis / showTypeSwitch / hideSecond / timeFilter declared props (unimplemented)." />

### Lunar captions (`showLunar`, AUI-added)

`show-lunar` renders a lunar day name under each day cell (初二, 十五…); 初一 shows the month name (正月 / 闰六月). A `formatter` `bottomInfo` wins over the lunar text. The entry row outside the sheet echoes the Gregorian + lunar pair.

<Demo name="calendar-mp-lunar" description="show-lunar: lunar caption under each cell, month name on 初一; formatter can override." />

### Panel & sheet (`panelHeight` / `switchMode` / `immediateChange` / `showConfirm` / scrim and stacking)

`panelHeight` (px design value) and `showPanelTitle` shape the panel; `switchMode` renders the month / year switcher; `duration` sets the sheet animation; `immediateChange` writes `v-model` as soon as a cell is tapped; `showConfirm=false` leaves only cancel — the `confirm-left` slot on the left of the footer then carries host actions such as a clear button. `closeOnClickModal` / `safeAreaInsetBottom` / `zIndex` / `rootPortal` / `customClass` / `customStyle` are forwarded to `sn-popup`; `customViewClass` lands on the `sn-calendar-view` body.

<Demo name="calendar-mp-panel-sheet" description="panelHeight / showPanelTitle / switchMode / duration; immediateChange; showConfirm=false + the confirm-left slot; closeOnClickModal; safeAreaInsetBottom; zIndex; rootPortal; customClass / customStyle / customViewClass." />

### Shortcuts & range (`shortcuts` / `type`)

`shortcuts` renders preset chips (`days` is relative to today, `value` takes a timestamp); `type="daterange"` picks a span and `confirm-text` renames the confirm action; the first card shows the confirmed span and the second echoes the shortcut chip tapped last.

<Demo name="calendar-mp-shortcuts-range" description="shortcuts renders preset chips (days relative to today); type=daterange picks a span; on-shortcuts-click echoes the last chip tapped." />

## API

### Props

| Prop                                            | Type                                                       | Default                   | Description                                                                 |
| ----------------------------------------------- | ---------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------- |
| `modelValue`                                    | `number \| number[] \| null`                               | `null`                    | Selected value                                                              |
| `visible`                                       | `boolean`                                                  | `false`                   | Sheet visibility                                                            |
| `type`                                          | `CalendarType`                                             | `'date'`                  | Selection mode                                                              |
| `minDate` / `maxDate`                           | `number`                                                   | `undefined`               | Bounds                                                                      |
| `firstDayOfWeek`                                | `number`                                                   | `0`                       | First weekday                                                               |
| `formatter`                                     | `CalendarFormatter`                                        | `undefined`               | Cell formatter hook                                                         |
| `maxRange` / `rangePrompt`                      | `number` / `string`                                        | `0` / `''`                | Range limit + message                                                       |
| `allowSameDay`                                  | `boolean`                                                  | `false`                   | Allow a zero-length range                                                   |
| `defaultTime`                                   | `string \| string[]`                                       | `'00:00:00'`              | Clock time applied to date values                                           |
| `title`                                         | `string`                                                   | `'选择日期'`              | Sheet title (rendered while the `header` slot is unused)                    |
| `closeOnClickModal`                             | `boolean`                                                  | `true`                    | Mask tap closes                                                             |
| `zIndex`                                        | `number`                                                   | `15`                      | Stacking level                                                              |
| `showConfirm` / `confirmText`                   | `boolean` / `string`                                       | `true` / `'确定'`         | Confirm button + label                                                      |
| `shortcuts`                                     | `Array<{ text, value?, days? }>`                           | `[]`                      | Preset chips                                                                |
| `safeAreaInsetBottom`                           | `boolean`                                                  | `true`                    | Safe-area padding                                                           |
| `beforeConfirm`                                 | `(value) => boolean \| Promise<boolean>`                   | `undefined`               | Veto hook                                                                   |
| `customViewClass`                               | `string`                                                   | `''`                      | Panel body class                                                            |
| `immediateChange`                               | `boolean`                                                  | `false`                   | Writes `v-model` on every tap                                               |
| `panelHeight` / `showPanelTitle` / `switchMode` | `number` / `boolean` / `'none' \| 'month' \| 'year-month'` | `316` / `true` / `'none'` | Panel wiring                                                                |
| `showLunar`                                     | `boolean`                                                  | `false`                   | Lunar captions — **AUI-added** (month name on 初一; formatter can override) |
| `duration`                                      | `number`                                                   | `200`                     | Sheet animation duration                                                    |
| `customClass` / `customStyle`                   | `string`                                                   | `''`                      | Root class / inline style                                                   |

> **Not implemented**: `week` / `weekrange` types, `innerDisplayFormat`, `ellipsis`, `showTypeSwitch`, `rootPortal`. `shortcuts` and `onShortcutsClick` ARE implemented (a chip writes a preset value, then the hook fires).

### Events

| Event               | Description                                     | Payload                  |
| ------------------- | ----------------------------------------------- | ------------------------ |
| `update:modelValue` | Confirmed (or every tap with `immediateChange`) | `(value: CalendarValue)` |
| `update:visible`    | Sheet shown / hidden                            | `(value: boolean)`       |
| `confirm`           | Confirm pressed and accepted                    | `{ value }`              |
| `change`            | Selection changed                               | `{ value }`              |
| `cancel` / `open`   | Sheet lifecycle                                 | —                        |

### Slots

| Slot            | Description                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| `header`        | Replaces the default title row at the top of the sheet (a cell summary row fits here) — **AUI-added** |
| `confirm-left`  | Content left of the cancel / confirm actions                                                          |
| `confirm-right` | Content right of the cancel / confirm actions                                                         |

## Theme tokens

| Token                                           | Purpose                          |
| ----------------------------------------------- | -------------------------------- |
| `--sn-mp-color-background-elevated`             | Sheet surface                    |
| `--sn-mp-color-text-primary`                    | Title and day text               |
| `--sn-mp-color-background-soft`                 | Shortcut chip surface            |
| `--sn-mp-color-text-secondary`                  | Shortcut chip / cancel label     |
| `--sn-mp-color-action-primary`                  | Confirm button surface           |
| `--sn-mp-color-text-on-primary`                 | Confirm label                    |
| `--sn-mp-color-border-subtle`                   | Header + footer rules            |
| `--sn-mp-font-size-md` / `--sn-mp-font-size-sm` | Title / chip + button type sizes |
| `--sn-mp-font-weight-semibold`                  | Title and confirm weight         |
| `--sn-mp-spacing-1` / `-2` / `-3` / `-4`        | Chip, button and gutter spacing  |
| `--sn-mp-radius-md` / `--sn-mp-radius-full`     | Button / chip corners            |

## AI Patch Boundary

- AI may patch display and selection configs: `title` / `confirmText` / `type` / `minDate` / `maxDate` / `firstDayOfWeek` / `formatter` / `maxRange` / `rangePrompt` / `allowSameDay` / `defaultTime` / `shortcuts` / `panelHeight` / `showPanelTitle` / `switchMode` / `duration` / `showConfirm` / `showLunar` / `zIndex` / `closeOnClickModal` / `safeAreaInsetBottom` / `immediateChange`.
- `modelValue` is the runtime selection result: a patch may set the initial value, but must not overwrite the draft the user already tapped while the sheet is open; with `immediateChange` every tap writes back, so patches should treat it as runtime state rather than static config.
- `visible` is host interaction state: a patch may set the initial visibility, but must not flip it repeatedly during a user gesture.
- `beforeConfirm` / `onShortcutsClick` are host callbacks: patches should only adjust whether they are declared, never fake a verdict or bypass business logic.
- Slot content (`header` / `confirm-left` / `confirm-right`) is business data: patches should only adjust container configs, never rewrite slot internals.
- `customClass` / `customStyle` / `customViewClass` allow skin and layout tweaks, but must not be used to inject scoped styles that leak into other components.

## Accessibility

- Cancel / confirm are `role="button"` with `aria-label`.
- Shortcut chips are `role="button"` with `aria-label`.
- With the `header` slot in use the slot content owns the sheet's readable title — keep text inside it; without the slot the `title` text plays that role.
- The `confirm-left` / `confirm-right` slots sit in the footer for host content; the host labels its own `role` / `aria-label`.

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light `var()` fallback, so everything adapts under `.sn-theme-dark`: the sheet surface flips to the dark surface, the header and footer rules use the dark border token, the title and day text move to the dark primary text, shortcut chips and the cancel label use the dark secondary text, and the confirm button keeps the brand surface.

Verify it by wrapping the sheet in `sn-config-provider` with `theme="dark"`:

```vue
<sn-config-provider theme="dark">
  <sn-calendar v-model="date" v-model:visible="open" title="Pick a date" />
</sn-config-provider>
```

## Related

- Calendar panel: [`sn-calendar-view`](/en/components/uni/calendar-view)
- Date entry row: [`sn-cell`](/en/components/uni/cell)
- Sheet container: [`sn-popup`](/en/components/uni/popup)
- Theme switching: [`sn-config-provider`](/en/components/uni/config-provider)
