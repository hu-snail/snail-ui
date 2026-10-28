# Ellipsis 文本省略（Web 端）

把文本截断在一行或 N 行内，溢出时通过气泡展示完整内容，也可点击原地展开。

## 何时使用

- 表格单元格、卡片标题等空间受限处需要截断长文本。
- 截断后的完整内容需要悬浮可见。
- 长段落需要点击展开 / 收起的阅读交互。

## 代码演示

### 基础截断

`width` 约束容器宽度，`lineClamp` 未设置时仅溢出才显示气泡；同时支持多行与点击展开。

<Demo name="ellipsis-web-basic" description="单行 / 多行 lineClamp / 溢出气泡 / 点击展开。" />

### 单行与多行对照

同一段文字、同一宽度下，`lineClamp` 为 1 时单行省略，为 2 / 3 时按行数截断；未溢出时不弹气泡。

<Demo name="ellipsis-web-lines" description="lineClamp 1 / 2 / 3 对照 + 未溢出时不弹气泡。" />

### 点击展开与收起

`expandTrigger="click"` 时点击文本即可在截断与完整内容之间切换，展开状态由组件内部维护。`fade` 开启后截断边缘以烟雾渐隐过渡；`expandPosition` 决定独立的展开 / 收起操作位置：`suffix` 跟随文案末尾，`bottom` 单独一行。

<Demo name="ellipsis-web-expand" description="fade 烟雾渐隐 + expandPosition suffix / bottom + expandTrigger 点击展开。" />

## API

### Props

所有 Props 均为可选。

| 名称           | 类型                                  | 默认值      | 说明                                         |
| -------------- | ------------------------------------- | ----------- | -------------------------------------------- |
| expandTrigger  | `'click' \| 'none'`                   | `'none'`    | 点击文本切换展开 / 收起                      |
| lineClamp      | `number`                              | `1`         | 截断行数，`1` 为单行省略，大于 1 为多行省略  |
| tooltip        | `boolean \| SnEllipsisTooltipOptions` | `true`      | 溢出时气泡显示完整文本；对象形式透传气泡属性 |
| width          | `number \| 'screen'`                  | `undefined` | 容器宽度；数字为 px，`'screen'` 为 100vw     |
| fade           | `boolean`                             | `false`     | 截断边缘烟雾渐隐（多行在底部，单行在行尾）   |
| expandPosition | `'suffix' \| 'bottom' \| 'none'`      | `'none'`    | 展开 / 收起操作位置：跟随文案 / 单独一行     |
| expandText     | `string`                              | locale 展开 | 收起状态的展开操作文案                       |
| collapseText   | `string`                              | locale 收起 | 展开状态的收起操作文案                       |

### Slots

| 名称    | 参数 | 说明             |
| ------- | ---- | ---------------- |
| default | —    | 被截断的文本内容 |

无事件。

`tooltip` 对象形式支持的属性子集：`content` / `placement` / `trigger` / `delay` / `duration` / `arrow` / `zIndex` / `raw` / `animated` / `keepAliveOnHover` / `overlap` / `width` / `to` / `displayDirective` / `contentClass` / `contentStyle`；`disabled` 由溢出检测接管，不能通过该对象覆盖。

溢出检测在挂载时、窗口 resize 时、文本框 ResizeObserver 回调中以及 `lineClamp` / `width` / 展开状态变化后重新计算。

## Tokens

组件只做结构裁剪（继承上下文文字样式），不消费专属 token；气泡部分消费其自身 token。

## 无障碍

- 截断只是视觉行为，DOM 中保留完整文本，屏幕阅读器可读到全文。
- 气泡带 `role="tooltip"`。
- `expandTrigger='click'` 时文本可点击但不可聚焦；关键内容请提供键盘可达的替代。

## AI Patch Boundary

- AI 可通过 Patch 修改 `lineClamp` / `width` / `expandTrigger` / `tooltip` 配置。
- 溢出状态是运行时测量结果，不属于 Schema；Patch 不应试图直接写入「是否溢出」。
- 完整文本来自插槽内容；Patch 修改文本即可同步气泡内容。

完整契约见组件 `ai-description.md`。
