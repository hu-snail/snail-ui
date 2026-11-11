# Follow-up: uni-x 产物两处打包缺口（utils / 类型契约）

> 关联 commit：`55d96ad8`（utils 随包产出）、`7a43e670`（IconData 抽取）。
> 回归守卫：`packages/uni-x/src/transform/dist-packaging.test.ts`。

## 根因 1：共享 utils 未随 dist 发布

**现场**：`@snui/uni-x` 若作为 npm 包安装，生成的 `.uvue` 里
`from '../../utils/uid'` 解析到包外（16 个组件引用 4 个 utils，
`exports` 也无 `./utils/*`），easycom 消费直接编译失败。仓库内自测
（源码路径直连）暴露不了，只在真实 npm 消费 / `apps/uni-demo-x` 场景下爆。

**根因**：`cli.ts` 只镜像 `src/components/**`，而组件源码里存在跨目录的
`../../utils/*` 相对导入——「发射树 = 源码子树」的假设不成立。

**教训**：生成式包的发射器必须按「导入闭包」补全产物，而不是按目录镜像；
每次给源码加共享依赖，都要让管线知道。

**反模式**：新增跨包共享模块时只改 `src/`，指望产物自动跟上。

**适用范围**：本项目（uni-x 管线）；同型「源码树 → 发布树」生成器通用。

## 根因 2：类型契约定义在 SFC 内

**现场**：`sn-icon-set.ts` 等 6 个 `.ts` 协同文件
`import type { IconData } from './sn-icon.vue'`——uni-x dist 里只有
`.uvue`，类型解析失败。

**根因**：`.vue`（uni-app 端）与 `.uvue`（uni-app x 端）产物互斥，
**任何**以 `.vue` 为导入目标的模块都不能出现在共享 `.ts` 层。

**教训**：双端单源码架构下，跨文件共享的**类型契约必须放纯 `.ts` 模块**，
SFC 只 re-export 保持兼容路径。

**反模式**：在 SFC 里 `export interface` 并被 `.ts` 文件 import。

**适用范围**：本项目（packages/uni 全部组件）；任何 .vue→.uvue 转换管线通用。

## 遗留

- demo 场景自身约 700 条装饰性伪类/伪元素 CSS 在 App 端被丢弃
  （`apps/uni-demo-x/GEN-REPORT.md`）——demo 源码按 §116.2 改写为后续任务。
- PORTING-REPORT 剩余 9 条 `:hover/:active` 皮肤交互态规则：App 端平台限制，
  已登记（ADR-0004 revision），待真机验证后决定 hover-class 替代方案。
