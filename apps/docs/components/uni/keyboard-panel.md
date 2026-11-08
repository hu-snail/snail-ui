# KeyboardPanel 键盘面板（uni 端 / 移动端）

`sn-keyboard-panel` 是 `sn-keyboard` 的**内嵌面板视图**（additive —— 参考库无 panel 变体，登记于 AGENTS.md §112.3a）：同样的数字 / 车牌 / 自定义键位布局（键位模型与 `sn-keyboard` 共享 `sn-keyboard-keys.ts`），但**没有弹层**——不渲染蒙层、无 `visible` / `close` 语义，直接嵌在页面里，显隐与定位由宿主容器决定。适合放在输入行下方、宿主自绘的抽屉内或任何自定义容器中。

底行始终占满三格（与 `sn-keyboard` 同一契约）：`extraKey` 未提供的槽位渲染**收起键盘图标键**，在面板里点击发 `collapse` 事件（没有面板可关——由宿主决定收起自己的容器还是切回系统输入），因此不会出现空位或超宽的 `0`。头部仅在有内容时渲染：`title` 或 `mode="car"` 的语言切换键；无关闭按钮。

## 基础用法

默认面板 + 小数点面板 + 车牌面板；收起键发 `collapse` 事件。

<Demo name="keyboard-panel-mp-basic" description="内嵌键盘面板：默认 / 小数点（extraKey=.）/ 车牌（mode=car），收起键发 collapse 事件。" />

## Props

| 属性                          | 类型                             | 默认值      | 说明                                                      |
| ----------------------------- | -------------------------------- | ----------- | --------------------------------------------------------- |
| `modelValue`                  | `string`                         | `''`        | 当前输入值（`v-model`）                                   |
| `mode`                        | `'default' \| 'custom' \| 'car'` | `'default'` | 布局预设                                                  |
| `maxlength`                   | `number`                         | `Infinity`  | 最大输入长度                                              |
| `showDeleteKey`               | `boolean`                        | `true`      | 是否显示删除键                                            |
| `randomKeyOrder`              | `boolean`                        | `false`     | 随机排序数字键                                            |
| `extraKey`                    | `string \| string[]`             | `undefined` | 额外按键；未提供的槽位渲染收起图标键（点击发 `collapse`） |
| `carLang`                     | `'zh' \| 'en'`                   | `'zh'`      | 车牌语言（`v-model:car-lang`）                            |
| `autoSwitchLang`              | `boolean`                        | `false`     | 选省份后自动切字母                                        |
| `title`                       | `string`                         | `''`        | 可选标题；头部仅在有内容时渲染                            |
| `deleteText`                  | `string`                         | `''`        | 删除键 aria 文案                                          |
| `customClass` / `customStyle` | `string`                         | `''`        | 根节点自定义类名 / 样式                                   |

## Events

| 事件名              | 说明                                     | 参数                   |
| ------------------- | ---------------------------------------- | ---------------------- |
| `update:modelValue` | 值变化时                                 | `(value: string)`      |
| `update:carLang`    | 车牌语言变化时                           | `(lang: 'zh' \| 'en')` |
| `input`             | 点击字符键时                             | `(key: string)`        |
| `delete`            | 点击删除键时（**长按连续退格**）         | —                      |
| `collapse`          | 点击收起键（面板无关闭语义，由宿主处理） | —                      |

## 与 sn-keyboard 的差异

- 无弹层体系：`visible` / `closeText` / `closeButtonLoading` / `modal` / `hideOnClickOutside` / `lockScroll` / `safeAreaInsetBottom` / `rootPortal` 均不存在。
- 头部仅含标题与（car 模式的）语言切换，无关闭按钮。
- 收起键发 `collapse` 事件而非关闭弹层。
- 面板四角圆角（`--sn-mp-radius-xl`）；键位几何 hook 复用 `--sn-keyboard-*` 变量名，一处覆写两个组件同时生效。

## 主题变量

| 变量                                                      | 用途                                 |
| --------------------------------------------------------- | ------------------------------------ |
| `--sn-mp-color-background-subtle`                         | 面板底色                             |
| `--sn-mp-color-background-elevated`                       | 键帽                                 |
| `--sn-mp-color-background-sunken`                         | 车牌功能键                           |
| `--sn-mp-color-action-primary`                            | custom 模式收起键                    |
| `--sn-mp-color-text-primary` / `-secondary` / `-tertiary` | 按键与头部文字                       |
| `--sn-keyboard-key-height` / `-gap` / `-key-radius`       | 键位几何 hook（与 sn-keyboard 共享） |

## 无障碍

- 根节点 `role="group"` `aria-label="keyboard"`；每个按键为 `role="button"` 带 `aria-label`。
- 收起键 `aria-label="collapse"`；删除键 aria 取 `deleteText`（默认「删除」）。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` 下自动翻转。验证方式：`<sn-config-provider theme="dark">` 包裹本组件。
