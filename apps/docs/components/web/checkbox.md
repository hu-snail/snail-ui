# Checkbox · Web（PC 端）

多选框。原生 `input[type=checkbox]` 语义（aria-checked 三态），支持独立使用与 `SnCheckboxGroup` 编排。

## 基础用法

<Demo name="checkbox-web-basic" description="v-model 双向绑定 + label。" />

## 复选组（CheckboxGroup）

<Demo name="checkbox-web-group" description="options 声明式 / slot 自定义两种渲染路径，v-model 为数组。" />

## 半选态（indeterminate）

<Demo name="checkbox-web-indeterminate" description="aria-checked='mixed'，父级全选场景。" />

## 尺寸（size）

<Demo name="checkbox-web-sizes" description="mini / tiny / small / medium / large 五档。" />

## 禁用 / 只读

<Demo name="checkbox-web-states" description="disabled 交互与视觉禁用；readonly 视觉态。" />

## 自定义选中值（checkedValue / uncheckedValue）

<Demo name="checkbox-web-values" description="非 boolean 值映射：'on' / 'off'、1 / 0。" />

## API

### SnCheckbox Props

| Prop           | 类型                                         | 默认值      | 说明                         |
| -------------- | -------------------------------------------- | ----------- | ---------------------------- |
| modelValue     | `boolean`                                    | `false`     | v-model 绑定                 |
| label          | `string`                                     | `''`        | 文案（label slot 优先）      |
| value          | `SnCheckboxValue`                            | —           | 在 group 中的取值            |
| disabled       | `boolean`                                    | `false`     | 禁用（group 级 OR）          |
| readonly       | `boolean`                                    | `false`     | 只读                         |
| indeterminate  | `boolean`                                    | `false`     | 半选态（aria-checked=mixed） |
| size           | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'`  | 尺寸                         |
| checkedValue   | `SnCheckboxValue`                            | `true`      | 选中时的值                   |
| uncheckedValue | `SnCheckboxValue`                            | `false`     | 未选中时的值                 |
| status         | `'default'\|'error'\|'warning'`              | `'default'` | 校验状态                     |

### SnCheckboxGroup Props

| Prop       | 类型                                              | 默认值     | 说明         |
| ---------- | ------------------------------------------------- | ---------- | ------------ |
| modelValue | `SnCheckboxValue[]`                               | `[]`       | v-model 数组 |
| options    | `Array<SnCheckboxGroupOption \| SnCheckboxValue>` | `[]`       | 声明式选项   |
| disabled   | `boolean`                                         | `false`    | 组级禁用     |
| size       | 同上                                              | `'medium'` | 组级尺寸     |

完整契约见组件 `ai-description.md`。
