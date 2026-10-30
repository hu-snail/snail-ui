# DropMenu 下拉菜单（uni 端 / 移动端）

`sn-drop-menu` 是 `@snui/uni`（移动端 / 小程序 / H5）的筛选下拉菜单：一条菜单栏 + 一个滑出的选项面板，常用于列表页顶部的「排序 / 筛选」。基于 easycom 自动注册（`components/sn-drop-menu/sn-drop-menu.vue` → `<sn-drop-menu>`），样式几何值走 `rpx`。

> **实现说明**
>
> - 选项列表由本组件的 `options` 数组驱动（字段结构 `{ label, value, tip }`，可用 `labelKey` / `valueKey` / `tipKey` 改字段名），而不是子组件组合——uni-app 的 easycom 无法保证复合子组件在 `v-for` 下的父子联动。
> - `root-portal` 已声明但**未实现**（小程序没有 portal 宿主）。
> - `custom-popup-class` / `custom-popup-style` 作用于内联的选项面板，而不是独立弹层实例。

## 基础用法

`v-model` 保存当前选中值；`change` 回报 `{ value, selectedItem }`。`title` 设置后菜单栏优先展示标题文案。

<Demo name="drop-menu-mp-basic" description="排序菜单，含一个禁用项，选中后回报 selectedItem。" />

## 展开方向

`direction="down"`（默认）向下展开，向上用 `direction="up"`，菜单栏箭头随方向翻转：

<Demo name="drop-menu-mp-direction" description="向下 / 向上展开对比，箭头随方向切换。" />

## 选项图标

每个选项支持三种图标来源，优先级 `iconData`(对象) > `iconUrl`(图片) > `icon`(名称解析链)；`iconSize` 控制选项与勾选图标尺寸（档位名 tiny/small/medium/large/xlarge 映射 `--sn-mp-icon-size-*`，不设置时取 medium 档），选中项勾选图标由 `iconName` 指定：

<Demo name="drop-menu-mp-icon" description="选项图标三来源对比：IconData 对象、名称解析、图片地址；iconSize 档位；选中态勾选图标。" />

## 展开层级（z-index）

菜单打开时，面板与蒙层自动抬到 `--sn-drop-menu-overlay-z-index`（不低于 90）——页面浮层（导航栏、悬浮按钮、toast）不会再盖住展开的菜单；关闭时回到 `zIndex` 指定的常规层级（默认 12）。显式设置高于 90 的 `zIndex` 时以设置为准：

- 空闲：`--sn-drop-menu-z-index`（= 组件 `zIndex`）
- 展开：`--sn-drop-menu-overlay-z-index`（= `max(zIndex, 90)`）

## 开关拦截 / 字段重命名

- `direction="up"` 让面板向上展开
- `beforeToggle` 接收 `{ status }`，返回 `false` 或 `Promise<false>` 时阻止开关
- `labelKey` / `valueKey` / `tipKey` 适配后端字段名

<Demo name="drop-menu-mp-guard" description="向上展开 + beforeToggle 拦截前两次点击 + 自定义字段名。" />

## 无蒙层 / 面板高度 / 自定义面板

- `modal=false` 不渲染蒙层
- `closeOnClickModal=false` 让蒙层点击不关闭菜单
- `popupHeight` 限制面板高度（默认最多 80vh）
- `customPopupClass` / `customPopupStyle` 作用于选项面板
- `disabled` 禁用整条菜单栏
- `duration` 控制展开 / 收起动画时长
- 默认插槽可替换选项列表

<Demo name="drop-menu-mp-panel" description="modal=false 无蒙层；close-on-click-modal=false；popup-height 限制高度；custom-popup-class / custom-popup-style；disabled；default 插槽。" />
## Props

| 属性                | 类型                                          | 默认值         | 说明                               |
| ------------------- | --------------------------------------------- | -------------- | ---------------------------------- |
| `modelValue`        | `string \| number`                            | `''`           | 当前选中值（`v-model`）            |
| `options`           | `SnDropMenuOption[]`                          | `[]`           | 选项列表                           |
| `direction`         | `'up' \| 'down'`                              | `'down'`       | 展开方向                           |
| `zIndex`            | `number`                                      | `12`           | 蒙层与面板层级                     |
| `modal`             | `boolean`                                     | `true`         | 是否展示蒙层                       |
| `closeOnClickModal` | `boolean`                                     | `true`         | 点击蒙层是否关闭                   |
| `duration`          | `number`                                      | `200`          | 展开 / 收起动画时长（ms）          |
| `disabled`          | `boolean`                                     | `false`        | 是否禁用整个菜单                   |
| `iconName`          | `string`                                      | `'check'`      | 选中项图标（`sn-icon` 名）         |
| `title`             | `string`                                      | `''`           | 菜单标题，设置后优先展示           |
| `icon`              | `string`                                      | `'caret-down'` | 菜单栏箭头图标（`sn-icon` 名）     |
| `iconSize`          | `string \| number`                            | `''`           | 图标尺寸（档位名映射 `--sn-mp-icon-size-*`，数字按 px；空 = medium 档） |
| `beforeToggle`      | `({ status }) => boolean \| Promise<boolean>` | —              | 开关前拦截函数                     |
| `valueKey`          | `string`                                      | `'value'`      | 选项值字段名                       |
| `labelKey`          | `string`                                      | `'label'`      | 选项文本字段名                     |
| `tipKey`            | `string`                                      | `'tip'`        | 选项说明字段名                     |
| `customPopupClass`  | `string`                                      | `''`           | 选项面板自定义类名                 |
| `customPopupStyle`  | `string`                                      | `''`           | 选项面板自定义样式                 |
| `popupHeight`       | `string`                                      | `''`           | 面板高度；不设置时最高为视口 80%   |
| `customClass`       | `string`                                      | `''`           | 根节点自定义类名                   |
| `customStyle`       | `string`                                      | `''`           | 根节点自定义样式                   |
| `rootPortal`        | `boolean`                                     | `false`        | **未实现**（小程序无 portal 宿主） |

