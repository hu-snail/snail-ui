# Tag · Web

Tag (n-tag aligned). Six-color types, closable, checkable.

## Basic

<Demo name="tag-web-basic" description="Six-color type + three sizes." />

## Closable

<Demo name="tag-web-closable" description="close event + internal hide." />

## Checkable

<Demo name="tag-web-checkable" description="v-model:checked + Enter/Space." />

## Shapes

<Demo name="tag-web-shapes" description="round / bordered / disabled / custom color." />

## API

### SnTag Props

| Prop      | Type                         | Default     | Notes                              |
| --------- | ---------------------------- | ----------- | ---------------------------------- |
| type      | six colors same as Text      | `'default'` | Color semantics                    |
| size      | `'small'\|'medium'\|'large'` | `'medium'`  | Size (22/28/34px)                  |
| closable  | `boolean`                    | `false`     | Close button                       |
| disabled  | `boolean`                    | `false`     | Disabled                           |
| bordered  | `boolean`                    | `true`      | Border                             |
| round     | `boolean`                    | `false`     | Pill                               |
| color     | `string`                     | —           | Custom background (overrides type) |
| checkable | `boolean`                    | `false`     | Selectable                         |
| checked   | `boolean`                    | `false`     | v-model:checked                    |

Events: `close` / `update:checked`; Slots: `default`. Checkable renders `role="button"` + `aria-pressed`, toggled with Enter/Space.

See the component `ai-description.md` for the full contract.
