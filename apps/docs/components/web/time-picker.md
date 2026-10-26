# TimePicker · Web（PC 端）

时间选择器。Teleport 三列（时/分/秒）面板，支持 12 小时制与全键盘操作。

## 基础用法

<Demo name="time-picker-web-basic" description="v-model（毫秒时间戳）+ 默认 HH:mm:ss。" />

## format（列数）

<Demo name="time-picker-web-format" description="HH:mm 隐藏秒列，提交秒归零。" />

## 12 小时制（use12Hours）

<Demo name="time-picker-web-12h" description="钟面序 12/1…11 + AM/PM 列。" />

## 可清空 / 禁用 / 只读

<Demo name="time-picker-web-states" description="clearable、disabled、readonly。" />

## API

### SnTimePicker Props

| Prop                | 类型                                         | 默认值       | 说明                                        |
| ------------------- | -------------------------------------------- | ------------ | ------------------------------------------- |
| modelValue          | `number \| null`                             | `null`       | 毫秒时间戳（本地时区，commit 保留日期部分） |
| format              | `'HH:mm' \| 'HH:mm:ss'`                      | `'HH:mm:ss'` | 决定列数                                    |
| placeholder         | `string`                                     | —            | 占位                                        |
| clearable           | `boolean`                                    | `false`      | 清空按钮                                    |
| disabled / readonly | `boolean`                                    | `false`      | 禁用 / 只读                                 |
| size                | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'`   | 尺寸                                        |
| status              | `'default'\|'error'\|'warning'`              | `'default'`  | 校验状态                                    |
| use12Hours          | `boolean`                                    | `false`      | 12 小时制 + AM/PM                           |

键盘：ArrowUp/Down 步进当前列（即时提交）、Tab/Shift+Tab 切列、Enter 确认关闭、Esc 关闭。aria：触发器 combobox + 面板每列 listbox。

完整契约见组件 `ai-description.md`。
