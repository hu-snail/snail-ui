# SnList — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end list component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A generic list container with header/footer areas and flex rows
(prefix / main / suffix), plus divider, border, hover and click-cursor
modes. Used for feeds, settings rows, notification lists.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-list` (https://www.naiveui.com/zh-CN/light/components/list).

## Import

```ts
import SnList from '@snui/vue-web/src/list/SnList.vue';
import SnListItem from '@snui/vue-web/src/list/SnListItem.vue';
```

## Props (SnList)

| Name           | Type                             | Default    | Required | Description                                                                                |
| -------------- | -------------------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------ |
| `size`         | `'small' \| 'medium' \| 'large'` | `'medium'` | no       | Size marker (emitted as a modifier class; no metric change, matching the reference theme). |
| `bordered`     | `boolean`                        | `false`    | no       | Outer border with rounded corners; rows get 12px 20px padding.                             |
| `clickable`    | `boolean`                        | `false`    | no       | Rows get the pointer cursor.                                                               |
| `hoverable`    | `boolean`                        | `false`    | no       | Rows highlight on hover; dividers hide under the hovered row.                              |
| `show-divider` | `boolean`                        | `true`     | no       | 1px divider between rows.                                                                  |

## Slots

| Component  | Name      | Description                               |
| ---------- | --------- | ----------------------------------------- |
| SnList     | `default` | `<SnListItem>` rows.                      |
| SnList     | `header`  | Header area (bordered off from the rows). |
| SnList     | `footer`  | Footer area.                              |
| SnListItem | `default` | Row main content.                         |
| SnListItem | `prefix`  | Row leading content.                      |
| SnListItem | `suffix`  | Row trailing content.                     |

## Events

None — composition component (attach click handlers to row content).

## Divergences from the reference API

- An item rendered outside a list degrades to a standalone row
  (divider on); the reference throws in dev.

## Accessibility

- Renders a real `<ul>` / `<li>` structure.
- Header / footer are list items of the same `<ul>` (reference parity).

## Tokens Consumed (end: web)

| Token                       | CSS Variable                    | Purpose                      |
| --------------------------- | ------------------------------- | ---------------------------- |
| Text secondary              | `--sn-web-color-text-secondary` | Row text                     |
| Background surface / subtle | `--sn-web-color-background-*`   | List background / hover tint |
| Border subtle               | `--sn-web-color-border-subtle`  | Dividers + border            |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-012.
