# AUI-UNI-FB-018 — sn-input-number 视觉未对齐 wot-ui v2（整条 track + 白色按钮 plate）

- 状态：FIXED
- 组件：`packages/uni/src/components/sn-input-number/sn-input-number.vue`
- 类型：视觉缺陷（结构与主题实现偏差），API 无变更
- 参考：wot-ui v2 `wd-input-number`（https://wot-ui.cn/component/input-number.html）

## 现场

uni-demo `/pages/form/input-number`（文档站手机预览 iframe 同一页）里，计数器渲染成
「整行浅灰 track + 两枚白色圆角按钮 plate」：控件被父级 flex 拉满整行，按钮与输入框
是三块互不相连的浮起方块。对照 wot-ui v2 文档截图（组件类型 / 组件状态 / 组件样式），
参考实现是三条紧贴的 segment（minus / field / plus），整体 108×28px，仅在减号/加号
**外角** 有 4px 圆角，分隔线是 1px 反色缝（default）或 1px 短线（outline-split）。

## 根因

1. **填充画在了 root 上。** 旧实现给 root 加了 `padding` + `border` + `background-soft`，
   于是 root 被 flex 父级 stretch 时，整条 track 跟着拉满；参考实现的 root 是
   `display:flex` 的纯布局节点（透明、无 padding），填充只属于三个 segment。
2. **按钮 plate 与参考结构相反。** 旧实现的 action 使用 `background-elevated`（白）圆角方块，
   而参考实现的 action 与 field 同为 `filled-bottom` 浅灰，彼此紧贴；分隔感来自
   action 内侧的 1px 反色 divider，而不是按钮自身的白底。
3. **主题只抄了名字，没抄实现。** `outline / outline-split / primary` 的视觉与 v2 不同：
   v2 的 outline 是三段共用一个外框（action 四边描边 + inner 上下描边、隐藏 divider）；
   outline-split 只保留 18px 高的短分隔线；primary 是「减号 primary 描边 + 加号 primary 实心」，
   禁用态走 `opacity: .4` 而非统一降透明度。
4. **`stepStrictly` 语义错误（行为级）。** 旧实现把网格锚在 `min` 上
   （`min + round((v - min) / step) * step`），min=3 / step=2 时产出的 3、5、15 全都不是
   step 的倍数；参考实现锚在 0，再做严格边界修正（`ceil(min / step)` 与 `floor(max / step)`）。

## 修法

| 项          | 修法                                                                                                        |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| root        | 透明、无 padding/border；`display: inline-flex` + `line-height: 1`，只负责布局                              |
| segment     | action / inner 各自带 `background-soft` 与外侧 4px 圆角（`--sn-mp-radius-sm`）                              |
| 分隔线      | action 内新增真实 `<view class="__action-divider">`（1px 反色缝；outline-split 改 18px 短灰线）             |
| 输入区      | 新增 `__inner` 包裹 input：`padding: 0 var(--sn-mp-spacing-3)`（8px），input 36px / 14px / 500             |
| 主题        | outline = 外框 + inner 上下描边、隐藏 divider；primary = 减号描边 + 加号实心；round = 外角全圆                 |
| 禁用        | 默认主题 glyph 走 `text-disabled`；primary 主题 action `opacity: .4`（文档不再整控件降透明度）                |
| 图标        | `SnIcon` 12px（`size="24rpx"`）——旧的 `:size="24"` 是 24px，比参考大一倍                                    |
| doodle      | 皮肤改为给 segment 画 4rpx 手绘描边（旧规则挂在 root 上，结构变更后失效）                                   |
| stepStrictly | `normalize` 改为「0 锚点吸附 → `[min,max]` 严格边界取最近合法倍数」；`canStep` 用归一化后的候选值比较，网格边缘按钮置灰 |

伪元素方案被否决：uni-app x 的 CSS 转换会删除 `::before/::after`，加号/减号会整片空白，
因此 glyph 继续用 `SnIcon`、分隔线用真实节点。

## Regression Test

`sn-input-number.test.ts` 新增 5 条：

- `wraps the field in its own inner segment` — field 必须在 `__inner` 内
- `separates the three segments with real divider nodes` — 两个 action 各携带一条 divider
  （uvue 转换会丢弃伪元素，分隔线不能退回 CSS 绘制）
- `anchors the strict grid at zero and lands inside [min, max]` — min=3 / step=2：1 → 4、17 → 14
- `never emits a strict-step value that is not a multiple of step` — 5 必须被修正为偶数
- `disables stepping past the strict grid bounds` — 4 的减号、14 的加号置灰

组件 63 条用例全绿；全量回归 113 文件 / 3848 用例。

## 验证

- `pnpm -F @snui/uni typecheck / lint / build`：PASS
- `pnpm -F @snui/uni test`：113 files / 3848 tests PASS
- `pnpm -F @snui/uni-x build && pnpm -F @snui/uni-x test`：66 tests PASS，0 rule dropped
- `pnpm -F @snui/uni-demo-x gen && check`：100 pages / 1422 .uvue OK
- H5 实测（375×812）：minus 28×28 + inner 52×28（padding 8px）+ plus 28×28 = 108×28，
  divider 1px 反色 / outline-split 18px，primary 加号 `#1677ff` 实心。截图面（IAB
  screenshot surface）本机不可用，视觉以 computed style + 几何尺寸核对，未做像素截图。

## 教训

- **移植组件 = 移植 DOM 结构 + 填充层级，不只是 prop 表。** 把背景涂在 root 上会在
  任何 stretch 父级里放大成整条 track；填充必须归属到视觉 segment。
- **参考库的主题名相同不代表实现相同。** 必须读参考的样式源码（v2 `index.scss`）而不是
  按名字自创视觉；`outline-split` 的语义是「短分隔线」而非「每个按钮加边框」。
- **「步进倍数」必须以 0 为锚点**；`min + k*step` 在 min 不是 step 倍数时会产出非倍数，
  且边界修正要取区间内最近的合法倍数。改语义时 `canStep` 也要跟着用归一化候选值判断。
- **uni 组件的装饰线 / 图形不要用伪元素。** uni-app x 转换会删伪元素，必须用真节点或
  `SnIcon`，否则多端产物静默缺图。
