# Tabs 标签页（Web 端）

`SnTabs` + `SnTabPane` 把内容分区，一次只展示一个面板，通过标签条切换。

## 何时使用

- 同一层级的多组内容需要并列呈现，用户会来回切换。
- 面板之间没有先后依赖，可以任意顺序访问。
- 需要在有限空间内组织大量同构信息。

不适合：步骤之间有严格先后关系时，用 `SnSteps`。

## 代码演示

### 基础用法

五种视觉样式中的 `bar`（默认）与 `line`。

<Demo name="tabs-web-basic" description="bar 与 line 两种基础样式" />

### 卡片与分段

`card` 与 `segment` 两种强调型样式。

<Demo name="tabs-web-card-segment" description="card 与 segment 样式" />

### Chrome 浏览器风格

`type="chrome"` 渲染浏览器标签行：标签条是一层浅色底，底边细线在非活动标签下方贯通；活动标签顶部圆角、直接“打开”到内容面上；相邻两个非活动标签之间有一条细分隔线；关闭位在 hover 与活动标签上才显示。与 `closable` / `addable` 组合即可得到完整的浏览器标签体验。

<Demo name="tabs-web-chrome" description="chrome 标签行：hover 显示关闭位、末尾 + 新增标签" />

标签条的 `prefix` / `suffix` 插槽可以放导航动作，等价于浏览器窗口的标签行：

<Demo name="tabs-web-chrome-toolbar" description="prefix 放前进/后退/刷新，suffix 放星标" />

### 尺寸

三档尺寸对照。

<Demo name="tabs-web-size" description="small / medium / large 三档" />

### 新增与关闭

`addable` 与 `closable` 配合宿主维护列表。

<Demo name="tabs-web-addable" description="卡片式标签的新增与关闭" />

### 切换前置守卫

`onBeforeLeave` 在切换发生前拦截。

<Demo name="tabs-web-before-leave" description="onBeforeLeave 阻止未保存的切换" />

### 触发方式

`click` 与 `hover` 两种激活手势。

<Demo name="tabs-web-trigger" description="click 与 hover 触发对照" />

### 面板留存策略

`displayDirective` 决定切走的面板是否卸载。

<Demo name="tabs-web-display-directive" description="if 与 show 两种面板留存策略" />

### 标签条宽度

`barWidth` 把标签条固定为指定宽度。

<Demo name="tabs-web-bar-width" description="barWidth 固定标签条长度" />

### 禁用标签

`disabled` 锁定单个标签。

<Demo name="tabs-web-disabled" description="禁用标签的交互与可访问性表现" />

### 位置与关闭

`placement` 改变标签条方向，配合关闭按钮。

<Demo name="tabs-web-placement-closable" description="四种 placement 叠加 closable" />

### 样式钩子

`tabsPadding` / `tabClass` / `paneClass` / `paneStyle` 等定制点。

<Demo name="tabs-web-pane-style" description="标签栏与面板的样式钩子" />

## API

### SnTabs Props

| 名称               | 类型                                                                                  | 默认值      | 说明                                                                        |
| ------------------ | ------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------- |
| `value`            | `string \| number`                                                                    | `undefined` | 受控模式下的选中值。                                                        |
| `defaultValue`     | `string \| number`                                                                    | `undefined` | 非受控模式下的初始值。                                                      |
| `type`             | `'bar' \| 'line' \| 'card' \| 'segment' \| 'chrome'`                                  | `'bar'`     | 标签样式。`chrome` 为追加式偏离（谷歌浏览器风格）。                         |
| `size`             | `'small' \| 'medium' \| 'large'`                                                      | `'medium'`  | 尺寸。                                                                      |
| `placement`        | `'left' \| 'right' \| 'top' \| 'bottom' \| 'start' \| 'end'`                          | `'top'`     | 标签条位置。                                                                |
| `trigger`          | `'click' \| 'hover'`                                                                  | `'click'`   | 激活标签的手势。                                                            |
| `closable`         | `boolean`                                                                             | `false`     | 是否允许关闭标签（所有样式均渲染关闭位，视觉上为 `card` / `chrome` 设计）。 |
| `addable`          | `boolean \| { disabled?: boolean }`                                                   | `false`     | 是否允许新增标签（同上，`chrome` 下表现为浏览器标签行末尾的圆形 `+`）。     |
| `animated`         | `boolean`                                                                             | `false`     | 切换面板时是否使用动画。                                                    |
| `justifyContent`   | `'space-between' \| 'space-around' \| 'space-evenly' \| 'start' \| 'center' \| 'end'` | `undefined` | 标签条主轴排列方式。                                                        |
| `tabsPadding`      | `number`                                                                              | `0`         | 标签栏起止方向的内边距。                                                    |
| `barWidth`         | `number`                                                                              | `undefined` | 标签条固定宽度（px）。省略时跟随标签自身宽度。                              |
| `centerActiveTab`  | `boolean`                                                                             | `false`     | 是否让活动标签滚动到标签条中心。                                            |
| `showScrollButton` | `boolean`                                                                             | `false`     | 是否显示滚动按钮。                                                          |
| `tabClass`         | `string`                                                                              | `undefined` | 每个标签的类名。                                                            |
| `tabStyle`         | `string \| Record<string, string>`                                                    | `undefined` | 每个标签的样式。                                                            |
| `addTabClass`      | `string`                                                                              | `undefined` | 新增按钮的类名。                                                            |
| `addTabStyle`      | `string \| Record<string, string>`                                                    | `undefined` | 新增按钮的样式。                                                            |
| `paneClass`        | `string`                                                                              | `undefined` | 面板的类名。                                                                |
| `paneStyle`        | `string \| Record<string, string>`                                                    | `undefined` | 面板的样式。                                                                |
| `paneWrapperClass` | `string`                                                                              | `undefined` | 面板容器的类名。                                                            |
| `paneWrapperStyle` | `string \| Record<string, string>`                                                    | `undefined` | 面板容器的样式。                                                            |
| `onBeforeLeave`    | `(name, oldName) => boolean \| Promise<boolean>`                                      | `undefined` | 切换前的守卫，返回 `false` 阻止切换。                                       |

