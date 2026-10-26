# FloatButton 浮动按钮（Web 端）

`SnFloatButton` 是固定在视口某一角的悬浮操作按钮，`SnFloatButtonGroup` 把多个
`SnFloatButton` 收拢到同一个角上，点开触发器后向上堆叠展开。

## 何时使用

- 页面滚动过程中需要一直可达的入口：新建、帮助、回到顶部、分享。
- 页面右下角有多个悬浮入口，希望默认收成一个触发器，点开后再展开。
- 需要「圆形图标 + 方形带文字」两种形态、数量徽标或跳转链接的悬浮入口。

不适合：内容本身就是短页面、或入口应该常驻在页面布局里的场景 —— 这类入口应该用普通
`SnButton`，而不是固定在视口上的浮动按钮。

## 代码演示

### 基础用法

三种形态：默认圆形、`type="primary"` 品牌色圆形、`shape="square"` 方形带说明文字。

<Demo name="float-button-web-basic" description="默认圆形 / 品牌色圆形 / 方形带文字，右下角三档偏移" />

### 八个方位

`placement` 支持四角 + 四边中点共 8 个锚点；边中点会用 `50%` + translate 把按钮居中在该边上。

<Demo name="float-button-web-placement" description="top-left / top / top-right / left / right / bottom-left / bottom / bottom-right" />

### 按钮组

`SnFloatButtonGroup` 拥有整个按钮组的固定位置，子按钮只负责渲染内容；`v-model:open`
可以接管展开状态。

<Demo name="float-button-web-group" description="三个操作堆叠在同一个角上，v-model:open 受控展开" />

### 展开方向

`SnFloatButtonGroup` 的 `direction` 决定堆栈从触发器往哪边长：`up`（默认，右下角向上）/ `down` / `left` / `right`。省略时按 `placement` 自动推导，永远朝视口中心展开。

<Demo name="float-button-web-direction" description="up / down / left / right 四个展开方向并排对照" />

### 徽标与链接

`badge` 显示数量，`badgeDot` 显示小红点；传入 `href` 后根元素从 `<button>` 变成 `<a>`。

<Demo name="float-button-web-badge-link" description="数量徽标 / 小红点 / href + target 的链接根元素" />

## API

### SnFloatButton Props

| 名称                                | 类型                                                                                                     | 默认值           | 说明                                                                     |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------ |
| `type`                              | `'default' \| 'primary'`                                                                                 | `'default'`      | 填充色：默认表面色 / 品牌色。                                            |
| `shape`                             | `'circle' \| 'square'`                                                                                   | `'circle'`       | 方形时图标上方会多一行 `description` 文字。                              |
| `icon`                              | `IconComponent`（lucide 组件）                                                                           | `undefined`      | 图标组件，`icon` 插槽可覆盖。                                            |
| `iconSize`                          | `number \| string`                                                                                       | `18`             | 传给内部 `SnIcon` 的尺寸。                                               |
| `description`                       | `string`                                                                                                 | `undefined`      | 图标下方的文字，仅 `shape="square"` 时渲染。                             |
| `tooltip`                           | `string`                                                                                                 | `undefined`      | 同时设置原生 `title` 与无障碍名称（`aria-label`），不渲染 tooltip 组件。 |
| `badge`                             | `number \| string`                                                                                       | `undefined`      | 数量徽标；`undefined`、`0`、`''` 时不显示。                              |
| `badgeDot`                          | `boolean`                                                                                                | `false`          | 显示小红点；同时给了数量时数量优先。                                     |
| `href`                              | `string`                                                                                                 | `undefined`      | 传入后根元素渲染为 `<a href>`，否则为 `<button type="button">`。         |
| `target`                            | `'_blank' \| '_self' \| '_parent' \| '_top'`                                                             | `undefined`      | 原生链接打开方式，仅在 `href` 下有意义。                                 |
| `disabled`                          | `boolean`                                                                                                | `false`          | 禁用：不触发 `click`，根元素带 `aria-disabled="true"`。                  |
| `visible`                           | `boolean`                                                                                                | `true`           | 是否渲染整个按钮（`v-if`）。                                             |
| `placement`                         | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right' \| 'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom-right'` | 8 个定位锚点（四角 + 四边中点）；在按钮组内会被忽略。                    |
| `right` / `bottom` / `top` / `left` | `number \| string`                                                                                       | `undefined`      | 显式偏移，覆盖 `placement` 对应的轴。                                    |
| `zIndex`                            | `number`                                                                                                 | `1000`           | 固定定位的层级；在按钮组内会被忽略。                                     |
| `fixed`                             | `boolean`                                                                                                | `true`           | `false` 时不再固定到视口，改为钉在最近的定位祖先（或 `container`）内。   |
| `container`                         | `string \| HTMLElement`                                                                                  | `undefined`      | `fixed: false` 时的定位上下文：选择器或元素。                            |

