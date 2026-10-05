# Input · uni-app（多端）

跨 uni-app 多端的受控输入控件。rpx 几何，token 别名层驱动样式；H5 / 微信小程序 / App 全端共用一套 API。

## 基础用法

<Demo name="input-mp-basic" description="v-model 双向绑定。" />

## 类型（type）

16 种原生 input 类型，包含移动端字段常用的 `digit` / `idcard` / `nickname` / `safe-password`。

<Demo name="input-mp-types" description="16 种 type：text / password / email / number / digit / idcard / nickname / safe-password / tel / url / search / textarea。" />

## 尺寸（size）

3 档 `small` / `medium` / `large`（移动端节奏）。

<Demo name="input-mp-sizes" description="3 档尺寸（rpx：56/72/88）。" />

## 状态（status）

<Demo name="input-mp-status" description="default / error / warning。" />

## 表单态（disabled / readonly / required）

<Demo name="input-mp-states" description="disabled / readonly / required + aria-*。" />

## 清空 + 计数（`clearable` / `showCount`）

<Demo name="input-mp-clearable-count" description="clearable × 按钮；clearTrigger: 'always' | 'focus'；showCount / showWordLimit + maxlength 计数。" />

## 密码显示切换（`showPassword`）

<Demo name="input-mp-password-toggle" description="type='password' + showPassword 渲染眼睛切换。" />

## 前缀 / 后缀图标（`prefixIcon` / `suffixIcon`）

<Demo name="input-mp-prefix-suffix" description="prefixIcon / suffixIcon 通过 SnIcon 渲染；iconPrefix / iconSuffix / cssIcon 三种 css class 模式。" />

## 边框 / 背景 / 圆角

<Demo name="input-mp-bordered-bg-radius" description="border: 'all' | 'bottom' | 'none'（bordered alias）；bg / customBg；radius 三种圆角。" />

## 右对齐 / 紧凑 / 输入模式（`alignRight` / `compact` / `inputmode`）

<Demo name="input-mp-align-compact" description="金额字段右对齐；compact 紧凑模式；inputmode 软键盘提示。" />

## 小程序运行时专属属性（MP-only）

<Demo name="input-mp-runtime" description="confirm-type / hold-keyboard / adjust-position / always-embed / cursor / selection-start / selection-end / placeholder-style / placeholder-class。" />

## Textarea

