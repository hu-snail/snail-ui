# AvatarGroup 头像组（uni 端 / 移动端）

`sn-avatar-group` 是 `@snui/uni`（移动端 / 小程序 / H5）的头像叠层组件：把一列 `sn-avatar` 叠成一排（或一列）带头像组，超出 `max-count` 的部分折叠为一个 `+N` 气泡。API 与 wot-ui `wd-avatar-group` 1:1。

## 基础用法

<Demo name="avatar-mp-group" description="最大数量折叠（max-count）、自定义折叠文本（collapse-avatar）、叠层方向（cascading）、垂直堆叠（vertical）与统一尺寸 / 形状。" />

```vue
<sn-avatar-group :max-count="3">
  <sn-avatar v-for="user in users" :key="user.id" :src="user.avatar" />
</sn-avatar-group>
```

## 最大数量与折叠文本

`max-count` 计的是**占位数**：超出后组内显示 `max-count − 1` 个头像 + 1 个折叠气泡（合计仍是 `max-count` 个可见位），气泡显示 `collapse-avatar`；未提供时自动显示 `+{隐藏数量}`。

- `max-count="3"`、5 个头像 → 2 个头像 + `+3`
- `collapse-avatar="B+1"` → 2 个头像 + `B+1`（文本原样展示）

`size` 必须可解析为长度（预设名 / 数值 px / `rpx` / `px` 字符串）。百分比等无法测量的尺寸会让 `max-count` 失效：全部显示、无气泡 —— 这是文档化的可预期回退，不是静默行为变化。

## 叠层方向

- `cascading="left-up"`（默认）：头像组向左生长，后加入的叠在左侧。
- `cascading="right-up"`：向右生长，后加入的叠在右侧。

`vertical` 打开后按列堆叠（忽略 `cascading`），`max-count` 同样生效。

## 统一尺寸 / 形状

`size` / `shape` 会**覆盖**组内每个 `sn-avatar` 自身的同名 prop（参考库「统一设置组内头像」的语义）。组内成员也自动获得叠层间距与分隔环；单独使用 `sn-avatar` 不受影响。

## 自动注册（easycom）

```vue
<sn-avatar-group :max-count="3" collapse-avatar="+2">
  <sn-avatar src="/static/a.png" />
  <sn-avatar src="/static/b.png" />
</sn-avatar-group>
```

如需显式 import：

```ts
import { SnAvatarGroup } from '@snui/uni/components/sn-avatar-group/sn-avatar-group.vue';
```

## Props

| 属性             | 类型                      | 默认值      | 说明                                           |
| ---------------- | ------------------------- | ----------- | ---------------------------------------------- |
| `maxCount`       | `number`                  | `undefined` | 最大显示数量（含折叠头像占用的 1 个位置）      |
| `cascading`      | `'left-up' \| 'right-up'` | `'left-up'` | 叠层方向（垂直模式下忽略）                     |
| `collapseAvatar` | `string`                  | `''`        | 折叠头像显示文本；留空时自动显示 `+{隐藏数量}` |
| `vertical`       | `boolean`                 | `false`     | 是否垂直展示                                   |
| `shape`          | `'round' \| 'square'`     | `'round'`   | 统一设置组内头像形状（覆盖成员自身设置）       |
| `size`           | `string \| number`        | `'normal'`  | 统一设置组内头像尺寸（覆盖成员自身设置）       |
| `customClass`    | `string`                  | `''`        | 根节点自定义类名                               |
| `customStyle`    | `string`                  | `''`        | 根节点自定义 inline style                      |

## Slots

| 插槽名    | 说明                            |
| --------- | ------------------------------- |
| `default` | 头像列表，放置 `sn-avatar` 组件 |

## 主题变量

| 变量                               | 用途       |
| ---------------------------------- | ---------- |
| `--sn-mp-color-background-surface` | 分隔环颜色 |

组内叠层间距 / 分隔环通过继承的 CSS 变量下发（`--sn-avatar-group-overlap-left/-top`、`--sn-avatar-group-ring`），成员头像自绘 —— 不使用 `:deep()`（App 端无法表达）。

## 无障碍

- 组本身是纯布局容器（无 role）；可访问名称由各成员 `sn-avatar` 自行提供。
- 折叠气泡是一个文本头像，读作 `+3` 或自定义文本。

## 暗色模式

分隔环颜色来自 `--sn-mp-color-background-surface`，无浅色兜底：暗色下分隔环自动跟随主题深色，成员头像的底色 / 文字色同样由 token 驱动。

用 sn-config-provider 的 theme 设为 dark 包裹验证。

## 相关

- Web 端：[`SnAvatarGroup`](/components/web/avatar-group)
- 单个头像：[`sn-avatar`](/components/uni/avatar)
- 角标：[`sn-badge`](/components/uni/badge)
