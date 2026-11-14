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
5. **uni-app x 端 +/- 白底（fallback-less var，第二轮用户反馈）。** 填充与图标色原来声明在共享的
   `__action` 规则上；uni-x 转换把 `--primary .sn-input-number__minus { background-color: … }`
   这类后代覆写改写成挂在**段规则**上的 `var(--snx-…)`。`__minus` / `__plus` 自身没声明过
   `background-color` / `color`，转换器拿不到基础值 → 产出**无 fallback** 的
   `var(--snx-sn-input-number__minus-background-color)`；App / x-web 默认主题下该 var 未定义，
   声明在 computed-value time 失效 → 透明 → 白卡片透出白底按钮，而 `__inner`（基础值声明在
   自己规则里，转换器带上了 fallback）保持灰底。用户截图像素实测：minus #ffffff /
   field #f4f4f5 / plus #ffffff。
6. **长按连加移开不停止（第三轮用户反馈）。** touch 事件在手指移出后仍派发给**起始元素**，
   组件只监听 touchstart/touchend/touchcancel → 手指拖着离开按钮后 interval 继续计数。
   修法：`onPressMove` 记录按下起点，touchmove 位移平方超过 8px²（`PRESS_CANCEL_DISTANCE_PX`）
   即清定时器；轻微抖动（<8px）不中断。暂停后需重新按下才继续（可预测优先，§85）。
7. **custom-class / customStyle 宽度露馅（第三轮用户反馈）。** root 作为 flex item 被
   `align-items: stretch` 的父容器拉满整行（`inline-flex` 在 flex item 上块化），带边框/背景的
   自定义类渲染成全宽空壳。修法：root `align-self: flex-start`（默认收缩贴内容）；`__inner`
   改 `flex: 1 1 auto`（用户显式给宽度时中段优雅填满，自然宽度下 basis auto 取 field 尺寸不变）。
8. **圆形按钮风格缺失（第三轮需求）。** 追加 `theme: 'circle'`（灰胶囊轨道 + 两端白色圆钮，
   field 透出轨道色、分隔线隐藏）与 `buttonColor` prop（两侧按钮填充色，glyph 自动 on-primary，
   对齐 naive-ui color 语义），登记 AGENTS.md §112.3a。
9. **circle/round 圆角在 x 端会掉（衍生陷阱）。** 圆角基础值原来以 longhand 声明，而
   circle / round 主题覆写 `border-radius` **shorthand** → 转换器对 shorthand 产出无 fallback
   var → App / x-web 默认主题下圆角失效。修法：基础圆角与全部主题覆写统一走 shorthand
   （`border-radius: <outer> 0 0 <outer>`），转换器据基础 shorthand 产出 fallback。

## 修法

| 修法 | 说明 |
| ---- | ---- |
| root     | 透明、无 padding/border；`display: inline-flex` + `align-self: flex-start`（flex item 不被 stretch 拉满）+ `line-height: 1`，只负责布局 |
| segment     | action / inner 各自带 `background-soft` 与外侧 4px 圆角（`border-radius` shorthand） |
| 分隔线      | action 内新增真实 `<view class="__action-divider">`（1px 反色缝；outline-split 改 18px 短灰线；基础 `display: block` 供主题 `none` 覆写的 var fallback） |
| 输入区      | 新增 `__inner` 包裹 input：`padding: 0 var(--sn-mp-spacing-3)`（8px），input 36px / 14px / 500，`flex: 1 1 auto`（显式拉伸时中段填满） |
| 主题        | outline = 外框 + inner 上下描边、隐藏 divider；primary = 减号描边 + 加号实心；`circle`（追加）= 灰胶囊轨道 + 白色圆钮；round = 外角全圆 |
| 禁用        | 默认主题 glyph 走 `text-disabled`；primary 主题 action `opacity: .4` |
| 图标        | `SnIcon` 12px（`size="24rpx"`）——旧的 `:size="24"` 是 24px，比参考大一倍 |
| doodle      | 皮肤改为给 segment 画 4rpx 手绘描边（按段声明背景，同 fallback 契约） |
| stepStrictly | `normalize` 改为「0 锚点吸附 → `[min,max]` 严格边界取最近合法倍数」；`canStep` 用归一化后的候选值比较，网格边缘按钮置灰 |
| 段级填充    | `background-color` / `color` / `border-radius` 在 `__minus` / `__plus` 各自规则声明（wot v2 的 sub/add 也是各自上色），转换器据此产出带 fallback 的 `var(--snx-…, <base>)` |
| 长按移开    | `onPressMove`：按住期间 touchmove 位移 >8px 清定时器暂停连加，重新按下才继续 |
| 圆形风格    | `theme: 'circle'` + `buttonColor`（追加，AGENTS.md §112.3a）；`buttonColor` 为内联样式，优先级高于全部主题按钮填充 |