### SnFloatButtonGroup Props

| 名称                                | 类型                                            | 默认值           | 说明                                                           |
| ----------------------------------- | ----------------------------------------------- | ---------------- | -------------------------------------------------------------- |
| `shape`                             | `'circle' \| 'square'`                          | `'circle'`       | 下发给所有子按钮，覆盖子按钮自己的 `shape`。                   |
| `open`                              | `boolean`                                       | `undefined`      | 受控展开状态（`v-model:open`）。不传即为非受控。               |
| `trigger`                           | `'click' \| 'hover'`                            | `'click'`        | 展开手势。                                                     |
| `placement`                         | 同 `SnFloatButton`（8 个锚点）                  | `'bottom-right'` | 整个按钮组的定位锚点。                                         |
| `direction`                         | `'auto' \| 'up' \| 'down' \| 'left' \| 'right'` | `'auto'`         | 堆栈展开方向；`auto` 按 `placement` 推导，永远朝视口中心展开。 |
| `right` / `bottom` / `top` / `left` | `number \| string`                              | `undefined`      | 显式偏移，覆盖 `placement`（默认 `right` / `bottom` 为 24）。  |
| `zIndex`                            | `number`                                        | `1000`           | 固定定位的层级。                                               |
| `fixed`                             | `boolean`                                       | `true`           | 同上：`false` 时整组钉在定位上下文内。                         |
| `container`                         | `string \| HTMLElement`                         | `undefined`      | `fixed: false` 时的定位上下文。                                |
| `gap`                               | `number`                                        | `12`             | 子按钮之间（以及到触发器）的垂直间距。                         |
| `triggerIcon`                       | `IconComponent`（lucide 组件）                  | lucide `Plus`    | 触发器图标，展开时旋转 45°。                                   |
| `triggerTooltip`                    | `string`                                        | `undefined`      | 同时设置触发器的原生 `title` 与无障碍名称。                    |

### Events

| 名称                                | 参数         | 说明                                                     |
| ----------------------------------- | ------------ | -------------------------------------------------------- |
| `click`（SnFloatButton）            | `MouseEvent` | 原生点击；`disabled` 时不触发。                          |
| `update:open`（SnFloatButtonGroup） | `boolean`    | 展开状态变化（`v-model:open`），仅在状态真的改变时触发。 |
| `openChange`（SnFloatButtonGroup）  | `boolean`    | `update:open` 的事件式别名。                             |

### Slots

| 名称          | 组件               | 参数 | 说明                              |
| ------------- | ------------------ | ---- | --------------------------------- |
| `icon`        | SnFloatButton      | `()` | 替换图标。                        |
| `description` | SnFloatButton      | `()` | 替换 `description` 文字。         |
| `default`     | SnFloatButton      | `()` | 替换整个内部内容（图标 + 文字）。 |
| `default`     | SnFloatButtonGroup | `()` | 堆叠的 `SnFloatButton` 子按钮。   |
| `trigger`     | SnFloatButtonGroup | `()` | 完全替换内建触发器。              |

