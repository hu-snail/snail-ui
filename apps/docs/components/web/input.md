# Input · Web（PC 端）

受控输入控件。映射到原生 `<input>` / `<textarea>`，Token 别名层驱动的样式方案。

> **API 参考库**：[naive-ui `n-input`](https://www.naiveui.com/zh-CN/light/components/input) — Props / events 1:1 对齐（按 AGENTS.md §112）。

## 基础用法

<Demo name="input-basic" description="v-model 双向绑定。" />

## 类型（type）

12 种原生 input 类型，包含移动端字段常用的 `digit` / `idcard` / `nickname` / `safe-password`。

<Demo name="input-types" description="12 种 type：text / password / email / number / digit / idcard / nickname / safe-password / tel / url / search / textarea。" />

## 尺寸（size）

5 档 `tiny` / `small` / `medium` / `large` / `huge`，对应 `--sn-web-input-height-{size}`。

<Demo name="input-sizes" description="5 档高度，覆盖紧凑搜索 → 首屏表单全场景。" />

## 状态（status）

<Demo name="input-status" description="default / error / warning — 由 FormItem 校验驱动，手动覆盖也允许。" />

## 表单态（disabled / readonly / required）

<Demo name="input-states" description="disabled 禁用交互，readonly 只读不可改，required 设 aria-required。" />

## Clearable + Counter

<Demo name="input-clearable-count" description="clearable × 按钮；clearTrigger: 'always' | 'focus'；showCount / showWordLimit + maxlength 计数。" />

## Show Password

<Demo name="input-password-toggle" description="type='password' + showPassword 渲染眼睛切换图标。" />

## Prefix / Suffix Icon

<Demo name="input-prefix-suffix" description="prefixIcon / suffixIcon 通过 SnIcon 渲染；cssIcon 改为 CSS class。" />

## 边框 / 背景 / 圆角

<Demo name="input-bordered-bg-radius" description="border: 'all' | 'bottom' | 'none'（bordered alias）；bg / customBg；radius 三种圆角。" />

## alignRight / compact / inputmode

<Demo name="input-align-compact" description="金额字段右对齐；compact 紧凑模式；inputmode 软键盘提示。" />

## customClass / customStyle / customInputClass

<Demo name="input-custom" description="三处 class / style 钩子。" />

## Textarea

多行文本域走 `type="textarea"`，独立 `.sn-input--textarea` 容器样式。Demo 见 input-slots 内的 bio 字段，或单独使用：

```vue
<SnInput v-model="bio" type="textarea" :rows="4" :maxlength="280" show-count />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `''` | 双向绑定值。`type='number'` 时输入会强转为 number。 |
| `type` | `'text' \| 'number' \| 'digit' \| 'idcard' \| 'safe-password' \| 'nickname' \| 'tel' \| 'password' \| 'email' \| 'url' \| 'search' \| 'textarea'` | `'text'` | 原生 input type。`textarea` 渲染多行文本域。 |
| `size` | `'mini' \| 'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | 高度 / 字号。`mini` 在 wot-ui-parity 下新增。 |
| `placeholder` | `string` | `''` | 占位符。 |
| `placeholderStyle` | `string` | `''` | 行内 CSS 注入 `::placeholder` 伪元素（naive-ui `placeholder-style`）。 |
| `placeholderClass` | `string` | `''` | 占位符上的额外 class。 |
| `disabled` | `boolean` | `false` | 禁用 + `aria-disabled`。 |
| `readonly` | `boolean` | `false` | 只读。 |
| `required` | `boolean` | `false` | `aria-required="true"`。 |
| `ariaLabel` | `string` | — | 无障碍标签。 |
| `maxlength` | `number` | — | 原生 maxlength。 |
| `minlength` | `number` | — | 原生 minlength。 |
| `showCount` | `boolean` | `false` | 渲染 `current / max` 计数（naive-ui `show-count`）。 |
| `showWordLimit` | `boolean` | `false` | `showCount` 的 alias（wot-ui `show-word-limit`）。 |
| `clearable` | `boolean` | `false` | 显示 × 清除按钮。 |
| `clearTrigger` | `'always' \| 'focus'` | `'always'` | × 按钮显示时机：`focus` 仅在聚焦时显示。 |
| `focusWhenClear` | `boolean` | `true` | × 点击后自动 refocus。 |
| `showPassword` | `boolean` | `false` | `type='password'` 时显示眼睛切换图标。 |
| `prefixIcon` | `string` | `''` | 前置图标名称（SnIcon 解析）。 |
| `suffixIcon` | `string` | `''` | 后置图标名称。 |
| `cssIcon` | `boolean \| string` | `false` | `true` 把 prefixIcon / suffixIcon 当 CSS class 名渲染（绕过 SnIcon 注册）。 |
| `status` | `'default' \| 'error' \| 'warning'` | `'default'` | 边框色 + `aria-invalid`。 |
| `min` / `max` / `step` | `number` | — | 数字输入限定。 |
| `rows` | `number` | `3` | textarea 行数。 |
| `border` | `'all' \| 'bottom' \| 'none'` | `'all'` | 边框模式。`all` 四边、`bottom` 仅底边（行内表单行）、`none` 无边框。 |
| `bordered` *(deprecated)* | `boolean` | `true` | 别名：`true === border: 'all'`，`false === border: 'none'`。 |
| `bg` | `'surface' \| 'transparent' \| 'soft'` | `'surface'` | 背景色调。 |
| `customBg` | `string` | `''` | 内联 `background-color` 覆盖。 |
| `radius` | `'default' \| 'pill' \| 'square'` | `'default'` | 圆角预设。 |
| `alignRight` | `boolean` | `false` | 字段值右对齐（金额字段常用）。 |
| `compact` | `boolean` | `false` | 紧凑布局 — strip padding + bg 让 input 嵌套进 FormItem。 |
| `focus` | `boolean` | `false` | 挂载即 focus。 |
| `inputmode` | `'none' \| 'text' \| 'decimal' \| 'numeric' \| 'tel' \| 'search' \| 'email' \| 'url'` | `'text'` | 软键盘提示。 |
| `customInputClass` | `string` | `''` | 内层 `<input>` / `<textarea>` 上的额外 class。 |
| `customClass` | `string` | `''` | 根元素上的额外 class。 |
| `customStyle` | `string \| Record<string,string>` | `''` | 根元素上的内联样式。 |

## Events

| Event id | Payload | Notes |
| --- | --- | --- |
| `update:modelValue` | `(value: string \| number)` | v-model 同步。 |
| `input` | `(value, event: Event)` | 原生 input 事件，每次按键。 |
| `change` | `(value, event: Event)` | 原生 change（blur / Enter）。 |
| `focus` | `(event: FocusEvent)` | 获得焦点。 |
| `blur` | `(event: FocusEvent)` | 失去焦点。 |
| `clear` | — | × 清除按钮触发，同时发 `update:modelValue=''`。 |
| `click` | `(event: MouseEvent)` | 整个 root 点击（用于嵌入 popup 的场景）。 |
| `clickPrefixIcon` | `(event: MouseEvent)` | 点击 prefixIcon 区域触发。 |
| `clickSuffixIcon` | `(event: MouseEvent)` | 点击 suffixIcon 区域触发。 |
| `confirm` | `(value: string \| number)` | 单行 input 按 Enter 触发。 |

## Slots

| Slot | Description |
| --- | --- |
| `prefix` | 输入框左侧内容（图标 / 文本）。覆盖 `prefixIcon`。 |
| `suffix` | 输入框右侧内容。覆盖 `suffixIcon`。 |
| `clear-icon` | 自定义 × 按钮内容。 |
| `count` | 自定义计数器（接收 `{ current, max }`）。 |

## Accessibility

| Attribute | Value |
| --- | --- |
| `aria-invalid` | 绑定 `status == 'error'`。 |
| `aria-required` | 绑定 `props.required`。 |
| `aria-disabled` | 绑定 `props.disabled`。 |
| Focus animation | border-color + outer ring 0.18s ease-out；error / warning 状态使用自有 15% rgba 外环。 |
| Placeholder color | 与 input 文本**不同**（用 `--sn-web-input-placeholder-color` 解析为 `text-tertiary`）。 |

## Tokens

视觉属性通过 `var(--sn-web-input-*)` 别名解析，可被父级 selector 覆盖。详见 ai-description.md。

## Source

渲染器在 `@snui/vue-web`，uni 端镜像在 `@snui/uni`。