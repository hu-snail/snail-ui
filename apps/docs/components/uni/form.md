# Form 表单（uni 端 / 移动端）

`SnForm` 是移动端表单的编排容器，`SnFormItem` 是字段行。两者通过 provide / inject 共享 model、校验规则与布局配置，统一完成校验、重置与提交。

## 何时使用

- 需要把多个输入控件组织成一次提交的业务表单
- 需要统一的必填标记、错误提示与重置语义
- 需要按单元格（cell）形态排布字段行，或按 schema 描述字段与校验意图

## 基础用法

把 `model` 交给表单，每个字段用 `prop` 声明它在 model 中的路径；提交时先跑全表校验，再由 `submit` 事件回传结果：

<Demo name="form-mp-basic" description="model + v-model 双向绑定；提交时全表校验，@submit 回传 valid。" />

## 表单形态：提交 / 重置

提交型表单调用 `submit()` 先校验再放行；重置型表单调用 `resetFields()` 把字段值恢复到挂载时的快照：

<Demo name="form-mp-form-type" description="提交型：submit() → 校验 → @submit；重置型：resetFields() 回到初始快照。" />

## 提交拦截

`submit` 事件携带 `valid`，宿主据此决定是否让数据落库：

<Demo name="form-mp-guard" description="校验失败不放行（计入拦截次数），修正后再次提交即放行。" />

## 字段类型组合

文本、数字、密码、多行文本、嵌套路径、多选与开关可以在同一张表单里共存，各自挂自己的规则：

<Demo name="form-mp-fields" description="text / digit / password / textarea / 嵌套路径 profile.city / checkbox-group / switch 一表共存。" />

## 自定义插槽

`label` / `default` / `description` 三个插槽可替换字段行的标签、控件与副文案，自定义控件改动后调用 `validateField()` 即可刷新错误提示：

<Demo name="form-mp-custom" description="label 插槽放复合标签、default 插槽放自定义优先级选择、description 插槽放自定义副文案。" />

## 校验状态与展示策略

校验是否运行与是否展示是两件事：`showMessage` 关掉消息行、`errorType="none"` 静默展示，`statusIcon` 在消息前加状态图标；`validate()` 的返回值不受展示策略影响：

<Demo name="form-mp-state" description="默认内联消息 / statusIcon 状态图标 / showMessage=false 隐藏消息行 / errorType=none 静默校验。" />

## 整体禁用

`disabled` 在表单上开启后级联到每个字段行，字段只读、值保持原样：

<Demo name="form-mp-disabled" description="SnForm.disabled 级联到所有 FormItem，提交按钮一并禁用。" />

## Cell 列表化

`border` 画分隔线、`ellipsis` 截断长标签、`clickable` + `isLink` 让整行可点、`placeholder` 为空值兜底、`description` 补充说明：

<Demo name="form-mp-cell" description="border 分隔线 / ellipsis 长标签截断 / clickable + isLink 点击行 / placeholder 空值兜底 / description 副文案。" />

## 表单级默认

`size` / `valueAlign` / `asteriskPosition` / `hideAsterisk` 在表单上设定一次，被所有字段行继承：

<Demo name="form-mp-cell-style" description="size 缩放、valueAlign 右对齐、asteriskPosition 星号位置、hideAsterisk 隐藏必填星号。" />

## 标签内联图标

`iconName` 从图标注册表解析，`iconData` 直接接收 `{ viewBox, paths }`，`iconSize` 控制单个图标尺寸：

<Demo name="form-mp-icon" description="iconName 走注册表；iconData 传内联 SVG；iconSize 单独放大某个图标。" />

## 标签位置与列宽

`labelPosition` 取 `left` / `right` / `top`，`labelWidth` 控制侧边布局的标签列宽（`top` 布局不使用列宽）：

<Demo name="form-mp-label" description="labelPosition left / right / top × labelWidth 列宽。" />

## 重置与清除校验

`resetFields()` 恢复字段初始值并清空错误，`clearValidate()` 只清错误、保留输入；`validate()` 返回本次全表结果：

<Demo name="form-mp-reset-submit" description="resetFields / clearValidate / validate 三种操作的差别，附带当前值与操作回显。" />

