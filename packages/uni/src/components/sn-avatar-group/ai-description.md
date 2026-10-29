# sn-avatar-group — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-avatar-group component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-avatar-group`, prop surface
> mirrored 1:1 (`max-count` / `cascading` / `shape` / `size` / `collapse-avatar`
> / `vertical` / `custom-class` / `custom-style`, default slot).

## Purpose

Overlapping avatar stack with an overflow collapse bubble (`+N`). Members are
plain `sn-avatar` elements in the default slot; the group owns the uniform
size / shape, the cascade direction and the max-count collapse.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-avatar-group :max-count="3">
  <sn-avatar v-for="user in users" :key="user.id" :src="user.avatar" />
</sn-avatar-group>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnAvatarGroup } from '@snui/uni/components/sn-avatar-group/sn-avatar-group.vue';
```

## Props

| Name             | Type                      | Default     | Required | Description                                                     |
| ---------------- | ------------------------- | ----------- | -------- | --------------------------------------------------------------- |
| `maxCount`       | `number`                  | `undefined` | no       | 最大显示数量（含折叠头像占用的 1 个位置），超出后显示折叠头像。 |
| `cascading`      | `'left-up' \| 'right-up'` | `'left-up'` | no       | 叠层方向（垂直模式下忽略）。                                    |
| `collapseAvatar` | `string`                  | `''`        | no       | 折叠头像显示文本；留空时自动显示 `+{hidden}`。                  |
| `vertical`       | `boolean`                 | `false`     | no       | 是否垂直展示。                                                  |
| `shape`          | `'round' \| 'square'`     | `'round'`   | no       | 统一设置组内头像形状（覆盖成员自身的 shape）。                  |
| `size`           | `string \| number`        | `'normal'`  | no       | 统一设置组内头像尺寸（覆盖成员自身的 size）。                   |
| `customClass`    | `string`                  | `''`        | no       | 根节点自定义类名。                                              |
| `customStyle`    | `string`                  | `''`        | no       | 根节点自定义 inline style。                                     |

## Slots

| Name      | Description                       |
| --------- | --------------------------------- |
| `default` | 头像列表，放置 `sn-avatar` 组件。 |

## Overflow rule

`max-count` 计的是「占位数」：超出后组内显示 `max-count − 1` 个头像 + 1 个折叠
气泡（合计仍为 `max-count` 个可见位），气泡文本为 `collapse-avatar`，未提供时
显示 `+{隐藏数量}`。与 web 端 `SnAvatarGroup`（naive-ui 规则）保持跨端一致。

约束：`size` 必须可解析为长度（预设名 / 数值 px / `rpx` / `px` 字符串）。百分比
等无法测量的尺寸会让 `max-count` 失效（全部显示、无气泡）——这是文档化的可预期
回退，不是静默行为变化。

## Cross-end notes

- 组内头像通过 provide/inject 接收统一的 size / shape；叠层间距与分隔环通过
  继承的 CSS 变量（`--sn-avatar-group-overlap-left/-top`、
  `--sn-avatar-group-ring`）下发，成员头像自绘 —— 不使用 `:deep()`（App 端无法
  表达，AGENTS.md §116.2）。
- 超出数量的头像由裁剪窗口隐藏，不重渲染 slot vnode（MP 编译器不支持动态组件）。

## Tokens Consumed (end: mp)

| Token              | CSS Variable                       | Purpose    |
| ------------------ | ---------------------------------- | ---------- |
| Background surface | `--sn-mp-color-background-surface` | 分隔环颜色 |

## Accessibility

- 组本身是纯布局容器（无 role）；可访问名称由各成员 `sn-avatar` 自行提供。
- 折叠气泡是一个文本头像，读作 `+3` 或自定义文本。

## Versioning

`@snui/uni@0.1.0` — initial release. Display-family component.
