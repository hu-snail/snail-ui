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

名称模式经 SnIcon 解析链（`registerSnIcons` 注册表 → 内置目录 → Provider）渲染，尺寸与颜色由 `--sn-input-icon-size` / `--sn-input-icon-color` 统一约定；`cssIcon` 模式把名称直接当 CSS class 渲染。

<Demo name="input-mp-prefix-suffix" description="prefixIcon / suffixIcon 经 SnIcon 解析链渲染；iconPrefix / iconSuffix / cssIcon 三种 css class 模式。" />

## 圆角（`radius`）

圆角档位映射共享的 `--sn-mp-radius-*` token；`pill` 全圆角（搜索条常用），`square` 直角。

<Demo name="input-mp-radius" description="radius: 'default' | 'sm' | 'lg' | 'xl' | 'pill' | 'square'，档位映射 --sn-mp-radius-*。" />

## 边框 / 背景（`border` / `bg`）

<Demo name="input-mp-bordered-bg-radius" description="border: 'all' | 'bottom' | 'none'（bordered alias）；bg: 'surface' | 'transparent' | 'soft'；customBg。" />

## 右对齐 / 紧凑 / 输入模式（`alignRight` / `compact` / `inputmode`）

<Demo name="input-mp-align-compact" description="金额字段右对齐；compact 紧凑模式；inputmode 软键盘提示。" />

## 小程序运行时专属属性（MP-only）

<Demo name="input-mp-runtime" description="confirm-type / hold-keyboard / adjust-position / always-embed / cursor / selection-start / selection-end / placeholder-style / placeholder-class。" />

## 清空与聚焦细节（`clearTrigger` / `focusWhenClear` / `focus` / `placeholderClass` / `placeholderStyle`）

`clearTrigger="focus"` 让 × 只在聚焦时出现；`focusWhenClear` 控制清空后是否回焦；`focus` 挂载即聚焦；`placeholderClass` / `placeholderStyle` 定制占位符。

<Demo name="input-mp-clear-focus" description="clearTrigger always / focus；focusWhenClear；focus 挂载即聚焦；placeholderClass + placeholderStyle。" />

## 字数统计别名（`showWordLimit`）

`showWordLimit` 是 `showCount` 的别名，两者等价，都需配合 `maxlength`。

<Demo name="input-mp-word-limit" description="showWordLimit + maxlength；与 showCount 等价。" />

## 原生键盘属性（`cursorSpacing` / `confirmHold` / `ignoreCompositionEvent` / `enableNative`）

`cursorSpacing` 设光标与键盘的间距，`confirmHold` 点确认键时保持键盘，`ignoreCompositionEvent=false` 让合成期间也触发 `input`，`enableNative=false` 让支付宝小程序改用模拟输入框。

<Demo name="input-mp-native-attrs" description="cursorSpacing；confirmHold；ignoreCompositionEvent=false；enableNative=false。" />

## 自定义样式挂载点（`customClass` / `customStyle` / `customInputClass`）

`customClass` / `customStyle` 作用于根节点，`customInputClass` 作用于内层原生 `<input>` / `<textarea>`。

<Demo name="input-mp-custom-class" description="customClass + customStyle 挂根节点；customInputClass 挂内层原生输入框。" />

## Textarea

`type="textarea"` 渲染多行域，独立 `.sn-input--textarea` 样式。

## Props

