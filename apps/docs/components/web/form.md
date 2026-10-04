# Form · Web（PC 端）

原生 `<form>` 容器 + FormItem 子组件，支持 FormData 自动收集、字段级错误回显、disabled / loading 状态级联。

## 基本用法

<Demo name="form-web" description="垂直布局 Form + 两个 FormItem（Email / Password）+ 提交按钮。点击提交会触发 loading 状态并显示提交结果。" />

## Form props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'vertical'` | 布局方向 |
| `disabled` | `boolean` | `false` | 禁用整个表单（cascading via FormContext） |
| `loading` | `boolean` | `false` | 表单加载中（应用 `aria-busy`） |
| `initialValues` | `Record<string, unknown>` | `{}` | 初始值（HTML FormData 仍由原生 input 自动收集） |
| `fields` | `FormField[]` | — | 字段描述数组，可选；内嵌 children 树是更常用的方式 |
| `formId` | `string` | — | 原生 `<form>` 元素 id |

## FormItem props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `prop` | `string` | — | **必填**。字段路径，用于值查找与错误回显 |
| `label` | `string` | — | 字段标签 |
| `required` | `boolean` | `false` | 必填，附加 `*` 标记 + `aria-required` |
| `error` | `string` | — | 字段级错误信息（来自父级 validate） |

## Validation rules（`fields[].rules`）

| Rule | 行为 |
| --- | --- |
| `required` | 值非空字符串 |
| `minLength` | 字符串长度下限 |
| `maxLength` | 字符串长度上限 |
| `pattern` | RegExp 源码（运行时编译） |
| `message` | 自定义错误文本 |

## Events

| Event id | DOM event | Payload |
| --- | --- | --- |
| `submit` | `submit` | `Record<string, string>`（已清理的 values） |
| `validate` | — | `{ valid: boolean; errors: Record<string, string> }` |

## Accessibility

| Attribute | Value |
| --- | --- |
| `role` | `form`（Form） · `group`（FormItem） |
| `keyboard` | `Enter`, `Tab`（Form） · 平台原生（FormItem） |
| `aria-busy` | 绑定到 `Form.props.loading` |
| `aria-disabled` | 绑定到 `Form.props.disabled` |
| `aria-required` | 绑定到 `FormItem.props.required` |
| `aria-invalid` | 绑定到 `has-error(error)` |

## Source

Contract 跨端共享，Web 渲染器在 `@snui/vue-web`。
