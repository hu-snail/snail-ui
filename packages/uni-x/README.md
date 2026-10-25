# @snui/uni-x

uni-app x（App 端蒸汽模式）产物生成器。**不是第二套组件代码**：组件唯一事实源是
[`@snui/uni`](../uni)，本包把它的 `.vue` 源码确定性转换为 npm 可直接消费的
`.uvue` 产物（架构决策见 `.ai/decisions/0004-uni-x-adoption.md`）。

## 命令

```bash
pnpm -F @snui/uni-x build   # 生成 dist/（components/ + theme/）+ PORTING-REPORT.md
pnpm -F @snui/uni-x test    # 转换器单元测试（30 个行为测试）
pnpm -F @snui/uni-x typecheck
```

`dist/` 通过 package.json `files` 随 npm 包发布——消费方 `pnpm add @snui/uni-x`
后，在 `pages.json` 里把 easycom 指到 `@snui/uni-x/components/sn-$1/sn-$1.uvue`
即可，无需生成或拷贝。完整接入步骤见文档站 `guide/uni/uni-app-x`（双语）。

## 转换规则

| 层 | 规则 |
| --- | --- |
| CSS | 仅保留 class 选择器；两段式后代规则 `.a .b` 降级为 CSS 变量上下文注入（`.a { --snx-b-p: v }` + `.b { p: var(--snx-b-p, base) }`）；伪类/伪元素/属性选择器/深后代/兄弟组合删除并上报；`cursor` 等无原生等价属性剥离；`@keyframes` 体不碰 |
| 模板 | 裸文本包 `<text>`；`@tap` → `@click`；`data-*` 剥离（uni-x 产物） |
| 脚本 | `preventDefault()` / `stopImmediatePropagation()` 转可选调用；未被消费的 `defineSlots()` 剥离 |
| 主题 | tokens 的 `:root` / `page` 选择器重写为 `.sn-theme-root` class 挂载 |

转换是纯函数且幂等——**幂等性本身被用作合规检查**：对已是 ucss 子集的输入，
`transformCss` 输出恒等于输入。

## 补丁（patches.ts）

无法安全自动转换的组件级差异用**锚定补丁**表达（如 sn-button 的 hover-class
按压态、sn-icon 的 `<image>` 渲染、sn-cell 的真实细线元素）。锚文本取自上游
源码原文；**上游改动导致锚点失配时构建直接失败**——必须同步更新补丁，绝不静默漂移。

当前补丁面：sn-button / sn-icon / sn-cell / sn-form-item / sn-loading /
sn-picker-view-drag / sn-config-provider。

## 状态与已知缺口

看两处，且以构建产物为准：

1. `PORTING-REPORT.md`（构建生成）— 每文件转换明细 + 问题计数。
2. `MANUAL_FLAGS`（cli.ts）— 需要人工处理的 curated 清单（sn-table 动态组件、
   sn-form-item 消费 defineSlots、sn-icon SVG 解码、skin packs 待变量化）。

**真机验证未执行**（无 HBuilderX 环境）：hover-class、SVG data URL、`:style`
变量注入、gap、keyframes、fixed+安全区、宏支持面——清单见文档站指南页。
