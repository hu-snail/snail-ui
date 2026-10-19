# Popselect 气泡选择器 · Web 端

`SnPopselect` 是锚定在触发元素上的下拉选择菜单：点击弹出白底列表，支持单选 / 多选、分组选项、键盘导航与自定义行渲染，适合工具栏筛选、轻量切换等不需要完整选择框的场景。

## 何时使用

- 页面空间紧张，用一个小按钮触发选择，而不是常驻的下拉选择框。
- 选项数量少、结构简单（可分组），且选择结果直接作用在触发元素上。
- 多选场景下需要保持菜单打开连续勾选。

## 代码演示

### 基础用法

点击触发，单选。选中行以主色文字 + 对勾图标标记；选择后菜单自动关闭。

<Demo name="popselect-web-basic" description="单选、选中态、disabled 与分组选项" />

### 多选与滚动

`multiple` 开启多选，选择后菜单保持打开，支持连续勾选与取消；`scrollable` 在选项过多时限制菜单高度并滚动。

<Demo name="popselect-web-multiple" description="多选 + scrollable + 受控 value" />

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| options | `SnSelectOptionInput[]` | `[]` | 选项列表：裸值或 `{ label, value, disabled, children }` 对象；`children` 渲染为分组头。与 SnSelect 的 options 形状一致。 |
| value | `SnSelectValue \| SnSelectValue[] \| null` | `undefined` | 选中值。`undefined` 为不受控模式。 |
| default-value | `SnSelectValue \| SnSelectValue[] \| null` | `null`（多选为 `[]`） | 不受控模式的初始值。 |
| multiple | `boolean` | `false` | 是否多选。 |
| trigger | `'click' \| 'hover' \| 'manual' \| 'focus'` | `'click'` | 触发方式。 |
| placement | `'top-start' \| 'top' \| 'top-end' \| 'right-start' \| 'right' \| 'right-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end' \| 'left-start' \| 'left' \| 'left-end'` | `'bottom'` | 弹出方位。 |
| scrollable | `boolean` | `false` | 限制菜单最大高度并在超出时滚动。 |
| render-label | `(option, selected) => VNodeChild` | `undefined` | 自定义行标签渲染；入参为归一化后的选项与选中状态。 |
| render-option | `(info: { node, option, selected }) => VNodeChild` | `undefined` | 包裹整行默认渲染节点。 |
| menu-props | `Record<string, unknown>` | `undefined` | 透传到列表容器元素上的属性。 |
| show | `boolean` | `undefined` | 菜单显示状态。`undefined` 为不受控模式。 |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `update:value` | `SnSelectValue \| SnSelectValue[] \| null` | 选中值变化（v-model:value）。单选提交单个值，多选提交完整数组。 |
| `update:show` | `boolean` | 菜单显示状态变化（v-model:show）。 |

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 触发元素。 |

### Methods

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `show` | `() => void` | 命令式打开菜单。 |
| `hide` | `() => void` | 命令式关闭菜单。 |
| `isShown` | `() => boolean` | 读取当前显示状态。 |

## Tokens

| Token | CSS 变量 | 用途 |
| --- | --- | --- |
| 背景表面色 | `--sn-web-color-background-surface` | 菜单面板填充 |
| 弱边框色 | `--sn-web-color-border-subtle` | 菜单面板描边 |
| 卡片阴影 | `--sn-web-card-shadow` | 菜单投影 |
| 主文本色 | `--sn-web-color-text-primary` | 选项文本 |
| 三级文本色 | `--sn-web-color-text-tertiary` | 分组头文本 |
| 禁用文本色 | `--sn-web-color-text-disabled` | 禁用选项文本 |
| 主操作色 | `--sn-web-color-action-primary` | 选中项文字与对勾图标 |
| 弱背景色 | `--sn-web-color-background-subtle` | 悬停 / 键盘高亮行填充 |
| 聚焦环 | `--sn-web-focus-ring` | 选项聚焦描边 |

## 无障碍

- 菜单容器为 `role="listbox"`，多选时带 `aria-multiselectable`，键盘高亮行通过 `aria-activedescendant` 指向。
- 选项行为 `role="option"`，带 `aria-selected` 与 `aria-disabled`；选中项右侧的对勾图标为装饰元素。
- 触发器包裹元素带 `aria-expanded` 与 `aria-haspopup="listbox"`。
- 键盘：↑ / ↓ 移动高亮（自动跳过禁用项），Enter 选中，Esc 关闭。

## AI Patch Boundary

| 可安全由 AI 生成 | 需要人工确认 |
| --- | --- |
| 静态 `options` 数据（label / value / disabled / 分组）与默认 `placement` | `value` 的受控绑定（v-model:value 与页面状态联动） |
| `trigger` / `scrollable` / `menu-props` 等展示参数 | `render-label` / `render-option` 自定义渲染函数内的逻辑 |
| 文档、demo 中静态组合用法 | 多选提交数组在业务侧的消费方式 |

完整契约见组件 `ai-description.md`。
