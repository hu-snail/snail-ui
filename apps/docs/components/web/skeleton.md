# Skeleton 骨架屏（Web 端）

`SnSkeleton` 是内容加载期间的占位块。一个标签覆盖常见形状：`text` 让它落进一行文字里、`circle` 变成头像、`repeat` 变多行段落。

## 何时使用

- 内容的最终结构可以预测，用占位块撑住布局避免跳动。
- 首次加载列表、卡片、详情页时，先给出形状再填内容。
- 需要比转圈更平滑的加载感知，减少「空白 → 突然出现」的割裂感。

不适合：结构完全不可预测时，用 `SnLoading` 更诚实。

## 代码演示

### 基础用法

行内、块级、圆形、段落四种基本形状。

<Demo name="skeleton-web-basic" description="行内 / 块级 / 圆形 / 段落四种形状" />

### 盒子形态

非文字几何体的占位，包含尺寸档与多行重复。

<Demo name="skeleton-web-box" description="显式尺寸、size 三档、repeat 多行与圆角对照" />

### 尺寸与形状

`size` 与 `text` / `circle` / `round` 的组合，以及 `animated` 开关。

<Demo name="skeleton-web-size" description="三档 size 与三种形状的组合，含 animated 开关" />

### 卡片占位

拼一个卡片占位，并切换动画与圆角。

<Demo name="skeleton-web-card" description="拼一个卡片占位，并切换 animated / sharp" />

## API

### Props

| 名称       | 类型                             | 默认值      | 说明                     |
| ---------- | -------------------------------- | ----------- | ------------------------ |
| `text`     | `boolean`                        | `false`     | 渲染为文本骨架。         |
| `round`    | `boolean`                        | `false`     | 渲染为圆角骨架。         |
| `circle`   | `boolean`                        | `false`     | 渲染为圆形骨架。         |
| `height`   | `string \| number`               | `undefined` | 骨架高度。               |
| `width`    | `string \| number`               | `undefined` | 骨架宽度。               |
| `size`     | `'small' \| 'medium' \| 'large'` | `undefined` | 骨架大小，决定默认高度。 |
| `repeat`   | `string \| number`               | `1`         | 重复次数。               |
| `animated` | `boolean`                        | `true`      | 是否启用闪烁动画。       |
| `sharp`    | `boolean`                        | `true`      | 是否渲染为直角骨架。     |

### Slots

| 名称      | 参数 | 说明                             |
| --------- | ---- | -------------------------------- |
| `default` | `()` | 自定义骨架内容，替代内置占位块。 |

## 圆角解析顺序

圆角的判定有优先级，从高到低：

1. `circle` → `50%`
2. `round` → `4096px`
3. `sharp`（默认）→ 交给样式表（直角）
4. `sharp: false` → 取 `--sn-web-skeleton-radius`

所以 `sharp: false` 才是「使用 token 圆角」的开关。

## 主题

组件消费 `--sn-web-skeleton-*` token 别名：

| Token                                                   | 说明                        |
| ------------------------------------------------------- | --------------------------- |
| `--sn-web-skeleton-color`                               | 基础填充色                  |
| `--sn-web-skeleton-color-end`                           | 闪烁峰值色                  |
| `--sn-web-skeleton-radius`                              | `sharp: false` 时使用的圆角 |
| `--sn-web-skeleton-height-small` / `-medium` / `-large` | 三档高度                    |

## 无障碍

- 骨架块对辅助技术隐藏，不参与可访问性树的朗读。
- 加载状态的整体语义应由外层的 `SnLoading` 或 `aria-busy` 承载。

## 已知取舍

- 几何属性以 inline style 承载，颜色与圆角走 CSS token 块。
- 闪烁动画时长（`2s`）与过渡时长（`0.3s`）为硬编码值，尚未接入 motion token。
- 未处理 `prefers-reduced-motion`，动画降级待补。
