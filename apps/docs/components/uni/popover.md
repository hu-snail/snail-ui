# Popover 气泡卡片（uni 端 / 移动端）

`sn-popover` 是 `@snui/uni`（移动端 / 小程序 / H5）的气泡卡片：一个触发器加一个气泡，支持 `normal`（纯文本 / 自定义内容）与 `menu`（可点选项列表）两种模式。基于 easycom 自动注册（`components/sn-popover/sn-popover.vue` → `<sn-popover>`），样式几何值走 `rpx`。

> **与 wot-ui 的差异**
>
> - 小程序没有 `hover`，触发器固定用**点击**切换，因此不声明 `trigger` 属性。
> - 点击气泡外部关闭遵循 wot-ui 的 `useQueue` 方案：页面根节点绑定 `@tap="closeOutside"`，点任意空白处关闭所有弹窗（tooltip / popover / drop-menu / toast / swipe-action / fab）；触发器与气泡已 `@tap.stop`，点另一个触发器可一步切换。组件自身不再渲染遮罩。
> - `root-portal` 已声明但**未实现**（小程序没有 portal 宿主）。
> - `updatePosition()` 是兼容占位：气泡位置由 CSS 决定。
> - `iconClass` 取 `sn-icon` 注册表名或图片地址，不是 CSS 类名（uni 端没有字体图标层）。

## 基础用法

`normal` 模式下 `content` 是字符串；`showClose` 在气泡内加关闭按钮。点击气泡外部（页面根节点 `closeOutside`）或再点一次触发器收起。

<Demo name="popover-mp-basic" description="normal 模式 + 关闭按钮，点击触发器切换，点击外部自动关闭。" />

## 菜单模式

`mode="menu"` 时 `content` 是选项数组，点中某项触发 `menuclick` 并回报 `{ item, index }`。`disabled` 的选项不响应点击。

<Demo name="popover-mp-menu" description="菜单模式，图标来自 sn-icon 注册表，含一个禁用项。" />

## 位置 / 箭头 / 禁用 / 配色

- `placement` 支持 `top` / `bottom` / `left` / `right` 四组、每组 `-start` / `-end` 对齐变体（共 12 档）
- `visibleArrow=false` 去掉箭头
- `offset` 支持 `number`、`[x, y]`、`{ x, y }`，单位是设计稿 px
- `disabled` 让触发器点击失效

- 气泡配色通过 `--sn-popover-bg` / `--sn-popover-color` 覆盖，默认白底深字（见「主题变量」）

<Demo name="popover-mp-placement" description="12 个方位全部展示（wot-ui demo 网格布局），一次只开一个。" />

## 图片图标 / content 插槽 / 节点类名

- 菜单项的 `iconClass` 既可是 `sn-icon` 注册名，也可直接是图片地址（`http` / `//` / `/` / `./` 开头时按 `<image>` 渲染）
- `content` 插槽完全替换气泡正文，normal / menu 两种模式都可用
- `custom-arrow` / `custom-pop` 分别给箭头节点与气泡节点追加类名
- `offset` 与 `custom-style` 同时作用在根节点

<Demo name="popover-mp-slot" description="菜单模式的图片图标；content 插槽自定义正文；custom-arrow / custom-pop 追加类名；offset 与 custom-style。" />
## Props

| 属性           | 类型                               | 默认值     | 说明                                         |
| -------------- | ---------------------------------- | ---------- | -------------------------------------------- |
| `modelValue`   | `boolean`                          | `false`    | 是否显示（`v-model`）                        |
| `content`      | `string \| SnPopoverMenuItem[]`    | `''`       | `normal` 模式为字符串，`menu` 模式为选项数组 |
| `mode`         | `'normal' \| 'menu'`               | `'normal'` | 显示模式                                     |
| `placement`    | 12 档方向联合类型                  | `'bottom'` | 弹出位置                                     |
| `offset`       | `number \| number[] \| { x?, y? }` | `0`        | 偏移量（设计稿 px）                          |
| `visibleArrow` | `boolean`                          | `true`     | 是否显示箭头                                 |
| `disabled`     | `boolean`                          | `false`    | 是否禁用                                     |
| `showClose`    | `boolean`                          | `false`    | 是否显示关闭按钮                             |
| `customClass`  | `string`                           | `''`       | 根节点自定义类名                             |
| `customStyle`  | `string`                           | `''`       | 根节点自定义样式                             |
| `customArrow`  | `string`                           | `''`       | 箭头节点自定义类名                           |
| `customPop`    | `string`                           | `''`       | 气泡节点自定义类名                           |
| `rootPortal`   | `boolean`                          | `false`    | **未实现**（小程序无 portal 宿主）           |

