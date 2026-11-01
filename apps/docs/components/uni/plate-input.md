# PlateInput 车牌输入框（uni 端 / 移动端）

`sn-plate-input` 是 `@snui/uni` 的车牌输入框：每个车牌位一个方框，点击方框行弹起无蒙层的共享 `sn-keyboard`（`mode: 'car'`）车牌虚拟键盘——省份 → 字母/数字布局自动切换、长按退格连删、弹层与安全区归键盘所有，页面保持可见可交互，本组件只接值与显隐。easycom 自动注册（`components/sn-plate-input/sn-plate-input.vue` → `<sn-plate-input>`），几何值使用 `rpx`。光标是纯 CSS（静态 2rpx 竖条，仅键盘弹出时显示），没有定时器，因此无需清理。

## 基础用法

点击方框行弹起车牌键盘：省份键盘选完第一个字自动切到字母/数字布局，长按删除键连删；再点一次字段或点完成收起；清空后下一块车牌重新从省份开始。

<Demo name="plate-input-mp-basic" description="点击格子弹起无蒙层车牌键盘（sn-keyboard mode='car'）：省份→字母/数字自动切换、长按删除连删，再点一次字段或点完成收起。" />

## 新能源车牌与禁用态

`maxlength=8` 渲染 8 格（新能源车牌）；`disabled` 冻结字段，点击不再弹键盘。

<Demo name="plate-input-mp-new-energy" description="maxlength=8 的新能源车牌（8 格），disabled 冻结输入。" />

## Props

| 属性                          | 类型                   | 默认值           | 说明                                                   |
| ----------------------------- | ---------------------- | ---------------- | ------------------------------------------------------ |
| `modelValue`                  | `string`               | `''`             | 当前车牌（如 `京A12345`）                              |
| `maxlength`                   | `number`               | `7`              | 方框数量（普通车牌 7，新能源 8）                       |
| `title`                       | `string`               | `'请输入车牌号'` | 键盘标题                                               |
| `disabled`                    | `boolean`              | `false`          | 冻结字段，点击不再弹起键盘                             |
| `visible`                     | `boolean \| undefined` | `undefined`      | 键盘显隐（`v-model:visible`）；不传 = 非受控，点击自开 |
| `customClass` / `customStyle` | `string`               | `''`             | 根节点自定义类名 / 样式                                |

## Events

| 事件名              | 说明                            | 参数               |
| ------------------- | ------------------------------- | ------------------ |
| `update:modelValue` | 值变化时（已截断到格数）        | `(value: string)`  |
| `change`            | 值变化时（同 tick）             | `(value: string)`  |
| `update:visible`    | 键盘显隐变化                    | `(value: boolean)` |
| `open`              | 点击字段、键盘即将弹起          | —                  |
| `close`             | 键盘收起（再点字段 / 完成按钮） | —                  |

## Slots

本组件不提供插槽。

## 主题变量

| 变量                                                                    | 用途                                    |
| ----------------------------------------------------------------------- | --------------------------------------- |
| `--sn-plate-input-gap` / `-box-bg` / `-radius`                          | 组件局部 hook（间距 / 格子底色 / 圆角） |
| `--sn-mp-color-input-bg` / `-border` / `-border-focus` / `-text`        | 方框底色 / 边框 / 聚焦边框 / 文字       |
| `--sn-mp-color-border-subtle` / `-background-subtle` / `-text-disabled` | 禁用态方框                              |
| `--sn-mp-color-action-primary`                                          | 光标                                    |
| `--sn-mp-radius-md`                                                     | 方框圆角                                |
| `--sn-mp-font-size-xl`                                                  | 字形字号                                |

## 无障碍

- 方框行 `role="group"`，`aria-label` 为 "plate number, N of M"。
- 每个方框带 `aria-label`（position N）；冻结时根节点带 `aria-disabled`。
- 键盘本体由 `sn-keyboard` 提供，遵循它自己的无障碍契约。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。键盘（`sn-keyboard`）与弹层（`sn-popup`）同理。