## 校验规则（FormRule）

规则联合类型覆盖 required / type / pattern / 长度 / 数值区间 / 自定义校验 / 异步校验，每条规则用自身的 `message` 作为提示：

<Demo name="form-mp-rules" description="required / type / pattern / minLength+maxLength / min+max / validator / asyncValidator 七种规则。" />

## 编程式校验

`validate()` / `validateField()` / `clearValidate()` 可按整表、单字段或字段数组调用，`@validate` 回传错误表：

<Demo name="form-mp-validate" description="validate() / validateField(prop) / validateField([props]) / clearValidate(prop)，并回显 @validate 的 errors。" />

## 表单级配置（schema / titleWidth / layout / center）

`titleWidth` 与 `labelWidth` 共用一条继承链（`titleWidth` 优先），`layout` 决定标签与控件的排布，`center` 让控件列垂直居中，`schema` 描述字段与校验意图并存入表单上下文：

<Demo name="form-mp-schema-layout" description="titleWidth 列宽 / layout horizontal 与 vertical / center 垂直居中 / schema 存进上下文。" />

## 校验时序

字段级规则先于表单级规则执行，异步规则执行期间可通过宿主状态感知，最终结果由 `@validate` 回传：

<Demo name="form-mp-validation-flow" description="字段级规则（required → 异步占用）先跑，再跑表单级规则（pattern / type）。" />

## SnForm Props

| 属性               | 类型                                   | 默认值         | 说明                                                 |
| ------------------ | -------------------------------------- | -------------- | ---------------------------------------------------- |
| `model`            | `Record<string, unknown>`              | —              | 表单数据对象（必传），字段用 `prop` 指向它的路径。   |
| `rules`            | `FormRules`                            | `{}`           | 按 `prop` 索引的校验规则集。                         |
| `showMessage`      | `boolean`                              | `true`         | 是否渲染字段下方的错误消息行。                       |
| `statusIcon`       | `boolean`                              | `false`        | 是否在错误消息前渲染状态图标，字段行可单独覆盖。     |
| `labelPosition`    | `'left' \| 'right' \| 'top'`           | `'right'`      | 标签位置，被所有字段行继承。                         |
| `labelWidth`       | `number \| string`                     | `'auto'`       | 侧边布局的标签列宽，数字按 rpx 处理。                |
| `disabled`         | `boolean`                              | `false`        | 整体禁用，级联到所有字段行。                         |
| `validateTrigger`  | `'blur' \| 'change'`                   | `'blur'`       | 字段级校验触发时机的声明值。                         |
| `resetOnChange`    | `boolean`                              | `true`         | model 外部变更后是否重置字段提示的声明值。           |
| `errorType`        | `'message' \| 'toast' \| 'none'`       | `'message'`    | 错误展示策略；`none` 时不渲染消息行。                |
| `border`           | `boolean`                              | `false`        | 字段行之间画分隔线。                                 |
| `center`           | `boolean`                              | `false`        | 字段行控件列垂直居中。                               |
| `size`             | `'small' \| 'medium' \| 'large'`       | `'medium'`     | 字段行默认尺寸。                                     |
| `valueAlign`       | `'left' \| 'right'`                    | `'left'`       | 默认值列对齐。                                       |
| `asteriskPosition` | `'left' \| 'right'`                    | `'left'`       | 必填星号位置。                                       |
| `hideAsterisk`     | `boolean`                              | `false`        | 隐藏必填星号。                                       |
| `ellipsis`         | `boolean`                              | `false`        | 长标签截断为省略号。                                 |
| `schema`           | `Record<string, unknown> \| undefined` | `undefined`    | 表单级校验描述；存入上下文，校验仍走 `rules`。       |
| `titleWidth`       | `number \| string \| undefined`        | `undefined`    | 左侧标题列宽；与 `labelWidth` 共用继承链且优先。     |
| `layout`           | `'horizontal' \| 'vertical'`           | `'horizontal'` | 单元格布局：标签与控件并排或上下叠放，被字段行继承。 |

