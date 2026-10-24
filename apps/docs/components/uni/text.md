# Text 文本（uni 端 / 移动端）

`sn-text` 是 `@snui/uni`（移动端 / 小程序 / H5）的语义文本组件。除了颜色与装饰，它还提供五种**展示层**格式化模式 —— 手机号 / 姓名脱敏、价格千分位、日期归一化 —— 让 schema 作者写 `mode="price"`，而不是把格式化函数塞进绑定层。基于 easycom 自动注册。

## 基础用法

五种语义色、粗体、三种装饰线：

<Demo name="text-mp-basic" description="type 五档（default / primary / success / warning / error）；bold 粗体；underline / line-through / overline 装饰线。" />

## 模式格式化

`mode` 把原始值转成用户该读到的字符串：

<Demo name="text-mp-mode" description="phone / name 脱敏、price 千分位、date 归一化、call 拨号。" />

| 模式 | 输入 → 输出 |
| --- | --- |
| `text` | `'raw'` → `'raw'` |
| `phone` | `'13800138000'` → `'13800138000'`；加 `format` → `'138****8000'` |
| `name` | `'张三丰'` → `'张三丰'`；加 `format` → `'张**'` |
| `price` | `'1288.5'` → `'1,288.50'`；`'-99'` → `'-99.00'` |
| `date` | `'2024-03-05T10:00:00'` → `'2024-03-05'` |

无法解析的 `date` 输入会原样透出 —— 展示组件不应因无法识别的数据抛错。

**脱敏契约**：`format` 在数值进入 DOM **之前**就把隐藏部分替换成 `*`。原始手机号 / 全名不会出现在渲染后的标记里，复制、截图辅助工具或审查工具都无法还原。

## 多行截断与排版覆盖

`lines` 控制展示行数，`size` / `lineHeight` / `color` 直接覆盖排版：

<Demo name="text-mp-lines" description="lines=1/2/3 多行截断；size / lineHeight / color 覆盖；prefix / suffix 前后缀。" />

## 自定义样式与插槽

`custom-class` / `custom-style` 落在根节点上；内容层用插槽扩展 —— `default` 覆盖 `text`，`prefix` / `suffix` 覆盖对应 prop，插槽里可以放任意跨端节点：

<Demo name="text-mp-custom" description="customClass / customStyle 追加到根节点；prefix / suffix / default 插槽渲染节点而非字符串。" />

## 自动注册（easycom）

```vue
<sn-text text="普通文本" />
<sn-text text="13800138000" mode="phone" format />
<sn-text text="1288.5" mode="price" prefix="¥" />
```

如需显式 import：

```ts
import { SnText } from '@snui/uni/components/sn-text/sn-text.vue'
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error'` | `'default'` | 语义色 |
| `text` | `string \| number` | `''` | 文本内容；default 插槽优先 |
| `size` | `string` | `''` | 字体大小，原样转发（`'28rpx'` / `'14px'`） |
| `mode` | `'text' \| 'date' \| 'phone' \| 'name' \| 'price'` | `'text'` | 文本处理模式 |
| `decoration` | `'none' \| 'underline' \| 'line-through' \| 'overline'` | `'none'` | 文本装饰 |
| `call` | `boolean` | `false` | `mode="phone"` 时点击是否拨号 |
| `bold` | `boolean` | `false` | 是否粗体 |
| `format` | `boolean` | `false` | 是否脱敏（仅 phone / name 生效） |
| `color` | `string` | `''` | 文本颜色（内联覆盖） |
| `prefix` | `string` | `''` | 前缀内容（`prefix` 插槽优先） |
| `suffix` | `string` | `''` | 后缀内容（`suffix` 插槽优先） |
| `lines` | `number` | `0` | 展示行数，超出显示省略号；`0` 表示不截断 |
| `lineHeight` | `string` | `''` | 文本行高，原样转发 |
| `customClass` | `string` | `''` | 根节点自定义类名 |
| `customStyle` | `string` | `''` | 根节点自定义 inline style |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `click` | 点击文本时触发；`call` 开启时与拨号动作同时发生 | `(event: Event)` |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 文本内容，覆盖 `text` |
| `prefix` | 文本前的内容，覆盖 `prefix` |
| `suffix` | 文本后的内容，覆盖 `suffix` |

## 拨号契约

`call` 是显式开关，且做能力探测：当 uni-app runtime 提供 `makePhoneCall` 时，点击会拨号（去空格）；当运行环境没有该能力（H5 / SSR / 测试）时，点击降级为普通 `click` emit，而不是抛错。只有真正可拨号时根节点才会挂 `role="link"`。

## 主题变量

| 变量 | 用途 |
| --- | --- |
| `--sn-mp-color-text-primary` | `default` 类型颜色 |
| `--sn-mp-color-action-primary` | `primary` 类型 |
| `--sn-mp-color-feedback-success` | `success` 类型 |
| `--sn-mp-color-feedback-warning` | `warning` 类型 |
| `--sn-mp-color-feedback-danger` | `error` 类型 |
| `--sn-mp-font-size-md` | 默认正文字号 |
| `--sn-mp-font-line-height-normal` | 默认行高 |
| `--sn-mp-font-weight-bold` | `bold` 与 Doodle 皮肤强调 |

## 无障碍

- 根节点是 `<view>`，文本放在内层 `<text>`，这样小程序的多行截断（`display: -webkit-box`）能作用在外层盒上。
- `role="link"` 只在点击真的会拨号时添加 —— 不可拨号的手机号保持普通文本语义。
- 小程序无键盘契约；H5 上 tap 处理器相同。

## 暗色模式

`sn-text` 的所有颜色来自 `--sn-mp-color-*`，无浅色兜底：

- 五种 `type` 在暗色下各自翻到对应的深色主题值，`default` 从近黑变近白，`primary` / `success` / `warning` / `error` 保持品牌色本身。
- 装饰线使用 `currentColor`，因此会自动跟随 `type` / `color`，暗色下无需单独处理。
- `color` 内联覆盖原样生效；需要跟随主题时请传 `var(--sn-mp-*)`。

用 sn-config-provider 的 theme 设为 dark 包裹验证：


## 相关

- Web 端：[`SnText`](/components/web/text)
- 分隔线：[`sn-divider`](/components/uni/divider)
- 标签：[`sn-tag`](/components/uni/tag)
