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

## 变体（`variant`：`base` / `plain` / `dashed` / `soft` / `subtle` / `text`）

<Demo name="button-mp-variant" description="variant 6 档：base 填充实心、plain 透明描边、dashed 虚线、soft 浅色填充、subtle 极淡灰底、text 纯文字。" />

## Cell 列表化（`cell`：`hover` / `fill` / `menu`）

<Demo name="button-mp-cell" description="Cell 列表化：hover 按下灰底、fill 常驻灰底、menu 透明无圆角。" />

## 自定义背景 / 颜色 / loading 颜色（`bgColor` / `color` / `loadingColor` / `loadingSize`）

<Demo name="button-mp-custom" description="bgColor / color 覆盖；loadingColor 改 spinner 颜色；loadingSize 改 rpx 尺寸。" />

## 字体图标（`icon` / `class-prefix` / `css-icon`）

`icon` 走 wot-ui 的 iconfont 路径：组件把 `icon` 转给内嵌 sn-icon，渲染 `<view class="{classPrefix}-{icon}">`，字形由宿主加载的 iconfont 样式表提供。`class-prefix` 默认 `sn-icon`；`css-icon` 传字符串时该值直接当类前缀，传布尔值且同时给了 `icon` 时会同时挂两个类名。与 `iconData` / `iconName` 的 SVG 路径互斥（SVG 优先）。

<Demo name="button-mp-iconfont" description="icon + class-prefix 拼出 {prefix}-{icon}；css-icon 字符串原样渲染；css-icon 布尔同时挂两个类名。" />

## loading 配置与细边框（`loading-props` / `hairline`）

`loading-props` 是 wot-ui `wd-button` 的对象写法（`{ color, size, text }`），本组件读 `color` / `size` 两项，其余字段忽略 —— 为 wd-button 写的配置能原样通过。扁平的 `loading-color` / `loading-size` 优先，没设时才回落到 `loading-props`。

`hairline` 只对 `type="default"` 生效（其它类型本来就有语义色描边），默认 `true`，置 `false` 后边框变透明。

<Demo name="button-mp-loading-props" description="loading-props 的 color / size；扁平 prop 优先；hairline 与 loading 叠加对比。" />

## 开放能力（`open-type`，MP-only）

<Demo name="button-mp-open-type" description="open-type: share / feedback / launchApp / contact / getUserInfo / openSetting / favorite / chooseAvatar。" />

## 扩展参数（`session-from` / `send-message-*` / `app-parameter` / `scope` …）

`open-type` 之外，微信 / 支付宝还要求一组配套属性。组件把它们原样透传到根节点：H5 预览里没有平台能力，属性挂上但不触发行为；小程序运行时读到同一个属性才走平台 API。

| 属性 | 归属 |
| --- | --- |
| `session-from` / `send-message-title` / `send-message-path` / `send-message-img` / `show-message-card` | `open-type="contact"` 客服会话卡片 |
| `app-parameter` | `open-type="launchApp"` 拉起 App 时携带的参数 |
| `lang` | 客服会话语言：`zh_CN` / `zh_TW` / `en` |
| `button-id` | 客服消息定位用的唯一标识 |
| `scope` | 支付宝授权范围（`phoneNumber` / `userInfo`） |
| `hover-stop-propagation` | 通用：按下态不冒泡到祖先节点 |

<Demo name="button-mp-mp-open-type" description="open-type 扩展参数透传：contact 会话配置、lang 三档、app-parameter、scope、hover-stop-propagation。" />

## 按住反馈（`hover-class` / `hover-start-time` / `hover-stay-time`）

<Demo name="button-mp-hover" description="自定义 press 反馈 class；hover-start-time 按住多久触发；hover-stay-time 松手后多久消失。" />

## 表单提交类型（`form-type`，MP-only）

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
| `variant` | `'base' \| 'plain' \| 'dashed' \| 'soft' \| 'subtle' \| 'text'` | `'base'` | 视觉变体：填充、描边、虚线、浅填充、极淡灰底、纯文字。 |
| `cell` | `'hover' \| 'fill' \| 'menu'` | — | Cell 列表化样式。 |
| `loadingColor` | `string` | `''` | 自定义 spinner 颜色。 |
| `loadingSize` | `number \| string` | `32` | spinner rpx / px 尺寸。 |
| `hoverClass` | `string` | `'sn-button--feedback'` | 触摸反馈 class。 |
| `hoverStartTime` | `number` | `0` | 按住多久触发 hoverClass。 |
| `hoverStayTime` | `number` | `70` | 松手后多久撤销 hoverClass。 |
| `openType` | `'share' \| 'feedback' \| 'launchApp' \| 'contact' \| 'getUserInfo' \| 'openSetting' \| 'lifestyle' \| 'livePlayer' \| 'favorite' \| 'chooseAvatar' \| 'weRunGroup'` | — | 微信小程序 open-type 透传。 |
| `formType` | `'submit' \| 'reset'` | — | 表单提交类型。 |
| `bgColor` | `string` | `''` | 内联 `background-color` 覆盖。 |
| `color` | `string` | `''` | 内联 `color` + `border-color` 覆盖。 |
| `customClass` | `string` | `''` | 根元素额外 class。 |
| `customStyle` | `string \| Record<string,string>` | `''` | 根元素内联样式。 |
| `iconData` | `IconData` | — | frozen `{ viewBox, paths }`。 |
| `iconName` | `string` | — | 通过 `registerSnIcons` 解析。 |
| `iconSize` | `number \| string` | `32` | rpx / px 尺寸。 |
| `icon` | `string` | `''` | 字体图标名（iconfont 路径），拼成 `{classPrefix}-{icon}`。 |
| `classPrefix` | `string` | `'sn-icon'` | 字体图标类名前缀。 |
| `cssIcon` | `boolean \| string` | `false` | 字符串时该值直接当类前缀；布尔 + `icon` 时两种类名同时挂。 |
| `loadingProps` | `{ color?, size?, text?, … }` | — | wot-ui `loading-props` 对象写法；扁平 `loadingColor` / `loadingSize` 优先。 |
| `hoverStopPropagation` | `boolean` | `false` | 按下态不冒泡到祖先节点。 |
| `lang` | `'zh_CN' \| 'zh_TW' \| 'en' \| ''` | `''` | `open-type=contact` 会话语言。 |
| `sessionFrom` | `string` | `''` | `open-type=contact` 会话来源。 |
| `sendMessageTitle` | `string` | `''` | `open-type=contact` 消息卡片标题。 |
| `sendMessagePath` | `string` | `''` | `open-type=contact` 消息卡片路径。 |
| `sendMessageImg` | `string` | `''` | `open-type=contact` 消息卡片图片。 |
| `appParameter` | `string` | `''` | `open-type=launchApp` 携带参数。 |
| `showMessageCard` | `boolean` | `false` | `open-type=contact` 是否展示会话卡片。 |
| `buttonId` | `string` | `''` | 客服消息定位用的唯一标识。 |
| `scope` | `'phoneNumber' \| 'userInfo' \| ''` | `''` | 支付宝授权范围。 |
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