> `validateTrigger` / `resetOnChange` / `errorType` 中的 `errorType: 'none'` 与 `showMessage` 会实际改变渲染；`validateTrigger` 与 `resetOnChange` 是声明式的配置项，本版本不接管字段自身的失焦 / 输入事件，校验时机由宿主在需要的节点调用 `validate()` / `validateField()` 决定。

## SnFormItem Props

| 属性               | 类型                             | 默认值  | 说明                                      |
| ------------------ | -------------------------------- | ------- | ----------------------------------------- |
| `prop`             | `string`                         | —       | model 中的字段路径，支持 `a.b` 嵌套写法。 |
| `label`            | `string`                         | —       | 标签文本。                                |
| `required`         | `boolean`                        | `false` | 渲染必填星号。                            |
| `rules`            | `FormRule[]`                     | —       | 字段本地规则，先于表单级规则执行。        |
| `showMessage`      | `boolean`                        | 继承    | 覆盖表单级 `showMessage`。                |
| `statusIcon`       | `boolean`                        | 继承    | 覆盖表单级 `statusIcon`。                 |
| `labelWidth`       | `number \| string`               | 继承    | 覆盖表单级列宽。                          |
| `labelPosition`    | `'left' \| 'right' \| 'top'`     | 继承    | 覆盖表单级标签位置。                      |
| `ariaLabel`        | `string`                         | —       | 无障碍名称覆盖。                          |
| `iconData`         | `IconData`                       | —       | 内联图标数据 `{ viewBox, paths }`。       |
| `iconName`         | `string`                         | —       | 图标注册表中的名称。                      |
| `iconSize`         | `number \| string`               | `32`    | 图标尺寸，数字按 rpx 处理。               |
| `size`             | `'small' \| 'medium' \| 'large'` | 继承    | 覆盖表单级尺寸。                          |
| `valueAlign`       | `'left' \| 'right'`              | 继承    | 覆盖表单级值对齐。                        |
| `asteriskPosition` | `'left' \| 'right'`              | 继承    | 覆盖表单级星号位置。                      |
| `hideAsterisk`     | `boolean`                        | 继承    | 覆盖表单级星号隐藏。                      |
| `ellipsis`         | `boolean`                        | 继承    | 覆盖表单级标签截断。                      |
| `border`           | `boolean`                        | 继承    | 本行下方画分隔线。                        |
| `center`           | `boolean`                        | 继承    | 本行控件列垂直居中。                      |
| `clickable`        | `boolean`                        | `false` | 整行可点击并触发 `click`。                |
| `isLink`           | `boolean`                        | `false` | 右侧显示箭头。                            |
| `placeholder`      | `string`                         | `''`    | 未提供默认插槽时显示的占位文本。          |
| `description`      | `string`                         | `''`    | 字段下方辅助说明。                        |

> 标注「继承」的属性：未显式传入时从父级 `SnForm` 通过 provide / inject 取值。

## Slots

### SnFormItem

| 插槽名        | 说明                             |
| ------------- | -------------------------------- |
| `label`       | 替换标签区域（可放复合标签行）。 |
| `default`     | 字段控件区域。                   |
| `description` | 替换字段下方辅助说明。           |
| `error`       | 替换错误消息文本。               |

### SnForm

| 插槽名    | 说明           |
| --------- | -------------- |
| `default` | 字段行与操作区 |

## Events

### SnForm

| 事件名     | 参数                | 触发时机                     |
| ---------- | ------------------- | ---------------------------- |
| `validate` | `{ valid, errors }` | 每次全表 `validate()` 结束后 |
| `submit`   | `{ valid }`         | `submit()` 完成校验后        |
| `reset`    | —                   | `resetFields()` 之后         |

### SnFormItem

| 事件名  | 参数             | 触发时机                      |
| ------- | ---------------- | ----------------------------- |
| `click` | `(event: Event)` | 整行点击，仅 `clickable=true` |

## 方法

```ts
const formRef = ref<InstanceType<typeof SnForm> | null>(null);

await formRef.value?.validate(); // 全表校验，返回是否通过
await formRef.value?.validateField('email'); // 单字段
await formRef.value?.validateField(['email', 'password']); // 字段数组
formRef.value?.resetFields(); // 恢复初始值 + 清空错误
formRef.value?.clearValidate(); // 清空全部错误
formRef.value?.clearValidate('email'); // 清空指定字段错误
formRef.value?.submit(); // 校验后触发 submit 事件
```

