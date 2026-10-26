# Link 链接（Web 端）

超链接文字：语义状态色、悬停下划线、禁用态，可选前缀图标，支持自定义渲染标签。

## 何时使用

- 正文中的内联跳转链接。
- 需要语义色区分的轻量操作入口（primary / info / success / warning / error）。
- 需要禁用态、或在非 `<a>` 元素上模拟链接交互。

## 代码演示

### 基础用法

六种语义色与下划线、禁用态、图标插槽的综合示例。

<Demo name="link-web-basic" description="type 语义色 / underline / disabled / 自定义 tag / 图标插槽。" />

### 语义色对照

`type` 决定文字颜色与悬停反馈：primary / error 使用专属 hover token 加深，info / success / warning 通过透明度步进提示。

<Demo name="link-web-type" description="default / primary / info / success / warning / error 六色对照。" />

### 下划线、禁用与自定义标签

`underline` 控制下划线是否常显；`disabled` 阻止点击与导航；`tag` 换成非 `a` 元素后只保留点击语义。

<Demo name="link-web-state" description="underline 常显 / 关闭 + disabled + tag=&quot;span&quot; 渲染。" />

## API

### Props

所有 Props 均为可选。

| 名称      | 类型                                                                    | 默认值      | 说明                                                           |
| --------- | ----------------------------------------------------------------------- | ----------- | -------------------------------------------------------------- |
| href      | `string`                                                                | `undefined` | 跳转地址；仅 `tag='a'` 时渲染                                  |
| target    | `string`                                                                | `undefined` | 浏览上下文（`_blank` 等）                                      |
| rel       | `string`                                                                | `undefined` | 目标关系说明                                                   |
| type      | `'default' \| 'primary' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | 语义色，驱动文字颜色与悬停反馈                                 |
| disabled  | `boolean`                                                               | `false`     | 禁用：阻止点击与导航，移除 `href`，设置 `aria-disabled="true"` |
| underline | `boolean`                                                               | `false`     | `true` 常显下划线；`false` 仅悬停显示                          |
| tag       | `string`                                                                | `'a'`       | 渲染元素标签                                                   |

### Events

| 名称  | 参数                  | 说明                                    |
| ----- | --------------------- | --------------------------------------- |
| click | `(event: MouseEvent)` | 激活时触发；`disabled` 时被阻止且不派发 |

### Slots

| 名称    | 参数 | 说明     |
| ------- | ---- | -------- |
| default | —    | 链接文字 |
| icon    | —    | 前缀图标 |

## Tokens

| Token                                                | 用途                 |
| ---------------------------------------------------- | -------------------- |
| `--sn-web-color-text-primary`                        | default 色文字       |
| `--sn-web-color-action-primary / -hover`             | primary 色文字与悬停 |
| `--sn-web-color-feedback-info / -success / -warning` | 对应语义色           |
| `--sn-web-color-feedback-danger / -hover`            | error 色文字与悬停   |

## 无障碍

- 禁用时设置 `aria-disabled="true"` 并移除 `href`，点击与键盘激活均被拦截。
- `tag` 非 `a` 时保留点击语义但失去链接语义；必要时在上游补充 `role`。
- info / success / warning 悬停通过透明度变化提示（无对应 hover token），primary / error 使用 hover token 加深。

## AI Patch Boundary

- AI 可通过 Patch 修改 `href` / `type` / `underline` / `disabled` 等属性。
- `click` 是交互事件；跳转逻辑由业务层处理，Patch 不应伪造导航。
- 换 `tag` 只影响渲染元素；Patch 不应把关键交互挂在纯装饰文本上。

完整契约见组件 `ai-description.md`。
