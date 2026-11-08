# Keyboard 虚拟键盘（uni 端 / 移动端）

`sn-keyboard` 是 `@snui/uni` 的虚拟键盘：数字键盘 / 车牌键盘 / 自定义模式。easycom 自动注册（`components/sn-keyboard/sn-keyboard.vue` → `<sn-keyboard>`），几何值使用 `rpx`。`maxlength` 限长，删除键逐字退格并触发 `delete`（**长按可连续退格**，松开 / 关闭 / 卸载时定时器全部清理）；`hideOnClickOutside` 同时控制是否渲染遮罩。

底行始终占满三格：`extraKey` 未提供的槽位渲染**收起键盘图标键**（点击等同关闭按钮，发 `close`），因此不会出现空位或超宽的 `0`；头部关闭按钮在无文案时以圆形 chevron chip 呈现。

视觉上遵循移动端键盘的成熟范式：灰底面板（`background-subtle`）+ 白色键帽（`background-elevated`），顶部工具栏保留白色高程面，「完成」为主色文字按钮；按压反馈走 `hover-class`。键高 / 间距 / 圆角暴露为组件局部变量 `--sn-keyboard-key-height`、`--sn-keyboard-gap`、`--sn-keyboard-key-radius`，可在 `custom-class` 上覆写而不必新增 prop。

## 基础用法

默认数字键盘：底行 [收起] [0] [⌫]，maxlength 限长；搭配只读输入框使用。

<Demo name="keyboard-mp-basic" description="默认数字键盘：底行 [收起][0][⌫]，maxlength 限长；搭配只读输入框使用。" />

## 小数点（`extraKey="."`）

`extraKey="."` 占据底行左槽，用于金额等小数输入。

<Demo name="keyboard-mp-decimal" description="extraKey=. 占据底行左槽，用于金额等小数输入。" />

## 身份证（`extraKey="X"`）

`extraKey="X"` 提供末位校验码键位，配合 `maxlength=18` 输入证件号。

<Demo name="keyboard-mp-idcard" description="extraKey=X 提供末位校验码键位，maxlength=18 输入证件号。" />

## 车牌与自定义模式（`mode` / `extraKey` / `autoSwitchLang`）

mode="car" 出车牌键盘，autoSwitchLang 在选中省份后自动切字母；mode="custom" 右侧加大号操作列，extraKey 追加额外键。

<Demo name="keyboard-mp-car-custom" description="mode=car 出车牌键盘，autoSwitchLang 在选中省份后自动切字母；mode=custom 右侧加大号操作列，extraKey 追加额外键。" />
## 键位文案与删除键（`deleteText` / `closeText` / `showDeleteKey` / `randomKeyOrder` / `zIndex`）

`deleteText` / `closeText` 改删除键与关闭键文案（留空则用图标）；`showDeleteKey=false` 不渲染删除键；`randomKeyOrder` 打乱数字键顺序；`zIndex` 调层级。

<Demo name="keyboard-mp-labels" description="deleteText / closeText；showDeleteKey=false；randomKeyOrder；zIndex。" />

## 遮罩与行为（`modal` / `hideOnClickOutside` / `lockScroll` / `closeButtonLoading` / `safeAreaInsetBottom` / `rootPortal` / `custom*`）

`modal` 渲染不透明遮罩；`hideOnClickOutside=false` 点外部不关闭；`lockScroll=false` 不再拦截 `touchmove`；`closeButtonLoading` 在关闭键上显示 spinner；`rootPortal` 为对齐占位参数（小程序无 portal host）；`customClass` / `customStyle` 挂面板。

<Demo name="keyboard-mp-scrim" description="modal；hideOnClickOutside=false；lockScroll=false；closeButtonLoading；safeAreaInsetBottom；rootPortal；customClass / customStyle。" />

## Props