### SnDropMenuOption

| 字段       | 类型               | 说明                                                    |
| ---------- | ------------------ | ------------------------------------------------------- |
| `label`    | `string`           | 选项文本（字段名可配置）                                |
| `value`    | `string \| number` | 选项值，通过 `v-model` 回报（字段名可配置）              |
| `tip`      | `string`           | 选项说明行（字段名可配置）                              |
| `disabled` | `boolean`          | 禁用该项                                                |
| `iconData` | `IconData`         | 选项图标：内置图标集对象（优先级最高）                  |
| `iconUrl`  | `string`           | 选项图标：图片地址（渲染为 `<image>`，低于 `iconData`） |
| `icon`     | `string`           | 选项图标：名称解析链（最低优先级）                      |

## Events

| 事件名              | 说明                       | 参数                        |
| ------------------- | -------------------------- | --------------------------- |
| `update:modelValue` | 选中值变化                 | `(value: string \| number)` |
| `change`            | 选中选项                   | `{ value, selectedItem }`   |
| `open`              | 菜单开始展开               | —                           |
| `opened`            | 展开动画结束               | —                           |
| `close`             | 菜单开始关闭               | —                           |
| `closed`            | 关闭动画结束（面板已卸载） | —                           |

## Slots

| 插槽名    | 说明                             |
| --------- | -------------------------------- |
| `default` | 自定义面板内容，替换默认选项列表 |

## 方法

| 方法名         | 说明                            |
| -------------- | ------------------------------- |
| `getShowPop()` | 获取当前菜单是否展开            |
| `open()`       | 打开菜单（会走 `beforeToggle`） |
| `close()`      | 关闭菜单（会走 `beforeToggle`） |
| `toggle()`     | 切换菜单开关                    |

## 主题变量

| 变量                                                            | 用途                   |
| --------------------------------------------------------------- | ---------------------- |
| `--sn-mp-color-background-elevated`                             | 菜单栏 / 面板底色      |
| `--sn-mp-color-background-overlay`                              | 蒙层                   |
| `--sn-mp-color-text-primary`                                    | 菜单栏与选项文字       |
| `--sn-mp-color-text-secondary` / `--sn-mp-color-text-tertiary`  | 占位文案、说明行、箭头 |
| `--sn-mp-color-action-primary`                                  | 选中项与箭头激活色     |
| `--sn-mp-color-text-disabled`                                   | 禁用态                 |
| `--sn-mp-color-border-subtle`                                   | 面板与选项分隔线       |
| `--sn-mp-shadow-md`                                             | 面板阴影               |
| `--sn-mp-spacing-2` / `--sn-mp-spacing-3` / `--sn-mp-spacing-4` | 内边距                 |
| `--sn-mp-font-size-md` / `--sn-mp-font-size-xs`                 | 选项文字与说明行字号   |
| `--sn-mp-icon-size-medium`（档位默认）                          | 选项与勾选图标尺寸     |

## AI Patch Boundary

- AI 可通过 Patch 修改 `options`（含选项文本 / 值 / 禁用态 / 图标配置）、`title` / `disabled` / `direction` 等展示配置。
- `modelValue` / `change` 与 `open` / `close` 系列事件属于运行时交互，Patch 不应伪造开关或选中事件。
- `zIndex` 属于宿主层级决策；Patch 只应调整 `options` 与展示字段，不应随意抬高全局层级。
- 默认插槽内容属于业务数据，Patch 只应调整容器配置，不应改写插槽内部结构。

## 无障碍

- 菜单栏带 `role="button"` + `aria-expanded` + `aria-disabled`
- 选项行带 `role="menuitem"` + `aria-disabled`
- 蒙层 `aria-hidden="true"`
- 交互统一用 `@tap`；移动端无键盘焦点陷阱

## 暗色模式

菜单栏、面板、分隔线分别走 `--sn-mp-color-background-elevated`、`--sn-mp-color-border-subtle`，蒙层走 `--sn-mp-color-background-overlay`，三者都在 `@snui/tokens-mp/styles` 的 `.sn-theme-dark` 块里覆盖，因此暗色下自动适配。可用 `<sn-config-provider theme="dark">` 包裹验证。

## 相关

- 气泡式操作菜单：[`sn-popover`](/components/uni/popover)
- 底部动作面板：[`sn-action-sheet`](/components/uni/action-sheet)
