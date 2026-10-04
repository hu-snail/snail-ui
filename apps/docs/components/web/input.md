# Input · Web（PC 端）

受控输入控件。映射到原生 `<input>` / `<textarea>`，Token 别名层驱动的样式方案。

## 基础用法

<Demo name="input-basic" description="v-model 双向绑定。" />

## 类型（type）

<Demo name="input-types" description="8 种原生 input 类型：text / password / email / number / tel / url / search。" />

## 尺寸（size）

<Demo name="input-sizes" description="4 档尺寸：tiny / small / medium / large。" />

## 状态（status）

<Demo name="input-status" description="default / error / warning — 由 FormItem 校验驱动，手动覆盖也允许。" />

## 表单态（disabled / readonly / required）

<Demo name="input-states" description="disabled 禁用交互，readonly 只读不可改，required 设 aria-required。" />

## Clearable + Counter

<Demo name="input-clearable-count" description="clearable 显示 × 按钮清空；showCount + maxlength 渲染 current / max 计数。" />

## Slots

<Demo name="input-slots" description="prefix / suffix / clear-icon / count 四个插槽。结合 SnIcon 与 lucide 演示。" />

## 边框 / 背景 / 圆角

<Demo name="input-bordered-bg-radius" description="bordered 切换边框；bg 三种背景色；radius 三种圆角。" />

## Textarea

多行文本域走 `type="textarea"`，独立 `.sn-input--textarea` 容器样式。Demo 见 input-slots 内的 bio 字段，或单独使用：

```vue
<SnInput v-model="bio" type="textarea" :rows="4" :maxlength="280" show-count />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `''` | 双向绑定值。type='number' 时输入会强转为 number。 |
| `type` | `text \| password \| email \| number \| tel \| url \| search \| textarea` | `text` | 原生 input type；textarea 渲染多行文本域。 |
| `size` | `tiny \| small \| medium \| large` | `medium` | 高度 / 字号。 |
| `placeholder` | `string` | `''` | 占位符。 |
| `disabled` | `boolean` | `false` | 禁用 + aria-disabled。 |
| `readonly` | `boolean` | `false` | 只读。 |
| `required` | `boolean` | `false` | aria-required='true'。 |
| `ariaLabel` | `string` | — | 无障碍标签。 |
| `maxlength` | `number` | — | 原生 maxlength。 |
| `minlength` | `number` | — | 原生 minlength。 |
| `showCount` | `boolean` | `false` | 渲染 current / max 计数。 |
| `clearable` | `boolean` | `false` | 显示 × 清除按钮。 |
| `status` | `default \| error \| warning` | `default` | 边框色 + aria-invalid。 |
| `min / max / step` | `number` | — | 数字输入限定。 |
| `rows` | `number` | `3` | textarea 行数。 |
| `autosize` | `boolean \| { minRows, maxRows }` | `false` | textarea 自适应高度。 |
| `bordered` | `boolean` | `true` | 是否显示 1px 边框。 |
| `bg` | `surface \| transparent \| soft` | `surface` | 背景色调。 |
| `radius` | `default \| pill \| square` | `default` | 圆角预设。 |

## Events

| Event id | Payload | Notes |
| --- | --- | --- |
| `update:modelValue` | `(value: string \| number)` | v-model 同步。 |
| `input` | `(value, event: Event)` | 原生 input 事件，每次按键。 |
| `change` | `(value, event: Event)` | 原生 change（blur / Enter）。 |
| `focus` | `(event: FocusEvent)` | 获得焦点。 |
| `blur` | `(event: FocusEvent)` | 失去焦点。 |
| `clear` | — | × 清除按钮触发，同时发 update:modelValue=''. |

## Slots

| Slot | Description |
| --- | --- |
| `prefix` | 输入框左侧内容（图标 / 文本）。 |
| `suffix` | 输入框右侧内容。 |
| `clear-icon` | 自定义 × 按钮内容。 |
| `count` | 自定义计数器（接收 `{ current, max }`）。 |

## Accessibility

| Attribute | Value |
| --- | --- |
| `aria-invalid` | 绑定 status == 'error'。 |
| `aria-required` | 绑定 props.required。 |
| `aria-disabled` | 绑定 props.disabled。 |
| Focus animation | border-color + outer ring 0.18s ease-out；error / warning 状态使用自有 15% rgba 外环。 |

## Tokens

视觉属性通过 `var(--sn-web-input-*)` 别名解析，可被父级 selector 覆盖。详见 ai-description.md。

## Source

Contract 跨端共享，Web 渲染器在 `@snui/vue-web`，uni 端在 `@snui/uni`。