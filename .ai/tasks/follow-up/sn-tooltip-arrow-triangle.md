# sn-tooltip 箭头：实心三角替代旋转菱形（2026-11-20）

Type: gotcha · fix

**坑**: uni 端 `sn-tooltip` 的倒三角在气泡内容区域重叠，且整体太小（与触发器之间几乎看不见尖角）。

**根因**:
1. **重叠**：箭头是 `transform: rotate(45deg)` 的正方形，填充色为
   `--sn-tooltip-bg` = `var(--sn-mp-color-background-inverse)` =
   **`rgba(0,0,0,0.75)` 半透明**。菱形内半段叠在气泡底色之上 →
   两层 alpha 叠加 → 内容区域出现一个更暗的菱形色块。
   `sn-popover` 无此问题，因其底色是不透明白。
2. **太小**：16rpx 正方形旋转后露出高度仅 ~9rpx（≈4.7px 视觉三角），
   且 `bottom: -6rpx` 的偏移让它几乎全部缩回气泡内。

**教训**: **半透明底盘上的装饰不能与底盘共享填充色做旋转平方形** ——
共享填充的重叠区域会二次叠加 alpha。装饰要么用**实心单层**（border 三角
只画一条边，填充精确一次），要么整个骑在底盘外。跨端考虑：
uni-app x App 引擎的 CSS flattener 不展开 4 值 `border-width` TRBL 简写，
箭头/圆角类几何必须写**逐边 longhand**。

**反模式**:
```css
/* ✗ 半透明填充 + 旋转平方形 → 重叠处二次 alpha */
.arrow { width: 16rpx; height: 16rpx; background: var(--semi-transparent-bg);
         transform: rotate(45deg); }
/* ✗ TRBL 简写在 uni-x App 不展开 */
.arrow { border-width: 0 10rpx 20rpx 10rpx; }
/* ✓ 实心三角，逐边 longhand */
.arrow { border-style: solid; border-color: transparent;
         border-bottom-width: 20rpx; border-bottom-color: var(--semi-transparent-bg); }
```

**适用范围**: 本项目（uni 端 tooltip / popover 类半透明气泡装饰）。

**对应代码**:
`packages/uni/src/components/sn-tooltip/sn-tooltip.vue`（`.sn-tooltip__arrow`
段，箭头 24rpx 底 × 12rpx 高 border 三角，`bottom/top/right/left: -12rpx`
完全落在气泡外；12rpx 箭头 = 12rpx 触发器间隙 → 尖角**精确贴住触发器边缘**
（贴边），宽度取自 sn-popover 小箭头参考量级）。`theme="light"` 经根类
`--sn-tooltip--light` 覆盖 `--sn-tooltip-bg/color` 两个自定义属性实现换肤
（箭头与底盘同源变量，一处覆盖两处生效）。

**回归测试**: `sn-tooltip.test.ts` 中
`draws the arrow as a border triangle, not a translucent rotated square`、
`keeps the arrow outside the content plate for every placement family`、
`keeps the arrow as wide as the popover footprint (44rpx base)` 与
`points the apex at the trigger (top colors top, bottom colors bottom)`。

**第二次踩坑（方向反转, 61781fa7）**: 把 web 端 4 值简写拆成 longhand 时，
top/bottom 两族的着色边写反了 —— 着色 **TOP** border 渲染的是**尖角朝下**
的三角，着色 **BOTTOM** border 是尖角朝上。vertical 箭头全部倒扣进底盘
（尖角与底盘同色融合，肉眼看是倒扣漏斗）。规则：箭头指向哪边，就着色
**靠气泡那条对面边**？不 —— 箭头朝下 = 着色 top；朝上 = 着色 bottom；
朝右 = 着色 left；朝左 = 着色 right（着色边 = 尖角的对边 = base 所在边，
base 必须贴气泡边缘）。

**顺带记录**: 完整测试套件中 `sn-avatar-group.test.ts` 8 个用例失败
（`expected [ … ] to have a length of 4 but got 5` 等），在干净工作树
（未修改该文件）下独立复现 —— 为 HEAD 上已有的存量失败，与本次
tooltip 修改无关，留作后续任务处理。
