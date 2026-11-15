# AUI-UNI-FB-020 — uni-demo-x 首页三处缺陷：chips 横滚失效 / 选中阴影过重 / 风格包按钮静默失效（已修复）

- 状态：CLOSED（2026-11-15）
- 页面：`apps/uni-demo/src/pages/index/index.vue` + `apps/uni-demo/src/state/demo-ui.ts`
  （uni-demo-x 侧为 gen-x 生成物，勿手改）
- 类型：实现根因留档（AGENTS.md §103）

## 根因 1：分类 chips 横向滚动失效 —— `display: inline-flex` 在 uni-app x 不支持

**现象**：uni-demo-x 首页分类 chips（基础组件 / 导航组件 / …）最后一枚被视口裁掉，
横滑无响应。

**根因**：`.home__chips-inner` 用 `display: inline-flex` 做 shrink-to-fit 宽度
（web 惯用法）。uni-app x 布局引擎的 `display` 只支持 `flex` / `none`，`inline-flex`
被静默忽略 → 容器落回 `flex` 且宽度恒等于滚动视口宽 → 溢出的 chips 不产生滚动区
（scroll extent == client width）。web H5 端 inline-flex 生效所以只在 uni-app x
（App / MP-x）复现，极具迷惑性。

**修法**：与仓库内已验证的横滚条模式对齐（sn-tabs `sn-tabs__nav-inner` /
sn-table `sn-table__grid`）：内层 `display: flex` + `min-width: 100%` +
`box-sizing: border-box`，chip 项 `flex: 0 0 auto`；同时删掉 web-ism
`white-space: nowrap`。

**验证**：uni-demo H5 dev server 实测 —— 滚动层 `.uni-scroll-view`
（overflowX: auto）`scrollWidth 633 > clientWidth 365`，`scrollLeft` 可达最大值，
滚动后最后一枚 chip 可点、分类切换生效。uni-app x 端真机编译 NOT RUN（无 CLI），
以 HBuilderX 为准。

**教训（项目通用）**：uni-app x 端写横滚内容层，永远用
`flex + min-width: 100%` 模式，禁用 `inline-*` display 与 web 文本流惯用法；
横滚修复后用「滚动层 scrollWidth vs clientWidth」断言，别量外层包装节点
（uni scroll-view 有多层同名 `.uni-scroll-view` 包装）。

## 根因 2：风格包按钮点击无响应 —— 函数定义了但没从组合函数导出

**现象**：首页调色板按钮（切换风格包）点击毫无反应。

**根因**：`demo-ui.ts` 里 `chooseStylePack` 有完整实现，但 `useDemoUi()` 的返回
对象**没有包含它** → 首页解构出的 `chooseStylePack` 是 `undefined`，`@tap`
绑定到 undefined 静默失效。之所以能一路带病编译：apps/uni-demo /
apps/uni-demo-x 都**不在 turbo typecheck/lint 门内**（uni CLI 工程，无 tsc
任务），TS2339「属性不存在于返回类型」的编译期报警从未真正运行过。

**修法**：按用户要求放弃 `uni.showActionSheet`，改为 `sn-popup` 底部弹层选择器：
`demo-ui.ts` 新增并导出 `stylePackOptions`（name/label/description 列表）与
`setStylePack(name)`（未知名忽略 + 持久化）；删除死代码 `chooseStylePack`
（本就未导出不可达）；首页维护弹层状态 `showStylePack`，选中行带 Check 图标，
closable + 点遮罩关闭 + 底部安全区。

**验证**：H5 实测 —— 弹层弹出含 4 个风格包与描述；选中「iOS 风格」后弹层关闭、
按钮回显「iOS 风格」、`localStorage snui-demo-style=ios`；重开弹层选中行有勾选
标记；点遮罩关闭生效。

**教训（项目通用）**：组合函数（useXxx）新增能力时，「定义」≠「导出」——返回
对象漏写成员时调用点只会拿到 undefined，而 demo 工程没有 typecheck 门兜底，
必须靠 review 或运行时验证发现。AUI-MP-002 注释随 `setStylePack` 保留：uvue
蒸汽编译器会静默丢弃含解构参数箭头回调的整个函数，新代码不要往里塞
`success: ({ tapIndex }) => …` 这类写法。

## Regression

- demo 工程无单测框架（apps 不在 turbo test 内），回归验证为行为级：
  - uni-demo `dev:h5` + 浏览器实测（上述断言全部通过）；
  - uni-demo `build:h5` 生产构建 PASS；
  - `pnpm -F @snui/uni-demo-x gen`（幂等，仅本任务文件产生 diff）+
    `check`（101 pages / 113 tags 解析 / vapor manifest）PASS。
- 记忆条目：本条目即项目层记忆（.minimax memory 体系在本机不存在，按 §103
  「只在本项目成立」落入仓库留档）。