| Prop                      | Type                                                                                                                                              | Default     | Description                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------ |
| `modelValue`              | `string \| number`                                                                                                                                | `''`        | 双向绑定值。                                                                         |
| `type`                    | `'text' \| 'number' \| 'digit' \| 'idcard' \| 'safe-password' \| 'nickname' \| 'tel' \| 'password' \| 'email' \| 'url' \| 'search' \| 'textarea'` | `'text'`    | 原生 input type。                                                                    |
| `size`                    | `'small' \| 'medium' \| 'large'`                                                                                                                  | `'medium'`  | rpx 高度 / 字号。                                                                    |
| `placeholder`             | `string`                                                                                                                                          | `''`        | 占位符。                                                                             |
| `placeholderStyle`        | `string`                                                                                                                                          | `''`        | 占位符内联样式（原生 `placeholder-style` 透传，App 端无伪元素）。                     |
| `placeholderClass`        | `string`                                                                                                                                          | `''`        | 占位符上的额外 class。                                                               |
| `disabled`                | `boolean`                                                                                                                                         | `false`     | 禁用。                                                                               |
| `readonly`                | `boolean`                                                                                                                                         | `false`     | 只读。                                                                               |
| `required`                | `boolean`                                                                                                                                         | `false`     | aria-required。                                                                      |
| `maxlength`               | `number`                                                                                                                                          | —           | 原生 maxlength。                                                                     |
| `minlength`               | `number`                                                                                                                                          | —           | 原生 minlength。                                                                     |
| `showCount`               | `boolean`                                                                                                                                         | `false`     | 计数。                                                                               |
| `showWordLimit`           | `boolean`                                                                                                                                         | `false`     | `showCount` 的别名。                                                                 |
| `clearable`               | `boolean`                                                                                                                                         | `false`     | 圆形清除按钮（token 色圆底 + surface 色 ×）。                                        |
| `clearTrigger`            | `'always' \| 'focus'`                                                                                                                             | `'always'`  | × 按钮显示时机。                                                                     |
| `focusWhenClear`          | `boolean`                                                                                                                                         | `true`      | × 点击后自动回焦字段（H5 直接聚焦；MP 键盘由用户点击唤起）。                        |
| `showPassword`            | `boolean`                                                                                                                                         | `false`     | `type='password'` 时显示眼睛切换。                                                   |
| `prefixIcon`              | `string`                                                                                                                                          | `''`        | 前置图标名（SnIcon 解析）。                                                          |
| `suffixIcon`              | `string`                                                                                                                                          | `''`        | 后置图标名。                                                                         |
| `iconPrefix`              | `string`                                                                                                                                          | `''`        | 前置图标 CSS class 名（绕过 SnIcon 注册）。                                          |
| `iconSuffix`              | `string`                                                                                                                                          | `''`        | 后置图标 CSS class 名。                                                              |
| `cssIcon`                 | `boolean \| string`                                                                                                                               | `false`     | `true` 把 prefixIcon/suffixIcon 当 CSS class 名渲染。                                |
| `status`                  | `'default' \| 'error' \| 'warning'`                                                                                                               | `'default'` | 边框 + aria-invalid。                                                                |
| `min` / `max` / `step`    | `number`                                                                                                                                          | —           | 数字输入限定。                                                                       |
| `rows`                    | `number`                                                                                                                                          | `3`         | textarea 行数。                                                                      |
| `border`                  | `'all' \| 'bottom' \| 'none'`                                                                                                                     | `'all'`     | 边框模式（2rpx）。                                                                   |
| `bordered` _(deprecated)_ | `boolean`                                                                                                                                         | `true`      | 别名：true/false ↔ 'all'/'none'。                                                    |
| `bg`                      | `'surface' \| 'transparent' \| 'soft'`                                                                                                            | `'surface'` | 背景色调。                                                                           |
| `customBg`                | `string`                                                                                                                                          | `''`        | 内联背景色覆盖。                                                                     |
| `radius`                  | `'default' \| 'sm' \| 'lg' \| 'xl' \| 'pill' \| 'square'`                                                                                         | `'default'` | 圆角档位（映射 `--sn-mp-radius-*`，`default` = `--sn-mp-input-radius`）。             |
| `alignRight`              | `boolean`                                                                                                                                         | `false`     | 字段值右对齐。                                                                       |
| `compact`                 | `boolean`                                                                                                                                         | `false`     | 紧凑布局。                                                                           |
| `focus`                   | `boolean`                                                                                                                                         | `false`     | 挂载即 focus。                                                                       |
| `inputmode`               | `'none' \| 'text' \| 'decimal' \| 'numeric' \| 'tel' \| 'search' \| 'email' \| 'url'`                                                             | `'text'`    | 软键盘提示。                                                                         |
| `customInputClass`        | `string`                                                                                                                                          | `''`        | 内层 `<input>` / `<textarea>` class。                                                |
| `customClass`             | `string`                                                                                                                                          | `''`        | 根 class。                                                                           |
| `customStyle`             | `string \| Record<string,string>`                                                                                                                 | `''`        | 根 inline style。                                                                    |
| `error`                   | `boolean`                                                                                                                                         | `false`     | 错误态：`sn-input--error` class + `aria-invalid`（等价于 `status="error"` 的视觉）。 |