| 属性                                          | 类型                             | 默认值                    | 说明                                                                      |
| --------------------------------------------- | -------------------------------- | ------------------------- | ------------------------------------------------------------------------- |
| `visible`                                     | `boolean`                        | `false`                   | 键盘显隐（`v-model:visible`）                                             |
| `modelValue`                                  | `string`                         | `''`                      | 当前输入值                                                                |
| `title`                                       | `string`                         | `''`                      | 键盘标题                                                                  |
| `mode`                                        | `'default' \| 'custom' \| 'car'` | `'default'`               | 布局预设                                                                  |
| `zIndex`                                      | `number`                         | `100`                     | 层级                                                                      |
| `maxlength`                                   | `number`                         | `Infinity`                | 最大输入长度                                                              |
| `showDeleteKey`                               | `boolean`                        | `true`                    | 是否显示删除键                                                            |
| `randomKeyOrder`                              | `boolean`                        | `false`                   | 随机排序数字键                                                            |
| `closeText` / `deleteText`                    | `string`                         | `''`                      | 关闭 / 删除文案                                                           |
| `closeButtonLoading`                          | `boolean`                        | `false`                   | 关闭按钮加载态                                                            |
| `modal` / `hideOnClickOutside` / `lockScroll` | `boolean`                        | `false` / `true` / `true` | 遮罩行为                                                                  |
| `safeAreaInsetBottom`                         | `boolean`                        | `true`                    | 底部安全区留白                                                            |
| `extraKey`                                    | `string \| string[]`             | `undefined`               | 额外按键；未提供的槽位渲染收起键盘图标键（点击发 `close`）                |
| `carLang`                                     | `'zh' \| 'en'`                   | `'zh'`                    | 车牌语言（`v-model:car-lang`）                                            |
| `autoSwitchLang`                              | `boolean`                        | `false`                   | 选省份后自动切字母                                                        |
| `customClass` / `customStyle`                 | `string`                         | `''`                      | 根节点自定义类名 / 样式                                                   |
| `rootPortal`                                  | `boolean`                        | `false`                   | 脱离页面渲染——**声明但未实现**（小程序无 portal 宿主，透传给 `sn-popup`） |

> **未实现**：`root-portal`——声明并透传给 `sn-popup`，但 uni-app 小程序没有 portal 宿主，因此没有视觉变化。

## Events

| 事件名              | 说明                                   | 参数                   |
| ------------------- | -------------------------------------- | ---------------------- |
| `update:modelValue` | 值变化时                               | `(value: string)`      |
| `update:visible`    | 显隐变化时                             | `(value: boolean)`     |
| `update:carLang`    | 车牌语言变化时                         | `(lang: 'zh' \| 'en')` |
| `input`             | 点击字符键时                           | `(key: string)`        |
| `delete`            | 点击删除键时                           | —                      |
| `close`             | 键盘关闭时（关闭按钮 / 遮罩 / 收起键） | —                      |

## Slots

本组件不提供插槽。

## 主题变量

| 变量                                                        | 用途              |
| ----------------------------------------------------------- | ----------------- |
| `--sn-mp-color-background-elevated`                         | 键盘底色          |
| `--sn-mp-color-background-soft`                             | 按键底板          |
| `--sn-mp-color-background-sunken`                           | custom 模式删除键 |
| ``--sn-mp-color-text-primary` / `-secondary` / `-tertiary`` | 按键与头部文字    |
| `--sn-mp-radius-md`                                         | 按键圆角          |
| ``--sn-mp-font-size-md` / `-sm` / `-xl``                    | 文案字号          |

## 无障碍

- 每个按键为 `role="button"`，带 `aria-label`（字形，或 delete / 关闭文案）；收起键 `aria-label="collapse"`。
- 关闭按钮在 `closeButtonLoading` 时带 `aria-busy`。
- 遮罩 `aria-hidden`；面板由 `sn-popup` 提供 `role="dialog"`。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。验证方式：
