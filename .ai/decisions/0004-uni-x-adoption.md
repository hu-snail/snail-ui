# ADR-0004: uni-app x（蒸汽模式）适配 — 生成式 `@snui/uni-x` 包

## Status

Accepted (2026-10-25)

## Context

`@snui/uni` 是纯 Vue 3 SFC 组件库（82 组件 / 95 SFC / 约 3.7 万行非测试代码），面向
uni-app 全端（H5 / 小程序 / App-vue）。uni-app x 是 DCloud 的新一代框架：原生渲染 +
CSS 子集（ucss）+ `.uvue` 文件。其**蒸汽模式（vapor, HBuilderX 5.21+）**把逻辑层从
「UTS 编译 Kotlin/Swift」改回 JS 引擎跑普通 ts/js，使现有 Vue 3 脚本逻辑可以基本原样
保留；但 App 端 CSS 仍受限：

- 仅支持 class 选择器（复合 `.a.b` 可用），App 端蒸汽模式不支持关系选择器（后代/子代）
- 不支持伪类（`:hover` / `:active` / `:nth-child` 等）与伪元素（`::before` / `::after`）
- 样式不继承：文字样式必须落在每个 `<text>` 上
- 文本节点必须包裹在 `<text>` 内
- flex-only 布局 + 一套不同的默认值重置（flex-direction 默认 column 等）
- `var()` CSS 变量受支持；`hover-class` 为官方推荐的按压态方案

仓库现状：368 处后代选择器（61 个组件的 `.snui-skin-doodle` 皮肤覆盖）、28 处
`:hover/:active/:focus`、10 处 `:nth-child`、3 处伪元素、1,404 处 `var()`。

## Options

1. **在 `packages/uni` 内双后缀共文件** — 不可行：uni-app x 要求 `.uvue`，无法与 `.vue` 共存。
2. **手工维护独立的 82 组件 `.uvue` 源码树** — 双源漂移，维护成本 ≈ 重新实现一遍。
3. **生成式包（本决策）**：`packages/uni-x` 维护「转换管线」，从 `@snui/uni` 源码
   确定性生成 `.uvue` + uni_modules 产物；无法安全自动转换的部分用**锚定补丁**
   （patch）表达，锚文本失配即构建失败（防止上游漂移后补丁悄悄失效）。

## Decision

- 新增 `packages/uni-x`（`@snui/uni-x`），**只面向 uni-app x App 端**（Android / iOS /
  鸿蒙蒸汽模式）。uni-app x 的 web / 小程序目标暂不投入（其成熟度不如现有 uni-app，
  后者继续由 `@snui/uni` 覆盖全端）。
- 转换规则（`src/transform/`）：
  - CSS：tag 剥离、伪类/伪元素/属性选择器/深层后代规则**删除并记录**到
    PORTING-REPORT；两段式后代规则 `.a .b` 在「目标为单 class 且基规则存在」时
    **安全降级为 CSS 变量上下文注入**（`.a { --snx-b-prop: v }` + `.b { prop: var(--snx-b-prop, base) }`）。
  - 模板：裸文本自动包裹 `<text>`；`@tap` → `@click`；剥离 `data-*` 属性（文档预览桥专用，
    App 无意义）；保留 `aria-*`（待真机验证）。
  - 脚本：保持 TS 原样；`preventDefault()` / `stopImmediatePropagation()` 转可选调用；
    剥离无返回值消费的 `defineSlots()` 调用（uni-app x 支持面未确认的防御性转换）。
- **Style Pack（skin）在 uni-x 端暂缺**：`.snui-skin-doodle` 后代选择器规则被删除并记录。
  目标架构（后续任务）：skin 差异全部变量化为 `--snui-skin-*`，由 `sn-config-provider`
  注入，后端选择器彻底消失。届时 skin 规则可全量恢复。
- `sn-config-provider` 在 uni-x 输出中根节点追加 `sn-theme-root` class，承接 tokens
  变量挂载（uni-app x App 端无 `:root`）。

## Reason

- 转换是确定性的、有单测覆盖、可重复执行（幂等）；逻辑层唯一事实源仍是 `@snui/uni`
  （vitest 87 个测试文件继续作为行为回归）。
- 锚定补丁比整文件 override 漂移风险小：上游一改锚点即构建失败，强制同步。

## Trade-offs

- `packages/uni-x/dist` 产物不入库，评审需跑 `pnpm -F @snui/uni-x build` 生成。
- 无法自动转换的规则（深后代、兄弟选择器、shorthand 交叉）在本期**功能缺失**而非报错，
  全部登记于 `PORTING-REPORT.md` —— 验收以报告为准。
- 真机行为（hover-class、`<image>` 渲染 SVG data URL、`var()` 注入等）**未经 HBuilderX
  编译验证**，Spike 验证清单见 README。

## Consequences

- 新增维护面：转换器 + 补丁（约 1 个包）。上游每改动组件样式/模板，需重跑生成并
  核对报告增量。
- 文档规则 §110 的「双语 × 双端」在 uni-x 端暂以「双语接入指南 + 端口状态表」代替
  逐组件文档，待真机验证后按 §110 补齐。

## Revision (2026-10-25) — Style Pack 实测状态

初版 Decision 中「skin 在 uni-x 端暂缺」的判断**过时**：两段式后代规则的 CSS 变量
上下文注入（即本 ADR 的 flatten 机制）在产物层面**就是**皮肤变量化——实测
`dist/components` 中 59 个组件保留 `.snui-skin-doodle { --snx-*: … }` 单类变量块，
1097 条注入 / 434 处 `var()` 消费。真实缺口仅 9 条含 `:hover/:active` 的交互态皮肤
规则（伪类在 App 端不可表达，属平台限制而非架构缺口）。

源码侧的「后代选择器彻底消失」重构（`--snui-skin-*` 命名规约）降级为**可选优化**：
uni 端（老 uni-app）依赖后代选择器工作正常，uni-x 端由管线等效表达。回归由
`packages/uni-x/src/transform/transform-skin.test.ts` 锁定。
