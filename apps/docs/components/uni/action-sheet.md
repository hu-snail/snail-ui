# ActionSheet 动作面板（uni 端 / 移动端）

`sn-action-sheet` 是 `@snui/uni`（移动端 / 小程序 / H5）的底部动作面板：一组可点列表行 + 可选宫格，外加取消按钮。基于 `sn-popup`（`position="bottom"` + `round`）组合，遮罩、滑入动画与滚动锁定都由 popup 负责。基于 easycom 自动注册（`components/sn-action-sheet/sn-action-sheet.vue` → `<sn-action-sheet>`），样式几何值走 `rpx`。

> **未实现**
>
> - `root-portal` 未实现（小程序没有 portal 宿主）。
> - `panels` 的二维写法按行渲染，`select` 用 `{ item, rowIndex, colIndex }` 回报。

> **AUI 追加能力**
>
> - `description`：标题下方的面板描述文案。
> - `showClose`：标题行右侧关闭按钮。

## 基础用法

`actions` 每项渲染一行；`cancelText` 为空字符串时不渲染取消按钮。

<Demo name="action-sheet-mp-basic" description="列表行 + 取消按钮，含一个禁用项。" />

## 标题、描述与关闭按钮

`title` 加粗居中显示；`description` 在标题下方渲染一段灰色说明文案；`showClose` 在标题行右上角渲染关闭按钮，点击等同取消（触发 `close`，不发 `select`）。

<Demo name="action-sheet-mp-header" description="标题 + 描述 + 关闭按钮 + 带图标的列表行。" />

## 宫格面板

`panels` 支持一维 `Panel[]` 与二维 `Panel[][]`：二维按行渲染，`select` 回报 `{ item, rowIndex, colIndex }`。

<Demo name="action-sheet-mp-panels" description="单行宫格与多行宫格，图标来自 sn-icon 注册表。" />

## 关闭行为与动画

- `closeOnClickAction=false` 选中后不关闭，可继续点下一项
- `closeOnClickModal=false` 点遮罩仍触发 `click-modal`，但面板保持打开
- `duration` 控制滑入 / 滑出时长，`zIndex` 控制层级

<Demo name="action-sheet-mp-behavior" description="选完不关闭 / 点遮罩不关闭 / duration=600 + zIndex=200。" />

## 自定义样式与渲染时机

`customTitleClass` 给标题加类名；`customStyle` 写在面板上；`lazyRender=false` 让内容在首次打开前就渲染；`safeAreaInsetBottom=false` 取消底部安全区留白。

<Demo name="action-sheet-mp-custom" description="标题类名 + 面板内联样式 + 提前渲染 + 关闭安全区。" />

## Props

| 属性                | 类型                    | 默认值 | 说明                           |
| ------------------- | ----------------------- | ------ | ------------------------------ |
| modelValue          | boolean                 | false  | 是否显示（`v-model`）          |
| actions             | SnActionSheetAction[]   | []     | 列表行                         |
| panels              | Array<Panel \| Panel[]> | []     | 宫格项；嵌套数组视为多行       |
| title               | string                  | ''     | 标题                           |
| description         | string                  | ''     | 标题下方描述文案（AUI 追加）   |
| showClose           | boolean                 | false  | 标题行关闭按钮（AUI 追加）     |
| cancelText          | string                  | ''     | 取消按钮文案；空字符串隐藏按钮 |
| closeOnClickAction  | boolean                 | true   | 点击选项后是否关闭             |
| closeOnClickModal   | boolean                 | true   | 点击遮罩是否关闭               |
| duration            | number                  | 200    | 动画持续时间（ms）             |
| zIndex              | number                  | 10     | 菜单层级                       |
| lazyRender          | boolean                 | true   | 弹层内容懒渲染                 |
| safeAreaInsetBottom | boolean                 | true   | 是否设置底部安全距离           |
| customTitleClass    | string                  | ''     | 标题区域自定义类名             |
| customClass         | string                  | ''     | 根节点自定义类名               |
| customStyle         | string                  | ''     | 面板自定义样式                 |

`SnActionSheetAction` = `{ name?, description?, color?, icon?, disabled? }`；`SnActionSheetPanel` = `{ title?, name?, icon? }`。

## Events

| 事件名                                    | 说明                           | 参数                                                |
| ----------------------------------------- | ------------------------------ | --------------------------------------------------- |
| update:modelValue                         | `v-model` 同步                 | boolean                                             |
| select                                    | 点击选项 / 宫格                | `{ item, index }` 或 `{ item, rowIndex, colIndex }` |
| cancel                                    | 点击取消按钮                   | —                                                   |
| close                                     | 面板关闭（由 `sn-popup` 转发） | —                                                   |
| click-modal                               | 点击遮罩（由 `sn-popup` 转发） | —                                                   |
| enter`/`after-enter`/`leave`/`after-leave | 动画阶段（由 `sn-popup` 转发） | —                                                   |

## Slots

| 插槽名  | 说明                         |
| ------- | ---------------------------- |
| default | 面板内、列表上方的自定义内容 |

## 主题变量

| 变量                                        | 用途                  |
| ------------------------------------------- | --------------------- |
| --sn-mp-color-text-primary                  | 行文案                |
| --sn-mp-color-text-secondary                | 标题 / 宫格文案       |
| --sn-mp-color-text-tertiary                 | 行描述                |
| --sn-mp-color-text-disabled                 | 禁用行                |
| --sn-mp-color-action-primary                | 宫格图标              |
| --sn-mp-color-background-elevated           | 取消按钮背景          |
| --sn-mp-color-background-subtle             | 间隔条背景            |
| --sn-mp-color-border-subtle                 | 行分隔线              |
| --sn-mp-font-size-sm`/`--sn-mp-font-size-lg | 宫格文案 / 行文案字号 |
| --sn-mp-font-line-height-normal             | 所有文案行高          |
| --sn-mp-spacing-2`…`--sn-mp-spacing-5       | 内边距与间距          |

## 无障碍

- 每个行 / 宫格项：`role="button"` + `aria-disabled`
- 取消按钮：`role="button"`
- 面板语义来自 `sn-popup`（`role="dialog"` + `aria-modal="true"`）

## 暗色模式

面板背景、文字与状态色全部来自语义色 token（`--sn-mp-color-background-elevated` / `--sn-mp-color-text-*` / `--sn-mp-color-border-subtle`），这些都在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：

## 相关

- 居中确认框：[`sn-dialog`](/components/uni/dialog)
- 通用弹层：[`sn-popup`](/components/uni/popup)