### MP-only runtime attrs（uni-app 编译期透传）

| Prop                     | Type                                             | Default  | Description                                              |
| ------------------------ | ------------------------------------------------ | -------- | -------------------------------------------------------- |
| `confirmType`            | `'send' \| 'search' \| 'next' \| 'go' \| 'done'` | `'done'` | 软键盘 confirm 按钮文案。                                |
| `holdKeyboard`           | `boolean`                                        | `false`  | 失焦后保持软键盘。                                       |
| `adjustPosition`         | `boolean`                                        | `true`   | 键盘遮挡时自动滚动页面。                                 |
| `alwaysEmbed`            | `boolean`                                        | `false`  | input 始终嵌入（不会因 detach 卸载）。                   |
| `cursor`                 | `number`                                         | `-1`     | 初始光标位置。`-1` 表示不设置。                          |
| `selectionStart`         | `number`                                         | `-1`     | 初始选区起点。                                           |
| `selectionEnd`           | `number`                                         | `-1`     | 初始选区终点。                                           |
| `cursorSpacing`          | `number`                                         | `0`      | 光标与软键盘之间的距离。                                 |
| `confirmHold`            | `boolean`                                        | `false`  | 点击键盘 confirm 按钮后保持键盘不收起。                  |
| `ignoreCompositionEvent` | `boolean`                                        | `true`   | 忽略输入法合成事件（`false` 时合成期间也会触发 input）。 |
| `enableNative`           | `boolean`                                        | `true`   | 支付宝小程序启用原生输入框。                             |

## Events

| Event id            | Payload                     | Notes                               |
| ------------------- | --------------------------- | ----------------------------------- |
| `update:modelValue` | `(value: string \| number)` | v-model 同步。                      |
| `input`             | `(value, event: Event)`     | 原生 input 事件。                   |
| `change`            | `(value, event: Event)`     | 原生 change。                       |
| `focus`             | `(event: Event)`            | 获得焦点。                          |
| `blur`              | `(event: Event)`            | 失去焦点。                          |
| `clear`             | —                           | × 清除按钮触发。                    |
| `click`             | `(event: Event)`            | 整个 root 点击。                    |
| `clickPrefixIcon`   | `(event: Event)`            | 点击 prefixIcon 区域。              |
| `clickSuffixIcon`   | `(event: Event)`            | 点击 suffixIcon 区域。              |
| `confirm`           | `(value: string \| number)` | 软键盘 confirm / textarea confirm。 |

## Slots

| Slot          | Description                                |
| ------------- | ------------------------------------------ |
| `prefix`      | 输入框左侧。                               |
| `suffix`      | 输入框右侧。                               |
| `prefix-icon` | SnIcon 自定义前置内容（替代 prefixIcon）。 |
| `suffix-icon` | SnIcon 自定义后置内容。                    |
| `clear-icon`  | 自定义 × 按钮内容。                        |
| `count`       | 自定义计数（接收 `{ current, max }`）。    |

## Tokens

域内图标（前置 / 后置 / 清空 × / 密码眼睛）共用一档尺寸与颜色，宿主可在任意祖先节点覆盖：

| Token                    | Default                            | Description                            |
| ------------------------ | ---------------------------------- | -------------------------------------- |
| `--sn-input-icon-size`   | `var(--sn-mp-icon-size-medium)`    | 域内图标边长（32rpx）。                |
| `--sn-input-icon-color`  | `var(--sn-mp-color-text-tertiary)` | 域内图标颜色。                         |
| `--sn-mp-input-radius`   | `12rpx`                            | 默认圆角（`radius="default"`）。       |
| `--sn-mp-input-padding-x`| `20rpx`                            | 水平内边距。                           |
| `--sn-mp-input-bg`       | `--sn-mp-color-background-surface` | 背景色（`bg="surface"`）。             |

## Source

跨端协议共享，uni 渲染器在 `@snui/uni`（`packages/uni/src/components/sn-input/`）。
