# ADR-0005: uni-demo 独立演示工程（自持 demo 单源 + docs iframe 预览 + 双端发布）

- 状态：Accepted（Human 指令，2026-10-26；同日经两轮 Human 反馈修订定稿）
- 影响：apps/uni-demo（新增，demo 单一事实源）、apps/docs（uni demo 预览
  管线整体退役，改 iframe 消费部署站）、packages/uni（MP 编译兼容修复）
- 关联 follow-up：AUI-UNI-FB-012（MP 主包体积）、AUI-UNI-FB-013（浏览器
  API demo 迁移）、AUI-UNI-FB-010（追记 v-memo 影响）

## Context

uni 端组件 demo 此前只存在于文档站：`apps/docs/.vitepress/demo/*-mp*.vue`
（353 个）经浏览器 shim（tap 桥接 / rpx 转换 / 手势回退）在 iframe 里近似
渲染。三个天花板：

1. 不是真实 uni 运行时，平台行为无法作为真机验收口径；
2. 无法独立发布——微信小程序侧没有演示载体；
3. H5 侧无法脱离文档站部署。

Human 指令（原始）：uni-app 端 demo 需要独立工程、能独立部署发布、支持
小程序与 H5。
Human 指令（修订一）：文档的 demo 直接用 iframe 加载预览，不要维护两套 demo。
Human 指令（修订二）：组件文档展示简单用法源码，不展示完整 demo 源码。

## Decision

**apps/uni-demo 自持 uni demo 单源；docs 全面退役 uni shim 预览管线，
预览改为 iframe 加载本工程部署的 H5 站，代码面板展示从 demo 源自动提取的
「用法源码」。**

```
apps/uni-demo（独立 uni-app CLI 工程，demo 唯一事实源）
├── src/pages/<sub>/demos/*.vue        demo 源（353 zh + 360 en 影子，fork 引导）
├── scripts/fork-demos.mjs             一次性引导：git HEAD 的 docs demo → 本工程
│                                      （MP 可移植改写：HTML 标签→uni 标签、
│                                       裸包名 import→源码别名）
├── scripts/subpackages.mjs            分组 + subPackage 切分（fork/gen 共享单源，
│                                      组件标题/分组以 docs overview-data.ts 为单源）
├── scripts/gen-pages.mjs              生成 pages.json / 首页 / 组件聚合页 /
│                                      demos-manifest.json（生成物提交入库）
├── scripts/build-h5.mjs               H5 构建编排（UNI_H5_BASE 注入 manifest+assets）
├── build:h5 → dist/build/h5           静态站，GitHub Pages 自动部署
│                                      （uni-demo-deploy.yml，base=/snail-ui/）
└── build:mp-weixin → dist/build/mp-weixin
                                       微信开发者工具导入上传（appid 占位）

apps/docs（组件文档）
├── 预览：Demo.vue / DemoDock.vue / MpHome.vue 的 iframe →
│   https://hu-snail.github.io/snail-ui/#/pages/<sub>/<comp>（UNI_DEMO_PREVIEW_BASE 可覆盖）
├── 代码面板：demo-loader 从 src/pages/*/demos 读源码文本，提取「用法源码」
│   （template 去演示外壳 + script 去 import，css 不展示）
└── 退役并删除：353 个 *-mp*.vue + demo-en mp 影子、uni-preview-shims（+test）、
    rpx-transform（+test）、@snui/uni-src 别名、@snui/uni/styles 引入、
    MpPreview.vue / MpOverview.vue / preview-mp.md
```

### 关键约束

- **单一事实源**：uni demo 只存在于 apps/uni-demo。docs 对 demo 源是构建期
  只读（raw 文本），不编译、不复制。
- **用法源码自动提取**：`loadDemoUsage`（demo-loader）从 demo SFC 提取
  template 用法（剥 `class="sn-demo"` 外壳）与 script（去 import 行），
  保证文档代码与线上预览永远同源，无第二份示例可漂移。
- **静态展开**：组件聚合页逐个静态 `<DemoN />`，不用 `component :is`
  （MP 编译器不支持动态组件）。
- **MP 编译兼容**（组件库侧修复）：`useId`（uni 运行时不导出）→ 模块计数器；
  `<slot v-bind="obj">` → 显式逐参；`v-memo` → 移除；`<component :is>`
  （sn-table 自定义单元格）→ `#ifdef MP` 降级文本单元格；
  原生元素 `v-bind="mpNativeAttrs"` → 显式逐条属性。
- **分包**：demo 源按 docs 总览分组物理放入 `pages/<sub>/demos/`；单分包
  组件数 > 14 自动切分（form → form / form-2）；`optimization.subPackages`
  开启。**实测包体**（排除 AppleDouble 垃圾后）：主包 0.86MB、最大分包
  0.18MB、整包 1.76MB，全部达标；非原生卷的 `._` 垃圾由 clean-dist-junk
  在构建后清理（曾污染首轮测量，复盘见 AUI-UNI-FB-012）。
- **消费模式（wot-ui 对齐）**：`@snui/uni` exports 暴露 `./components/*`
  源码 .vue，消费者以 easycom 规则按需引入；easycom 只编译实际用到的组件，
  全量四件套 ~0.6MB，业务工程主包无压力。
- **不进根 turbo 门禁**：uni-demo 脚本名非标准（build:h5 / build:mp-weixin），
  工程自身构建成功为验收，避免全仓 CI 被双端编译拖慢。
- **双语**：en 影子迁为 `<name>.en.vue`，docs 代码面板按站点语言取用；
  运行时页面以中文 demo 为准。

## Consequences

- 正向：真机/小程序验收有了官方载体；H5 演示站独立发布；demo 单源零漂移；
  docs 删减约 900 行 shim/转换代码与 713 个 demo 文件，预览从「浏览器近似」
  升级为「真实 uni 运行时」。
- 负向 / 待办：
  1. 非原生卷的 `._` 元数据垃圾会污染 dist 上传包（构建后自动清理）；
  2. 2 个浏览器 API demo 暂缺 → FB-013；
  3. docs 预览依赖 uni-demo 部署站可用性（Pages 挂了 docs 预览跟着挂；
     本地联调用 UNI_DEMO_PREVIEW_BASE 指向本地 dev）；
  4. docs 预览首屏多一次跨站 iframe 加载（部署站有 CDN 缓存）。
- 被否决的方案：
  - demo 源留 docs + alias 引用（初版 ADR）：跨 app 源耦合，Human 明确
    「不要维护两套」后否决；
  - uni-demo 自写全新 demo：353 个双份维护必然漂移，否决；
  - 组件源码 alias 直指 packages/uni/src：MP chunk 命名按 inputDir 相对路径
    计算，跨 root 模块产生非法 pattern，改为 node_modules symlink 路径 +
    `resolve.preserveSymlinks`。
