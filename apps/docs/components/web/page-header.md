# PageHeader 页头（Web 端）

页面级头部：返回按钮 + 标题 / 副标题 + 右侧操作区，支持正文与底部区域。

## 何时使用

- 二级页面、详情页需要「返回 + 标题 + 操作」的标准页头。
- 页头下方需要展示正文内容，底部需要带分隔线的页脚说明。

## 代码演示

### 基础用法

返回按钮默认渲染为圆形图标按钮（`aria-label="Back"`），点击触发 `back` 事件。

<Demo name="page-header-web-basic" description="返回 + 标题 / 副标题 / extra 操作区 / footer 分隔。" />

## API

### SnPageHeader Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| title | `string` | — | 标题文字；`title` 插槽优先 |
| subtitle | `string` | — | 副标题；`subtitle` 插槽优先 |
| extra | `string` | — | 右侧操作区文字；`extra` 插槽优先 |

### SnPageHeader Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| back | `(event: MouseEvent)` | 点击返回按钮时触发 |

### SnPageHeader Slots

| Slot | 说明 |
| --- | --- |
| header | 替换整个头部行 |
| back | 替换整个返回控件 |
| icon | 替换返回图标（默认为内联 chevron-left SVG） |
| title | 标题内容 |
| subtitle | 副标题内容 |
| extra | 右侧操作内容 |
| footer | 底部区域（上边框分隔） |
| default | 头部与底部之间的正文内容 |

## Tokens

| Token | 用途 |
| --- | --- |
| `--sn-web-color-text-primary` | 标题颜色 |
| `--sn-web-color-text-secondary` | 返回图标 / extra / 页脚颜色 |
| `--sn-web-color-text-tertiary` | 副标题颜色 |
| `--sn-web-color-background-subtle` | 返回按钮悬停背景 |
| `--sn-web-color-border-subtle` | 页脚分隔线 |
| `--sn-web-focus-ring` | 返回按钮键盘焦点 |

## 无障碍

- 返回控件为 `<button type="button" aria-label="Back">`，可键盘聚焦，带可见焦点环。
- 标题为普通 `div`；若它是页面主标题，请在上游用语义化 heading 包裹。
- 返回图标为装饰元素，`aria-hidden="true"`。

## AI Patch 边界

- AI 可通过 Patch 修改 `title` / `subtitle` / `extra` 等展示属性。
- `back` 是交互事件；Patch 不应伪造点击，跳转逻辑由业务层监听处理。
- 返回控件可整体通过 `back` 插槽替换（如改为面包屑）；Patch 不应直接改写按钮内部结构。

完整契约见组件 `ai-description.md`。
