# Button 按钮（uni 端 / 移动端）

`sn-button` 是 `@snui/uni`（移动端 / 小程序 / H5）核心交互组件。基于 easycom 自动注册，rpx 单位跨设备缩放。

## 自动注册（easycom）

如需显式 import：

```ts
import { SnButton } from '@snui/uni'
```

> easycom 是 uni-app 生态的官方按需注册系统。**Web 端没有 easycom**，必须显式 import（`import { SnButton } from '@snui/vue-web'`）。

## 基础用法

<Demo name="button-mp-basic" description="6 种语义类型：primary / success / warning / danger / info / default。" />

## 尺寸

3 档 `small` / `medium` / `large`（移动端场景不需要 tiny / huge）。对应 `--sn-mp-button-height-{small,medium,large}`（自动按 750 设计稿转为 rpx）。

<Demo name="button-mp-size" description="三档高度。" />

## 块级与圆角

移动端块级按钮（占满父容器宽度）很常用：

<Demo name="button-mp-shape" description="block 占满父容器宽度，round 应用胶囊形圆角。" />

## 状态

<Demo name="button-mp-state" description="disabled 完全禁用；loading 显示 spinner 且不可点击；可手动触发 loading 状态。" />

## Variant: base / plain / dashed / soft / subtle / text

<Demo name="button-mp-variant" description="wot-ui variant 6 档：base 填充实心、plain 透明描边、dashed 虚线、soft 浅色填充、subtle 极淡灰底、text 纯文字。" />

## Cell: hover / fill / menu

<Demo name="button-mp-cell" description="Cell 列表化：hover 按下灰底、fill 常驻灰底、menu 透明无圆角。" />

## 自定义背景 / 颜色 / loading 颜色

<Demo name="button-mp-custom" description="bgColor / color 覆盖；loadingColor 改 spinner 颜色；loadingSize 改 rpx 尺寸。" />

## Open-type（MP-only）

<Demo name="button-mp-open-type" description="open-type: share / feedback / launchApp / contact / getUserInfo / openSetting / favorite / chooseAvatar。" />

## hover-class / hover-start-time / hover-stay-time

<Demo name="button-mp-hover" description="自定义 press 反馈 class；hover-start-time 按住多久触发；hover-stay-time 松手后多久消失。" />

## formType（MP-only）

<Demo name="button-mp-form-type" description="form-type='submit' 提交表单；form-type='reset' 重置表单。" />

> **关键差异**：uni 端需要 `import '@snui/tokens-mp/styles'` 引入 rpx 别名层（Web 端是 `import '@snui/tokens-web/styles'`）。

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'primary' \| 'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | 按钮语义类型。 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 按钮尺寸。 |
| `block` | `boolean` | `false` | 块级。 |
| `round` | `boolean` | `false` | 胶囊形。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `loading` | `boolean` | `false` | 加载中（spinner + 阻止 click）。 |
| `hairline` | `boolean` | `true` | 显示细边框（default 类型）。 |
| `feedback` | `boolean` | `true` | 点击反馈（active 透明度）。 |
| `plain` | `boolean` | `false` | 低强调度样式（v1: 等价 `variant='plain'`）。 |
| `variant` | `'base' \| 'plain' \| 'dashed' \| 'soft' \| 'subtle' \| 'text'` | `'base'` | wot-ui `wd-button variant`。 |
| `cell` | `'hover' \| 'fill' \| 'menu'` | — | Cell 列表化样式（wot-ui `wd-button cell`）。 |
| `loadingColor` | `string` | `''` | 自定义 spinner 颜色。 |
| `loadingSize` | `number \| string` | `32` | spinner rpx / px 尺寸。 |
| `hoverClass` | `string` | `'sn-button--feedback'` | 触摸反馈 class。 |
| `hoverStartTime` | `number` | `0` | 按住多久触发 hoverClass。 |
| `hoverStayTime` | `number` | `70` | 松手后多久撤销 hoverClass。 |
| `openType` | `'share' \| 'feedback' \| 'launchApp' \| 'contact' \| 'getUserInfo' \| 'openSetting' \| 'lifestyle' \| 'livePlayer' \| 'favorite' \| 'chooseAvatar' \| 'weRunGroup'` | — | 微信小程序 open-type 透传。 |
| `formType` | `'submit' \| 'reset'` | — | 表单提交类型（wot-ui `wd-button form-type`）。 |
| `bgColor` | `string` | `''` | 内联 `background-color` 覆盖。 |
| `color` | `string` | `''` | 内联 `color` + `border-color` 覆盖。 |
| `customClass` | `string` | `''` | 根元素额外 class。 |
| `customStyle` | `string \| Record<string,string>` | `''` | 根元素内联样式。 |
| `iconData` | `IconData` | — | frozen `{ viewBox, paths }`。 |
| `iconName` | `string` | — | 通过 `registerSnIcons` 解析。 |
| `iconSize` | `number \| string` | `32` | rpx / px 尺寸。 |
| `ariaLabel` | `string` | — | 无障碍标签。 |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `click` | `(event: Event)` | 点击按钮触发（移动端用 `tap` 事件）。 |

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 按钮内容。 |
| `icon` | 自定义图标。 |
| `loading` | 自定义加载图标。 |

## 跨平台行为

| 端 | 行为 |
| --- | --- |
| H5 | 渲染为 `<button>`，触摸事件触发 click |
| 微信小程序 | 编译为原生 view，自动注册 tap；支持 `open-type` |
| 支付宝小程序 | 同上 |
| App（uni-app x） | 原生渲染，触摸反馈 |
| 抖音小程序 | 同微信小程序 |

> 跨平台一致性由 uni-app 保证，组件源码不变。

## 无障碍

- `role="button"`
- `disabled` 时设置 `aria-disabled="true"`
- `loading` 时设置 `aria-busy="true"`
- 移动端通过 tap 触发（无键盘事件）
- 小程序语义化节点（`button` 标签由编译器包裹）

## 相关

- Web 端：[`SnButton`](/components/web/button)（含 text/ghost/dashed/circle/strong/secondary/tertiary/quaternary 等变体）