伪元素方案被否决：uni-app x 的 CSS 转换会删除 `::before/::after`，加号/减号会整片空白，
因此 glyph 继续用 `SnIcon`、分隔线用真实节点。

## Regression Test

`sn-input-number.test.ts` 共 68 条，其中本轮新增 / 扩展：

- `pauses the repeat when the held finger moves off the button` — touchmove 位移 40px 后
  repeat 停止（回归 #6）
- `keeps repeating through sub-threshold hold jitter` — ~3px 抖动不中断
- `paints both action buttons with buttonColor and on-primary glyphs` / `leaves the action
  buttons unstyled without buttonColor` — buttonColor 契约（#8）
- `applies the theme class` 扩展 circle（#8）
- `declares the fill, glyph color and corner radius on each segment rule`（uni-app x style
  contract）— `__minus` / `__plus` 必须自带 `background-color` / `color` / `border-radius`
  shorthand 基础声明，否则 uni-x 转换产出无 fallback 的 `var(--snx-…)`（回归 #5 / #9）

此前批次：inner 包裹、真实 divider 节点、0 锚点吸附、非倍数不落值、严格边界置灰。

## 验证

- `pnpm -F @snui/uni typecheck / lint / build`：PASS
- `pnpm -F @snui/uni test`：113 files 全绿（本批前 3851；本轮组件 68 条）
- `pnpm -F @snui/uni-x build && pnpm -F @snui/uni-x test`：66 tests PASS，0 rule dropped；
  产物 grep 确认：段 bg/color/radius 均带 `var(--snx-…, <base>)` fallback，divider
  `display: var(…, block)`，circle 主题 / `:style="actionStyle"` / `@touchmove` 完整保留
- `pnpm -F @snui/uni-demo-x gen && check`：101 pages / 1425 .uvue OK
- `packages/uni/dist/styles/index.css` 实测：两段规则自带灰底 + 圆角 shorthand，circle 规则在册
- 浏览器像素复检：NOT RUN（browser surface 本机不可用），以 dist CSS + uvue 产物 grep 为准

## 教训

- **移植组件 = 移植 DOM 结构 + 填充层级，不只是 prop 表。** 把背景涂在 root 上会在
  任何 stretch 父级里放大成整条 track；填充必须归属到视觉 segment。
- **参考库的主题名相同不代表实现相同。** 必须读参考的样式源码（v2 `index.scss`）而不是
  按名字自创视觉；`outline-split` 的语义是「短分隔线」而非「每个按钮加边框」。
- **「步进倍数」必须以 0 为锚点**；`min + k*step` 在 min 不是 step 倍数时会产出非倍数，
  且边界修正要取区间内最近的合法倍数。改语义时 `canStep` 也要跟着用归一化候选值判断。
- **uni 组件的装饰线 / 图形不要用伪元素。** uni-app x 转换会删伪元素，必须用真节点或
  `SnIcon`，否则多端产物静默缺图。
- **uni-x 的 var 上下文转换：被后代规则覆写的属性必须在段规则里有基础声明。** 转换器把
  `--theme .segment { prop }` 改写成段规则上的 `var(--snx-…)`，基础值只从段规则自身拿——
  属性只声明在共享类上时产出无 fallback 的 var，App / x-web 上直接失效（透明 / 继承）。
  排查手法：grep dist uvue 里 `var(--snx-` 后面缺 `,` 的行。同类隐患可能存在于其它
  组件，登记为后续全面 sweep（follow-up）。
- **shorthand / longhand 也要对齐。** 转换器按「被覆写的属性形态」产 var：主题覆写
  `border-radius` shorthand 时，基础值必须同为 shorthand——longhand 基础救不了 shorthand
  覆写（第二轮的 radius 缺 fallback 即此）。多端组件里凡是主题会覆写的属性，基础规则用
  同一形态声明。
- **touch 事件跟随起始元素。** 长按类交互若只在 touchstart/touchend 里管理定时器，手指移出
  后 interval 会继续跑——必须监听 touchmove 做位移阈值暂停（uni H5 / MP / App 同此行为）。
- **flex item 上的 inline-flex 会被块化拉伸。** 组件根节点若交给 `align-items: stretch` 的
  父容器，带边框/背景的自定义类直接渲染成全宽空壳；根节点 `align-self: flex-start` 是
  组件级默认的正确落点，显式宽度（customStyle width）仍可拉伸，配合内段 `flex: 1 1 auto`
  优雅填满。
