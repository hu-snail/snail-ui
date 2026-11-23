# AUI-UNI-FB-025 — sn-divider 内联 border-style 打在非活动轴上，渲染出 medium/currentColor 杂散深色条

- 状态：CLOSED（divider 修复，regression test 三个）
- 组件：`packages/uni/src/components/sn-divider/sn-divider.vue`
- 类型：实现根因留档（AGENTS.md §103）
- 关联：根因物理与 `packages/uni-x/src/transform/css.ts` 的 `borderLonghandFallback` 注释同源（border-width 初始值 `medium` / border-color 初始值 `currentColor`，uni-app x 4.0+ 对齐 W3C）

## 现象（mp-weixin 真机截图，uni-demo「分割线」页）

1. 所有**带文字的水平分割线**左端出现一条 ~3px 的深色竖条（「| 或」「|左侧 left」…）；
   `dashed` 变体的竖条是虚线的（「dashed + right」行）。
2. **垂直分割线**顶部出现同样的深色横条（同根因镜像）。
3. `contentPosition: 'center'`（默认档）不居中，「居中 center（默认）」和「或」都停在左端；
   left / right 两档正常。

## 根因

`rootStyle` 计算属性无条件同时内联 `borderTopStyle` + `borderLeftStyle`（solid/dashed 切换），
而 class CSS 只给**活动轴**边框宽度与颜色（horizontal → `border-top`，vertical → `border-left`）。
CSS 规定 border-width 初始值为 `medium`（≈3px）、border-color 初始值为 `currentColor`：
内联 style 把非活动轴的 border-style 从 `none` 激活成 solid/dashed 后，该轴立刻渲染出
3px 宽、文字色的垂直/水平条——水平分割线上即截图中的深色竖条。空分割线根高≈0，条退化成
左端一个不可见的小点，所以只有带文字（根高 = 文字高）的行肉眼可见。

居中缺失是独立的第二根因：CSS 只写了 `.sn-divider--content-left/right` 的
`justify-content`，没有 `--content-center` 规则，flex 默认 `flex-start` → 默认档靠左。

## 修复

1. `rootStyle` 按 `isVertical` 只输出活动轴的 border-style；
   `borderColor`（两轴共用）保留。
2. 补 `.sn-divider--content-center { justify-content: center; }`。

## Regression Tests（sn-divider.test.ts）

- `omits border-left-style on horizontal dividers so no stray bar paints`
- `omits border-top-style on vertical dividers so no stray bar paints`
- `centers the default content position — stylesheet carries the content-center rule`
  （`?raw` 源码级断言，同 sn-badge 模式；happy-dom 不渲染真机 flex/初始 border）

修复前 2 个 style 断言实测 fail，修复后 22/22 pass。

## 记忆条目

根因在本项目所有「class 管活动轴、内联 style 管开关」的 mp 组件上都成立（跨组件、
同项目），按 §103「Project Memory → 引用 topic file」记在本文件。

**反模式**：给只有单轴边框的元素用内联 `border-*-style` 做样式开关时，必须只写活动轴；
写了非活动轴 = 激活一条 `medium`/`currentColor` 的边。
