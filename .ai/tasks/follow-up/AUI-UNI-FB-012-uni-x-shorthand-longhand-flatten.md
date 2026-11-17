# AUI-UNI-FB-012 — uni-x flatten：shorthand/longhand 混排导致圆角 / 动画失效

## 现场现象

uni-demo-x（uni-app x 产物）中所有居中弹窗（sn-dialog 等，`position="center"` + `round`）
面板四角全部是直角；弹层进出场动画完全不播放；未开启 `safe-area-inset-bottom` 的
面板底部 padding 塌陷为 0。vue 端（uni-demo / H5）同源 CSS 渲染正常。

## 根因

`packages/uni-x` 的 CSS transform（ADR-0004 flatten）把 `.a .b { prop }` 改写为
容器挂自定义属性 + 基类 `var(--snx-b-prop)`。当一个元素同时被
**shorthand**（如 `border-radius`）与**同组 longhand**（如 `border-top-left-radius`）
的 flatten 规则命中时，基类被合并成：

```css
border-radius: var(--snx-t-border-radius);            /* center 态有定义 */
border-top-left-radius: var(--snx-t-border-top-left-radius); /* center 态未定义 */
/* …其余三角同理 */
```

按 CSS 规范，`var()` 引用未定义自定义属性 = invalid at computed-value time →
回退**初始值**（0），且 longhand 位于 shorthand 之后 → 四个角全部被覆盖为 0。
同类触发点：

- `border-radius` vs 四角 longhand → dialog 方角；
- `padding` vs `padding-bottom`（safe-area 规则）→ 底部 padding 塌陷；
- `animation: none`（`.sn-popup--hidden .sn-popup__panel`）flatten 成裸
  `animation: var(--undefined)` → 追加在基类动画 longhand 之后，正常态整条
  animation shorthand 失效 → uni-x 弹层动画整体不播。

## 修复

`packages/uni-x/src/transform/css.ts`：

1. 新增 `expandBoxShorthand`：`border-radius` / `padding` / `margin` 在 Pass 0
   基类收集与 flatten 循环两处统一展开为 4 个 longhand（1-4 值 cycling；
   含 `/` 的椭圆值不展开），每个角/边独立 var 槽 + 基类值 fallback——与既有
   `expandBorderShorthand` 同一契约。展开后容器各自定义自己的槽位，级联语义
   与原 CSS 完全一致。
2. 新增 `expandAnimationShorthand`：flatten 中的 `animation` shorthand 抽取
   `animation-name`（`animation: none` → `animation-name: none`），不再整条
   shorthand 挂裸 var，基类动画 longhand 不再被重置。

回归测试：`transform-css.test.ts` 新增 5 个用例（radius 四角、padding fallback、
`animation: none`、完整 animation shorthand 提名、椭圆 radius 保持整条）。

## 教训

- flatten（变量间接引用）类改写器必须把 **shorthand 与同组 longhand 视为一个
  原子组**：混排时未定义的 longhand var 会以初始值覆盖 shorthand。新增参与
  flatten 的 shorthand 属性时，必须同步加入展开表。
- 验证面：组件源 CSS 正确 ≠ 产物正确。uni-x 的验收必须包含编译后 wxss/uvue
  的链路检查（本次通过 `dist/components/sn-popup/sn-popup.uvue` 逐行核对）。
- 跨端差异：<text>（uni-app x App）不继承父级 `text-align`；sn-dialog 的
  `--msg` 居中必须写在自身。sn-button 默认 `hairline: true` 会给 text variant
  带边框，弹窗 text 主题需显式 `:hairline="false"`（与 wd-dialog 无边框文本
  按钮对齐）。

## 适用范围

本项目（uni-x transform 管线）。同类「状态类 + 基类」级联改写在其他包出现时
参照同一原子组原则。

## 对应代码

- packages/uni-x/src/transform/css.ts（expandBoxShorthand / expandAnimationShorthand）
- packages/uni-x/src/transform/transform-css.test.ts
- packages/uni/src/components/sn-dialog/sn-dialog.vue（text-align / hairline / 字重）
- packages/uni/src/components/sn-popup/sn-popup.vue（面板阴影）
