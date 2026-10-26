# Comment · Web

Comment block with avatar / author / datetime / content / actions, with
nested replies.

## When to use

- Comment threads, Q&A replies, review notes — an avatar + author +
  datetime + body + actions combination
- Nesting child comments (replies) inside the content area
- Controlling the alignment of the datetime row and the actions row
  independently

## Examples

### Basic

<Demo name="comment-web-basic" description="Full avatar / author / datetime / content scene + the actions slot." />

### Alignment

<Demo name="comment-web-align" description="align controls the datetime and actions rows: the string form applies to both, the object form overrides them separately." />

### Nested comments

<Demo name="comment-web-nest" description="Replies go through the default slot and indent under the parent avatar." />

## API

### SnComment Props

| Name     | Type                                                                                 | Default     | Notes                                                                                                                                          |
| -------- | ------------------------------------------------------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| author   | `string`                                                                             | `undefined` | Author name; `author` slot overrides                                                                                                           |
| avatar   | `string`                                                                             | `undefined` | Avatar image URL (rendered 32px circle); `avatar` slot overrides                                                                               |
| content  | `string`                                                                             | `undefined` | Comment body; `content` slot overrides                                                                                                         |
| datetime | `string`                                                                             | `undefined` | Datetime text; `datetime` slot overrides                                                                                                       |
| align    | `'left' \| 'right' \| { datetime?: 'left' \| 'right'; actions?: 'left' \| 'right' }` | `'left'`    | Alignment of the datetime and actions rows: the string form applies to both, the object form overrides each (missing keys fall back to `left`) |

### SnComment Slots

| Name     | Params | Notes                               |
| -------- | ------ | ----------------------------------- |
| avatar   | `()`   | Avatar area, overrides `avatar`     |
| author   | `()`   | Author area, overrides `author`     |
| datetime | `()`   | Datetime area, overrides `datetime` |
| content  | `()`   | Content area, overrides `content`   |
| actions  | `()`   | Actions row (usually plain spans)   |
| default  | `()`   | Nested `<SnComment>` replies        |

The DOM structure matches Arco: avatar column + main column (first row
author + datetime, second row content, third row actions); nested replies
render inside the main column, indented past the parent avatar.

## Known Divergences / Deferred

- No major component library ships a Comment component (verified against
  common registries); this component is an explicit divergence of the
  data-display batch with a DOM structure modelled on comparable
  implementations.
- Slots override same-name props (the Arco source is prop-first); this
  matches the rest of the library (e.g. Thing).
- The reference `editor` (reply input) demo needs Input / Button, which
  this library does not ship yet — registered as future work.
- Typography / metrics follow the Arco less source: body 14px, author
  14px, datetime 12px, actions 14px, 32px circular avatar, 8px actions
  spacing, 20px vertical rhythm between sibling / nested comments.

See the component `ai-description.md` for the full contract.
