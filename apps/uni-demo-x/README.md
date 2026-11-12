# @snui/uni-demo-x — uni-app x（蒸汽模式）演示工程

snui 组件库的 **uni-app x** demo：由 `apps/uni-demo`（uni-app 场景源，ADR-0005）经
`@snui/uni-x` 转换管线生成（ADR-0004），组件消费 `.uvue` 产物、manifest 开启
**vapor 模式**（`uni-app-x.vapor: true`）。

> **生成物勿手改**：`pages/`、`components/`、`state/`、`templates/`、`pages.json`、
> `App.uvue` 全部由 `scripts/gen-x.mjs` 产出（幂等，可随时重新生成）；
> `GEN-REPORT.md` 记录每次生成的改写统计与管线丢弃项。
> 手写文件只有：`manifest.json`、`index.html`、`main.uts`、`package.json`、`scripts/`、本 README。

## 与 apps/uni-demo 的关系

| 工程            | 模式           | 组件来源              | 用途                                       |
| --------------- | -------------- | --------------------- | ------------------------------------------ |
| `apps/uni-demo` | uni-app（CLI） | `@snui/uni` 源码      | 文档站 iframe 实时预览（vite H5 构建依赖它）|
| `apps/uni-demo-x` | **uni-app x** | `@snui/uni-x` `.uvue` | 蒸汽模式验证工程（HBuilderX 打开运行）      |

两者共享同一份场景源（`apps/uni-demo/src/pages/**/demos/`）——场景改动先改
uni-demo，再重新生成本工程，**不存在第二份手写场景**。

## 重新生成

```bash
pnpm -F @snui/uni-x build        # 1. 重建 .uvue 组件产物
pnpm -F @snui/uni-demo-x gen     # 2. 生成 demo 工程（pages/components/state/templates）
pnpm -F @snui/uni-demo-x check   # 3. 结构校验：manifest/pages/easycom/导入解析
```

`check` 的覆盖面：`uni-app-x.vapor` manifest 形态、index.html web 入口、
100 个页面实体存在、113 个 `sn-*` 标签可被 easycom / 显式导入解析、
相对导入真实存在、无 `.vue` / `@snui/uni-src` / demo-bridge / `.vue` 导入残留。

## HBuilderX 运行

1. 仓库根目录先 `pnpm install`（本工程经 workspace 依赖 `@snui/uni-x`）。
2. 用 **HBuilderX 5.31+** 打开本目录（`文件 → 打开目录`）；项目图标应为圆形
   （uni-app x 识别标记见 `manifest.json` 的 `"uni-app-x"` 节点，vapor 已开启）。
3. 运行到 Android / iOS / web（web 运行同理走 HBuilderX 内置编译）。

web 端 rpx 官方行为：按**屏幕宽度**等比换算（750rpx = 屏宽），桌面宽视口下
组件整体等比放大（[官方文档](https://doc.dcloud.net.cn/uni-app-x/css/common/length.html)）。
demo 场景布局用 px、组件内部用 rpx，宽屏下两者失配会出现装饰元素放大盖字等
视觉异常——**web 预览请用浏览器 DevTools 手机模拟（如 375px 视口）**，
App 端不受影响（真机屏宽即 750rpx 基准）。

注意：

- pnpm 的 `node_modules` 符号链接在 HBuilderX 下偶有解析问题；若组件找不到，
  可 `pnpm -F @snui/uni-x pack` 后把 tarball 解到本工程 `node_modules/@snui/uni-x`。
- uni-app x 暂无 CLI（[官方答复](https://ask.dcloud.net.cn/question/208871)），
  本工程无法在 vite/turbo 里编译验证——结构校验之外的真实编译以 HBuilderX 为准。

## 已知边界（真机验证前）

- HBuilderX 编译 / 真机验证 **NOT RUN**（无 CLI）；组件级待验证清单见
  `packages/uni-x/PORTING-REPORT.md` 与文档站指南「真机验证清单」。
- demo 场景自身的装饰性 CSS（`:hover` / `::before` 等，约 700 条）在 App 端被
  管线丢弃——仅影响演示页视觉点缀，不影响组件行为；明细见 `GEN-REPORT.md`
  的「管线转换问题」段。demo 场景源按 §116.2 改写是后续任务。
- demo-ui 的风格包（style-pack）切换依赖皮肤变量注入机制（ADR-0004 revision），
  App 端实际表现待真机确认。