## FormRule 联合类型

```ts
type FormRule =
  | { required: true; message: string }
  | { type: 'string' | 'number' | 'email' | 'url'; message: string }
  | { pattern: RegExp; message: string }
  | { minLength: number; maxLength: number; message: string }
  | { min: number; max: number; message: string }
  | { validator: (value) => boolean | string; message: string }
  | { asyncValidator: (value) => Promise<boolean | string>; message: string };
```

规则按数组顺序执行，第一条失败即返回它自己的 `message`；`validator` / `asyncValidator` 返回字符串时该字符串覆盖 `message`。

## 主题变量

| 变量                                   | 用途                       |
| -------------------------------------- | -------------------------- |
| `--sn-mp-color-text-primary`           | 标签文字色                 |
| `--sn-mp-color-text-tertiary`          | 描述、占位符、箭头文字色   |
| `--sn-mp-color-feedback-danger`        | 必填星号、错误消息与状态点 |
| `--sn-mp-color-feedback-warning`       | 警告态消息与状态点         |
| `--sn-mp-color-feedback-success`       | 成功态状态点               |
| `--sn-mp-color-border-subtle`          | 字段行分隔线               |
| `--sn-mp-color-background-soft`        | 可点击行按压底色           |
| `--sn-mp-color-text-on-primary`        | 状态图标上的文字色         |
| `--sn-mp-font-size-xs` / `-sm` / `-md` | 描述 / 标签 / 常规字号     |
| `--sn-mp-font-line-height-normal`      | 标签与消息行高             |
| `--sn-mp-font-weight-semibold`         | 强调标签字重               |
| `--sn-mp-spacing-2` … `-5`             | 行内与行间间距             |
| `--sn-mp-radius-lg`                    | 单元格圆角                 |

分隔线的样式由三个可覆盖变量控制：`--sn-form-item-border-style` / `--sn-form-item-border-color` / `--sn-form-item-border-width`，默认 `solid` / `border-subtle` / `2rpx`。

## AI Patch Boundary

- AI 可通过 Patch 修改 `label` / `prop` / `required` / `placeholder` / `description` / `labelWidth` / `labelPosition` / `rules`（含规则数组内的 `message`）等字段配置。
- 表单级布局与展示开关（`size` / `valueAlign` / `asteriskPosition` / `hideAsterisk` / `ellipsis` / `border` / `center` / `layout` / `titleWidth` / `labelWidth` / `showMessage` / `statusIcon`）属于容器配置，Patch 可整体调整。
- `model` 的数据来源与提交去向属于宿主职责：Patch 只应改字段的展示与规则，不应改写 model 的结构或伪造提交动作。
- `submit` / `reset` / `validate` 事件的订阅者属于宿主业务逻辑，Patch 不应替换其实现。
- 插槽内容（`label` / `default` / `description` / `error`）属于业务数据，Patch 只应调整容器配置。

## 无障碍

- 错误消息容器带 `aria-live`：错误态为 `assertive`，其余为 `polite`。
- 必填星号与状态图标为 `aria-hidden="true"`，必填语义由标签文本承担。
- 字段行根节点通过 `data-prop` / `data-status` 暴露状态，便于读屏工具与自动化测试定位。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念；H5 下的原生输入控件仍保留浏览器的焦点与键盘可达性。

## 暗色模式

`SnForm` / `SnFormItem` 的颜色全部来自 `--sn-mp-color-*`，没有浅色字面量兜底，因此在暗色主题下自动适配：标签转为主文本色、描述与占位符转为次级文本、分隔线使用暗色边框令牌、错误消息保持危险色。

用 `sn-config-provider` 的 `theme="dark"` 包裹即可验证：

```vue
<sn-config-provider theme="dark">
  <SnForm :model="form">…</SnForm>
</sn-config-provider>
```

## 相关

- 输入控件：[`sn-input`](/components/uni/input)
- 数字输入：[`sn-input-number`](/components/uni/input-number)
- 多选 / 单选：[`sn-checkbox`](/components/uni/checkbox)
- 单元格：[`sn-cell`](/components/uni/cell)
