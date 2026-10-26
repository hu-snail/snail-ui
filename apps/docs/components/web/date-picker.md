# DatePicker · Web（PC 端）

日期选择器。date / datetime / month / year / daterange / datetimerange 六种模式，无第三方日期库。

## 基础用法（date）

<Demo name="date-picker-web-basic" description="月历网格，v-model 毫秒时间戳。" />

## 日期时间（datetime）

<Demo name="date-picker-web-datetime" description="月历 + 时分秒列 + 确认。" />

## 年 / 月模式

<Demo name="date-picker-web-month-year" description="type='month' / 'year' 网格下钻。" />

## 范围（daterange / datetimerange）

<Demo name="date-picker-web-range" description="双月历并排，先 start 后 end，越界自动交换。" />

## 格式化（format）

<Demo name="date-picker-web-format" description="小写 token：yyyy / MM / dd / HH / mm / ss。" />

## 可清空 / 禁用

<Demo name="date-picker-web-states" description="clearable、disabled、readonly。" />

## API

### SnDatePicker Props

| Prop                | 类型                                                                | 默认值      | 说明                                           |
| ------------------- | ------------------------------------------------------------------- | ----------- | ---------------------------------------------- |
| type                | `'date'\|'datetime'\|'month'\|'year'\|'daterange'\|'datetimerange'` | `'date'`    | 模式（range 值为数组）                         |
| modelValue          | `number \| [number, number] \| null`                                | `null`      | 毫秒时间戳（range 为 `[start, end]`）          |
| format              | `string`                                                            | 按模式      | 小写 token（yyyy/yy/MM/M/dd/d/HH/H/mm/m/ss/s） |
| placeholder         | `string \| [string, string]`                                        | —           | 占位（range 双占位）                           |
| clearable           | `boolean`                                                           | `false`     | 清空按钮                                       |
| disabled / readonly | `boolean`                                                           | `false`     | 禁用 / 只读                                    |
| size                | `'mini'\|'tiny'\|'small'\|'medium'\|'large'`                        | `'medium'`  | 尺寸                                           |
| status              | `'default'\|'error'\|'warning'`                                     | `'default'` | 校验状态                                       |

事件：`update:modelValue` / `change` / `clear` / `focus` / `blur`。键盘：Arrow 移动、PageUp/PageDown 翻月（年）、Enter 选取/确认、Esc 关闭、Space 打开。aria：grid/gridcell + aria-selected。date/month/year 点击即提交；datetime 族需确认。周一起始，面板文案 zh-CN。

**Out of scope**（见 ai-description.md）：shortcuts 面板、disabled-date/min-max、hover 联动 range 预览、i18n。

完整契约见组件 `ai-description.md`。
