# AutoComplete · Web（PC 端）

自动补全输入框。输入即出候选，键盘导航选中，支持按段高亮。

## 基础用法

<Demo name="auto-complete-web-basic" description="options + v-model。" />

## 嵌套 label 高亮

<Demo name="auto-complete-web-highlight" description="label 数组按命中段高亮。" />

## 键盘选择

<Demo name="auto-complete-web-keyboard" description="ArrowUp/Down 高亮 + Enter 选中 + Esc 关闭。" />

## 动态候选（getShow）

<Demo name="auto-complete-web-getshow" description="按输入动态计算候选。" />

## blurAfterSelect / clearable / 禁用

<Demo name="auto-complete-web-states" description="选中后失焦、清空、禁用态。" />

## API

### SnAutoComplete Props

| Prop                | 类型                                           | 默认值      | 说明                           |
| ------------------- | ---------------------------------------------- | ----------- | ------------------------------ |
| modelValue          | `string`                                       | `''`        | v-model                        |
| options             | `Array<string \| SnAutoCompleteOption>`        | `[]`        | 候选（label 可为数组按段高亮） |
| placeholder         | `string`                                       | —           | 占位文案                       |
| clearable           | `boolean`                                      | `false`     | 清空按钮                       |
| disabled / readonly | `boolean`                                      | `false`     | 禁用 / 只读                    |
| size                | `'mini'\|'tiny'\|'small'\|'medium'\|'large'`   | `'medium'`  | 尺寸                           |
| status              | `'default'\|'error'\|'warning'`                | `'default'` | 校验状态                       |
| blurAfterSelect     | `boolean`                                      | `false`     | 选中候选后失焦                 |
| getShow             | `(value: string) => SnAutoCompleteRawOption[]` | —           | 动态候选                       |

事件：`update:modelValue` / `change` / `select` / `focus` / `blur` / `search`；Slot：`empty`。aria：combobox + listbox + aria-activedescendant。

完整契约见组件 `ai-description.md`。