## 定位

`SnFloatButton` 的根元素是 `position: fixed`，内联样式由 `placement`、显式偏移和
`zIndex` 计算：默认 `bottom-right` + `right: 24px` / `bottom: 24px`。

`placement` 只补「调用方没有显式偏移的那条轴」，所以 `placement="bottom-right"`
配 `top: 8` 时垂直方向用 `8px`、水平方向仍然沿用 `right: 24px`。

放进 `SnFloatButtonGroup` 之后，子按钮变成 `position: static` 且撑满整列 —— 位置由组统一
拥有，子按钮自己的 `placement` / 偏移 / `zIndex` 都不再生效。

**什么时候不要用 `fixed`**：文档站 / 预览卡这类「按钮属于某个模块」的场景，`fixed`
会让按钮飞出模块、跑到浏览器窗口右下角（再和页面其它浮层叠在一起）。这时用
`fixed: false` 把它钉在 `position: relative` 的父容器里：

```vue
<section style="position: relative">
  <SnFloatButton :fixed="false" :icon="Plus" :right="16" :bottom="16" />
</section>
```

需要钉到一个**不是父级**的容器时，传 `container`（选择器或元素），组件会在挂载时把
根节点移进去、卸载时移回原位；这一过程不注册任何监听或观察者，因此没有额外清理。

## 受控与非受控

`SnFloatButtonGroup` 默认非受控：点触发器自己展开/收起，同时抛出 `update:open` /
`openChange`。

传入 `open` 后转为受控：内部状态不再影响渲染，完全由宿主决定，`v-model:open` 是最省事的
写法。为了区分「没传 `open`」和「`open=false`」，`open` 显式声明了 `undefined` 默认值 ——
否则 Vue 的布尔 prop 兜底会把缺省值当成 `false`，组件就再也打不开了。

## 无障碍

- `SnFloatButton` 渲染真实的 `<button type="button">`（有 `href` 时是 `<a>`），触发器同样是
  一个真实的 `SnFloatButton`，按钮组外壳是 `role="group"`。
- `tooltip` / `triggerTooltip` 同时写入原生 `title` 与 `aria-label`；方形按钮没有 tooltip 时
  会用 `description` 作为无障碍名称。
- 触发器带 `aria-haspopup="true"` 与随展开状态变化的 `aria-expanded`；收起时堆叠区域是
  `aria-hidden="true"` + `display: none`，其中的按钮不会进入读屏与 Tab 顺序。
- `disabled` 使用 `aria-disabled="true"` 并拦截 `click`，根元素仍可获得焦点（ARIA 禁用写法）。
- 图标由 `SnIcon` 渲染并带 `aria-hidden="true"`，名称必须来自 `tooltip` / `description`。

## 主题

组件消费 `--sn-web-*` token 别名（表面色、文本色、边框色、品牌色、焦点环、阴影、圆角、
字号与行高），改主题靠覆盖 token。

## 已知取舍

- naive-ui 没有浮动按钮组件，本组件按 Ant Design Vue `FloatButton` / `FloatButton.Group`
  对齐（显式分歧，与 `SnComment` 的处理方式一致）。
- `tooltip` 只写原生 `title` + `aria-label`，不引入 tooltip 组件，因此按钮自身没有可销毁资源。
- 库内暂无 `SnBadge`，数量气泡由 `SnFloatButton` 自己渲染。
- `trigger` 插槽会替换内建触发器，也替换它的 ARIA 与点击接线：自定义触发器需要自己处理
  `v-model:open` 与 `aria-expanded` / `aria-haspopup`。
- 暂未提供 `FloatButton.BackTop`、`FloatButton.PurePanel` 以及按钮组的 popup 菜单模式。

组件完整契约见 `packages/vue-web/src/float-button/ai-description.md`。
