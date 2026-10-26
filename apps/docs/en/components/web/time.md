# Time · Web

Time formatter (n-time aligned): renders a timestamp / Date as datetime, date-only or relative text in a native `<time>` element.

## When to use

- Created / updated timestamps in lists and detail pages.
- Relative descriptions like "3 days ago" (built-in zh-CN wording).
- IANA time-zone display or unix (seconds) input.
- Inline prose via the `text` prop (bare text node).

## Basic

<Demo name="time-web-basic" description="number / Date input, datetime by default." />

### Type

<Demo name="time-web-type" description="type = date / datetime." />

### Format

<Demo name="time-web-format" description="custom format strings (date-fns token subset)." />

### Relative

<Demo name="time-web-relative" description="type = relative, built-in zh-CN wording." />

### Unix

<Demo name="time-web-unix" description="unix interprets input as seconds." />

### Time zone

<Demo name="time-web-timezone" description="time-zone formats per IANA zone." />

## API

### SnTime Props

| Prop      | Type                                 | Default                  | Notes                                                                                        |
| --------- | ------------------------------------ | ------------------------ | -------------------------------------------------------------------------------------------- |
| time      | `number \| Date`                     | `undefined` (mount time) | Time to render                                                                               |
| to        | `number \| Date`                     | `undefined` (mount time) | Base time for relative                                                                       |
| type      | `'relative' \| 'date' \| 'datetime'` | `'datetime'`             | Rendered representation                                                                      |
| unix      | `boolean`                            | `false`                  | Interpret input as unix seconds                                                              |
| format    | `string`                             | `undefined`              | Custom format (yyyy yy MMMM MMM MM M dd d EEEE EEE HH H hh h mm m ss s SSS a + '…' literals) |
| text      | `boolean`                            | `false`                  | Render a bare text node instead of `<time>`                                                  |
| time-zone | `string`                             | `undefined`              | IANA zone, affects formatting only                                                           |

No events, no slots. Divergences from naive: no date-fns dependency (format is a common-token subset), relative wording is built-in zh-CN (formatDistanceStrict equivalent) — see the component `ai-description.md`.
