# Link 链接（Web 端）

超链接文字：语义化状态色、悬停下划线、禁用态，可选前缀图标，支持自定义渲染标签。

## 何时使用

- 正文中的内联跳转链接。
- 需要语义色区分的轻量操作入口（primary / info / success / warning / error）。
- 需要禁用态、或在非 `<a>` 元素上模拟链接交互。

## 代码演示

### 基础用法

六种 type 语义色；`underline` 控制常显下划线（默认悬停才显示）；`disabled` 降低透明度并阻止点击。

<Demo name="link-web-basic" description="type 语义色 / underline / disabled / 自定义 tag / 图标插槽。" />

## API

### SnLink Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| href | `string` | — | 跳转地址（仅 `tag='a'` 时渲染） |
| target | `string` | — | 浏览上下文（`_blank` 等） |
| rel | `string` | — | 目标关系说明 |
| type | `'default' \| 'primary' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | 语义色 |
| disabled | `boolean` | `false` | 禁用：阻止点击与导航，`aria-disabled="true"` |
| underline | `boolean` | `false` | `true` 常显下划线；`false` 仅悬停显示 |
| tag | `string` | `'a'` | 渲染元素标签 |

### SnLink Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| click | `(event: MouseEvent)` | 点击时触发；`disabled` 时被阻止 |

### SnLink Slots

| Slot | 说明 |
| --- | --- |
| default | 链接文字 |
| icon | 前缀图标 |

## Tokens

| Token | 用途 |
| --- | --- |
| `--sn-web-color-text-primary` | default 色文字 |
| `--sn-web-color-action-primary / -hover` | primary 色 + 悬停 |
| `--sn-web-color-feedback-info / -success / -warning` | 对应语义色 |
| `--sn-web-color-feedback-danger / -hover` | error 色 + 悬停 |

## 无障碍

- 禁用时设置 `aria-disabled="true"`，同时移除 `href`，点击与键盘激活均被拦截。
- `tag` 非 `a` 时保留点击语义但失去链接语义；必要时在上游补充 `role`。
- info / success / warning 悬停通过透明度变化提示（无对应 hover token），primary / error 使用 hover token 加深。

## AI Patch 边界

- AI 可通过 Patch 修改 `href` / `type` / `underline` / `disabled` 等属性。
- `click` 是交互事件；跳转逻辑由业务层处理，Patch 不应伪造导航。
- 换 `tag` 只影响渲染元素；Patch 不应把关键交互挂在纯装饰文本上。

完整契约见组件 `ai-description.md`。
