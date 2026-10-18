# 评论 Comment · Web（PC 端）

展示评论信息：头像 / 作者 / 时间 / 正文 / 操作，支持嵌套回复。

## 何时使用

- 评论列表、问答回复、审阅意见等「头像 + 作者 + 时间 + 正文 + 操作」场景
- 需要在评论内容区嵌套子评论（回复）时
- 需要单独控制时间行、操作行的左右对齐时

## 代码演示

### 基础用法

<Demo name="comment-web-basic" description="avatar / author / datetime / content 完整场景 + actions 插槽。" />

### 对齐方式

<Demo name="comment-web-align" description="align 控制时间行与操作行的对齐：字符串同时作用于两行，对象形态可分别控制。" />

### 嵌套评论

<Demo name="comment-web-nest" description="default 插槽放子评论，缩进跟随父评论头像。" />

## API

### SnComment Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| author | `string` | `undefined` | 作者名，`author` 插槽可覆盖 |
| avatar | `string` | `undefined` | 头像图片 URL（渲染为 32px 圆形），`avatar` 插槽可覆盖 |
| content | `string` | `undefined` | 评论内容，`content` 插槽可覆盖 |
| datetime | `string` | `undefined` | 时间描述，`datetime` 插槽可覆盖 |
| align | `'left' \| 'right' \| { datetime?: 'left' \| 'right'; actions?: 'left' \| 'right' }` | `'left'` | 时间行与操作行的对齐：字符串两行同时生效，对象形态分别控制，缺省键回退 `left` |

### SnComment Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| avatar | `()` | 头像区域，覆盖 `avatar` |
| author | `()` | 作者区域，覆盖 `author` |
| datetime | `()` | 时间区域，覆盖 `datetime` |
| content | `()` | 内容区域，覆盖 `content` |
| actions | `()` | 操作列表（通常放若干 span） |
| default | `()` | 嵌套的 `<SnComment>` 回复 |

DOM 结构与 Arco 对齐：头像列 + 主列（第一行作者 + 时间，第二行正文，第三行操作），嵌套回复渲染在主列内、缩进到父头像右侧。

## 与参考库的差异

- naive-ui 没有 Comment 组件（已核对 naive `src/components.ts` 全表），本组件为「数据展示」批次的显式 divergence，参考 Arco Design Vue `a-comment` 实现。
- 插槽优先于同名 prop（Arco 源码是 prop 优先），与本仓库其他组件（如 Thing）保持一致。
- 参考库的 `editor`（回复输入框）demo 依赖 Input / Button 组件，本库暂未提供，登记为 future。
- 字号/间距以 Arco less 源码为准：正文 14px、作者 14px、时间 12px、操作 14px，头像 32px 圆形，操作行间距 8px，嵌套/相邻评论纵向节奏 20px。

完整契约见组件 `ai-description.md`。