### SnPopoverMenuItem

| 字段        | 类型      | 说明                           |
| ----------- | --------- | ------------------------------ |
| `content`   | `string`  | 选项文案                       |
| `iconClass` | `string`  | `sn-icon` 注册表名，或图片地址 |
| `disabled`  | `boolean` | 禁用该项                       |

## Events

| 事件名              | 说明                  | 参数                                         |
| ------------------- | --------------------- | -------------------------------------------- |
| `update:modelValue` | 显隐变化              | `(value: boolean)`                           |
| `open`              | 气泡显示时触发        | —                                            |
| `close`             | 气泡关闭时触发        | —                                            |
| `change`            | 显隐状态变化时触发    | `{ show: boolean }`                          |
| `menuclick`         | `menu` 模式下点击选项 | `{ item: SnPopoverMenuItem, index: number }` |

## Slots

| 插槽名    | 说明                                         |
| --------- | -------------------------------------------- |
| `default` | 触发器内容                                   |
| `content` | 自定义气泡内容（两种模式下都替换 `content`） |

## 方法

| 方法名             | 说明                 |
| ------------------ | -------------------- |
| `open()`           | 打开气泡             |
| `close()`          | 关闭气泡             |
| `updatePosition()` | 兼容占位，无实际操作 |

## 主题变量

| 变量                                                            | 用途            |
| --------------------------------------------------------------- | --------------- |
| `--sn-popover-bg`                                               | 气泡底色（默认 `--sn-mp-color-background-elevated`，亮色主题即白色；箭头同色；可用 `custom-style` 覆盖） |
| `--sn-popover-color`                                            | 气泡 / 选项文字色（默认 `--sn-mp-color-text-primary`）                                                   |
| `--sn-mp-color-text-secondary`                                  | 选项图标        |
| `--sn-mp-color-text-disabled`                                   | 禁用选项        |
| `--sn-mp-color-border-subtle`                                   | 气泡与箭头描边  |
| `--sn-mp-shadow-md`                                             | 气泡阴影        |
| `--sn-mp-radius-md`                                             | 气泡圆角        |
| `--sn-mp-spacing-2` / `--sn-mp-spacing-3` / `--sn-mp-spacing-4` | 内边距与间距    |
| `--sn-mp-font-size-sm`                                          | 气泡字号        |

## 无障碍

- 触发器带 `role="button"` + `aria-expanded` + `aria-disabled`
- 气泡带 `role="dialog"`，箭头 `aria-hidden="true"`
- `menu` 模式选项带 `role="menuitem"` + `aria-disabled`
- 交互统一用 `@tap`；移动端无键盘焦点陷阱

## 暗色模式

气泡底色走 `--sn-popover-bg`（默认 `--sn-mp-color-background-elevated`，亮色主题即白色）、文字走 `--sn-popover-color`（默认 `--sn-mp-color-text-primary`），两个默认 token 都在 `@snui/tokens-mp/styles` 的 `page.sn-theme-dark, .sn-theme-dark` 块里覆盖，因此暗色下自动适配。需要自定义配色时，用 `custom-style="--sn-popover-bg: …; --sn-popover-color: …"` 覆盖（对齐 wot-ui 的 `--wot-popover-bg` / `--wot-popover-color`），覆盖后请自行保证暗色下的对比度。可用 `<sn-config-provider theme="dark">` 包裹验证。

## 相关

- 纯文本提示：[`sn-tooltip`](/components/uni/tooltip)
- 页面级下拉筛选：`sn-drop-menu`
