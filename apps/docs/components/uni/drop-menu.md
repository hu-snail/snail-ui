# DropMenu 下拉菜单（uni 端 / 移动端）

`sn-drop-menu` 是 `@snui/uni`（移动端 / 小程序 / H5）的筛选下拉菜单：一条菜单栏 + 一个滑出的选项面板，常用于列表页顶部的「排序 / 筛选」。基于 easycom 自动注册（`components/sn-drop-menu/sn-drop-menu.vue` → `<sn-drop-menu>`），样式几何值走 `rpx`。

> **与 wot-ui 的差异**
>
> - wot-ui 用 `wd-drop-menu` + `wd-drop-menu-item` 子组件组合；uni-app 的 easycom 无法要求复合子组件（`v-for` 一个子组件也会丢掉父子联动），因此选项列表改为本组件的 `options` 数组（字段结构 `{ label, value, tip }`，可用 `labelKey` / `valueKey` / `tipKey` 改字段名）。
> - `root-portal` 已声明但**未实现**（小程序没有 portal 宿主）。
> - `custom-popup-class` / `custom-popup-style` 作用于内联的选项面板，而不是 `wd-popup` 实例。

## 基础用法

`v-model` 保存当前选中值；`change` 回报 `{ value, selectedItem }`。`title` 设置后菜单栏优先展示标题文案。

<Demo name="drop-menu-mp-basic" description="排序菜单，含一个禁用项，选中后回报 selectedItem。" />

## 展开方向 / 开关拦截 / 字段重命名

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
| `iconSize`          | `string \| number`                            | `32`           | 箭头图标尺寸（设计稿 px）          |
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

| 字段       | 类型               | 说明                                        |
| ---------- | ------------------ | ------------------------------------------- |
| `label`    | `string`           | 选项文本（字段名可配置）                    |
| `value`    | `string \| number` | 选项值，通过 `v-model` 回报（字段名可配置） |
| `tip`      | `string`           | 选项说明行（字段名可配置）                  |
| `disabled` | `boolean`          | 禁用该项                                    |

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

## 无障碍

- 菜单栏带 `role="button"` + `aria-expanded` + `aria-disabled`
- 选项行带 `role="menuitem"` + `aria-disabled`
- 蒙层 `aria-hidden="true"`
- 交互统一用 `@tap`；移动端无键盘焦点陷阱

## 暗色模式

菜单栏、面板、分隔线分别走 `--sn-mp-color-background-elevated`、`--sn-mp-color-border-subtle`，蒙层走 `--sn-mp-color-background-overlay`，三者都在 `@snui/tokens-mp/styles` 的 `page.sn-theme-dark, .sn-theme-dark` 块里覆盖，因此暗色下自动适配。可用 `<sn-config-provider theme="dark">` 包裹验证。

## 相关

- 气泡式操作菜单：[`sn-popover`](/components/uni/popover)
- 底部动作面板：[`sn-action-sheet`](/components/uni/action-sheet)