`type="textarea"` 渲染多行域，独立 `.sn-input--textarea` 样式。

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `''` | 双向绑定值。 |
| `type` | `'text' \| 'number' \| 'digit' \| 'idcard' \| 'safe-password' \| 'nickname' \| 'tel' \| 'password' \| 'email' \| 'url' \| 'search' \| 'textarea'` | `'text'` | 原生 input type。 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | rpx 高度 / 字号。 |
| `placeholder` | `string` | `''` | 占位符。 |
| `placeholderStyle` | `string` | `''` | 行内 CSS 注入 `::placeholder` 伪元素。 |
| `placeholderClass` | `string` | `''` | 占位符上的额外 class。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `readonly` | `boolean` | `false` | 只读。 |
| `required` | `boolean` | `false` | aria-required。 |
| `maxlength` | `number` | — | 原生 maxlength。 |
| `minlength` | `number` | — | 原生 minlength。 |
| `showCount` | `boolean` | `false` | 计数。 |
| `showWordLimit` | `boolean` | `false` | `showCount` 的 wot-ui alias。 |
| `clearable` | `boolean` | `false` | × 清除按钮。 |
| `clearTrigger` | `'always' \| 'focus'` | `'always'` | × 按钮显示时机。 |
| `focusWhenClear` | `boolean` | `true` | × 点击后自动 refocus（uni 端为 placeholder，软键盘被收起）。 |
| `showPassword` | `boolean` | `false` | `type='password'` 时显示眼睛切换。 |
| `prefixIcon` | `string` | `''` | 前置图标名（SnIcon 解析）。 |
| `suffixIcon` | `string` | `''` | 后置图标名。 |
| `iconPrefix` | `string` | `''` | 前置图标 CSS class 名（绕过 SnIcon 注册）。 |
| `iconSuffix` | `string` | `''` | 后置图标 CSS class 名。 |
| `cssIcon` | `boolean \| string` | `false` | `true` 把 prefixIcon/suffixIcon 当 CSS class 名渲染。 |
| `status` | `'default' \| 'error' \| 'warning'` | `'default'` | 边框 + aria-invalid。 |
| `min` / `max` / `step` | `number` | — | 数字输入限定。 |
| `rows` | `number` | `3` | textarea 行数。 |
| `border` | `'all' \| 'bottom' \| 'none'` | `'all'` | 边框模式（2rpx）。 |
| `bordered` *(deprecated)* | `boolean` | `true` | 别名：true/false ↔ 'all'/'none'。 |
| `bg` | `'surface' \| 'transparent' \| 'soft'` | `'surface'` | 背景色调。 |
| `customBg` | `string` | `''` | 内联背景色覆盖。 |
| `radius` | `'default' \| 'pill' \| 'square'` | `'default'` | 圆角预设。 |
| `alignRight` | `boolean` | `false` | 字段值右对齐。 |
| `compact` | `boolean` | `false` | 紧凑布局。 |
| `focus` | `boolean` | `false` | 挂载即 focus。 |
| `inputmode` | `'none' \| 'text' \| 'decimal' \| 'numeric' \| 'tel' \| 'search' \| 'email' \| 'url'` | `'text'` | 软键盘提示。 |
| `customInputClass` | `string` | `''` | 内层 `<input>` / `<textarea>` class。 |
| `customClass` | `string` | `''` | 根 class。 |
| `customStyle` | `string \| Record<string,string>` | `''` | 根 inline style。 |

### MP-only runtime attrs（uni-app 编译期透传）

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `confirmType` | `'send' \| 'search' \| 'next' \| 'go' \| 'done'` | `'done'` | 软键盘 confirm 按钮文案。 |
| `holdKeyboard` | `boolean` | `false` | 失焦后保持软键盘。 |
| `adjustPosition` | `boolean` | `true` | 键盘遮挡时自动滚动页面。 |
| `alwaysEmbed` | `boolean` | `false` | input 始终嵌入（不会因 detach 卸载）。 |
| `cursor` | `number` | `-1` | 初始光标位置。`-1` 表示不设置。 |
| `selectionStart` | `number` | `-1` | 初始选区起点。 |
| `selectionEnd` | `number` | `-1` | 初始选区终点。 |

## Events

| Event id | Payload | Notes |
| --- | --- | --- |
| `update:modelValue` | `(value: string \| number)` | v-model 同步。 |
| `input` | `(value, event: Event)` | 原生 input 事件。 |
| `change` | `(value, event: Event)` | 原生 change。 |
| `focus` | `(event: Event)` | 获得焦点。 |
| `blur` | `(event: Event)` | 失去焦点。 |
| `clear` | — | × 清除按钮触发。 |
| `click` | `(event: Event)` | 整个 root 点击。 |
| `clickPrefixIcon` | `(event: Event)` | 点击 prefixIcon 区域。 |
| `clickSuffixIcon` | `(event: Event)` | 点击 suffixIcon 区域。 |
| `confirm` | `(value: string \| number)` | 软键盘 confirm / textarea confirm。 |

## Slots

| Slot | Description |
| --- | --- |
| `prefix` | 输入框左侧。 |
| `suffix` | 输入框右侧。 |
| `prefix-icon` | SnIcon 自定义前置内容（替代 prefixIcon）。 |
| `suffix-icon` | SnIcon 自定义后置内容。 |
| `clear-icon` | 自定义 × 按钮内容。 |
| `count` | 自定义计数（接收 `{ current, max }`）。 |

## Source

跨端协议共享，uni 渲染器在 `@snui/uni`（`packages/uni/src/components/sn-input/`）。