# DatePicker · Web（PC 端）

日期选择器。date / datetime / week / quarter / month / year 及对应 range 模式，无第三方日期库。单值 datetime 为「月历 | 时间列」左右布局；datetimerange 为「四输入框 + 双月历 + 时间弹层」布局；monthrange 为双栏「年 | 月」面板。

## 基础用法（date）

<Demo name="date-picker-web-basic" description="月历网格，v-model 毫秒时间戳。" />

## 日期时间（datetime，左右布局）

<Demo name="date-picker-web-datetime" description="月历 | 时分秒列 左右布局 + 确认。" />

## 周 / 季度模式

<Demo name="date-picker-web-week-quarter" description="type='week' / 'quarter' / 'weekrange'：周行选取（值 = 周一），季度网格（值 = 季度首日）。" />

## 年 / 月模式

<Demo name="date-picker-web-month-year" description="type='month' / 'year' 网格下钻。" />

## 范围（daterange / datetimerange）

<Demo name="date-picker-web-range" description="双月历并排，先 start 后 end，越界自动交换；datetimerange 顶部为「开始日期 / 开始时间 | 结束日期 / 结束时间」四输入框，点击时间输入弹出时分秒弹层（此刻 / 确认），底部 清除 / 确认；input-position='bottom' 可把输入框栏放到月历下方。面板宽度由双月历决定，不再被输入框撑出右侧空白。" />

## 月份范围（monthrange）

<Demo name="date-picker-web-month-range" description="双栏「年 | 月」滚动面板，范围起止高亮、越界自动交换，底部 清除 / 确认；值为两个月份首日的时间戳。" />

## 快捷入口 / 动态限选

<Demo name="date-picker-web-shortcuts" description="shortcuts（left/right/bottom 定位）、disabledDate 禁用日期、onSelect + disabledDate 动态控制选取范围。" />

## 格式化（format）

<Demo name="date-picker-web-format" description="小写 token：yyyy / MM / dd / HH / mm / ss / ww（ISO 周）/ qq（季度）。" />

## 可清空 / 禁用

<Demo name="date-picker-web-states" description="clearable、disabled、readonly。" />

## API

### SnDatePicker Props

| Prop                | 类型                                                                                                                              | 默认值      | 说明                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------- |
| type                | `'date'\|'datetime'\|'week'\|'quarter'\|'month'\|'year'\|'daterange'\|'datetimerange'\|'weekrange'\|'quarterrange'\|'monthrange'` | `'date'`    | 模式（range 值为数组）                                            |
| modelValue          | `number \| [number, number] \| null`                                                                                              | `null`      | 毫秒时间戳（range 为 `[start, end]`；周 = 周一，季度 = 季度首日） |
| format              | `string`                                                                                                                          | 按模式      | 小写 token（…/w/ww/q/qq）；`yyyy` 为日历年                        |
| placeholder         | `string \| [string, string]`                                                                                                      | —           | 占位（range 双占位）                                              |
| clearable           | `boolean`                                                                                                                         | `false`     | 清空按钮                                                          |
| disabledDate        | `(ts: number) => boolean`                                                                                                         | —           | 禁用日期（月/季/年按周期首日；周按周一）；禁用格拒绝点选          |
| shortcuts           | `{ label, value: number \| [number, number] \| (() => …) }[]`                                                                     | —           | 快捷入口，懒取值在点击时解析并提交关闭                            |
| shortcutsPosition   | `'left' \| 'right' \| 'bottom'`                                                                                                   | `'bottom'`  | 快捷入口位置（侧栏 / 底栏）                                       |
| inputPosition       | `'top' \| 'bottom'`                                                                                                               | `'top'`     | datetimerange 四输入框栏位置（底部时时间弹层向上弹出）            |
| disabled / readonly | `boolean`                                                                                                                         | `false`     | 禁用 / 只读                                                       |
| size                | `'mini'\|'tiny'\|'small'\|'medium'\|'large'`                                                                                      | `'medium'`  | 尺寸                                                              |
| status              | `'default'\|'error'\|'warning'`                                                                                                   | `'default'` | 校验状态                                                          |

事件：`update:modelValue` / `change` / **`select`**（每次拾取触发：range 首选发起点、次选发数组 —— 配合 `disabledDate` 实现动态限选）/ `clear` / `focus` / `blur`。键盘：Arrow 移动、PageUp/PageDown 翻页、Enter 选取/确认、Esc 关闭、Space 打开（monthrange 的 Arrow 按月 / 季移动，PageUp/Down 按年）。aria：grid/gridcell + aria-selected / aria-disabled。date/week/quarter/month/year 点击即提交；datetime 族与 monthrange 需确认。周一起始；面板 z-index 默认 2000（`--sn-web-date-picker-panel-z-index` 可调）。主题光环由主色派生（`--sn-web-date-picker-focus-ring` 可覆盖），不再使用全局蓝色 focus ring。

**Out of scope**（见 ai-description.md）：disabledTime、双面板月/年快跳、formatted-value/value-format。

完整契约见组件 `ai-description.md`。