### SnTabs Events

| 名称           | 参数               | 说明                   |
| -------------- | ------------------ | ---------------------- |
| `update:value` | `string \| number` | 选中值变化。           |
| `close`        | `string \| number` | 标签的关闭按钮被点击。 |
| `add`          | `()`               | 新增按钮被点击。       |

### SnTabs Slots

| 名称      | 参数 | 说明                 |
| --------- | ---- | -------------------- |
| `default` | `()` | 标签面板列表。       |
| `prefix`  | `()` | 标签序列之前的内容。 |
| `suffix`  | `()` | 标签序列之后的内容。 |

### SnTabPane Props

| 名称               | 类型                            | 默认值      | 说明                    |
| ------------------ | ------------------------------- | ----------- | ----------------------- |
| `name`             | `string \| number`              | —           | 面板唯一标识，必填。    |
| `tab`              | `string \| number`              | `undefined` | 标签上显示的文字。      |
| `disabled`         | `boolean`                       | `false`     | 是否禁用该标签。        |
| `closable`         | `boolean`                       | `undefined` | 覆盖父级的 `closable`。 |
| `displayDirective` | `'if' \| 'show' \| 'show:lazy'` | `'if'`      | 面板留存策略。          |

### SnTabPane Slots

| 名称      | 参数 | 说明       |
| --------- | ---- | ---------- |
| `default` | `()` | 面板内容。 |

## 面板留存

`displayDirective` 控制切走的面板是否保留：

| 值            | 行为                                                             |
| ------------- | ---------------------------------------------------------------- |
| `'if'`        | 切走后卸载，回来时重新挂载。面板内状态会丢失。                   |
| `'show'`      | 保留节点，仅切换显示。面板内状态（滚动位置、输入内容）得以保留。 |
| `'show:lazy'` | 首次显示后才保留节点 —— 兼顾懒挂载与状态保留。                   |

## 切换守卫

`onBeforeLeave` 在切换生效前调用，返回 `false`（或 resolve 为 `false` 的 Promise）会阻止切换。适合在有未保存修改时先弹确认。

## 标签条定位

`barWidth` 省略时，标签条宽度跟随活动标签自身；设为固定值后长度不再随切换跳动。

`centerActiveTab` 让活动标签始终滚动到标签条可见区域的中点，适合标签数量超出容器宽度的情况。

## 无障碍

- 标签容器 `role="tablist"`，带 `aria-orientation`。
- 每个标签 `role="tab"` + `aria-selected`；禁用标签带 `aria-disabled`。
- 活动标签 `tabindex="0"`，其余为 `-1`，符合 roving tabindex 模式。

## 已知取舍

- 面板的富文本标签（`tab` / `prefix` / `suffix` 插槽）未实现，标签条以文字渲染。
- `showScrollButton` 为声明式对齐，当前标签条为裁切而非滚动，此项为 no-op。
- `type="chrome"`（浏览器标签风格）是对 naive-ui `n-tabs` 的**追加式偏离**：上游只有
  `line` / `card` / `bar` / `segment`。该样式针对横向 `placement` 调优，竖向放置时只保留标签形状；
  标签条依然保持裁切（不改为滚动）。
