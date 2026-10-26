# @snui/uni-demo — uni 端组件演示（独立工程）

uni 端（`@snui/uni`）组件 demo 的**唯一事实源**与真实运行时演示工程（ADR-0005）：

- **demo 源**：`src/pages/<sub>/demos/*.vue`（含 `<name>.en.vue` 英文影子）。
  docs 组件文档不再持有 uni demo——其预览 iframe 直接指向本工程部署的 H5 站，
  用法源码也读取本工程 demo 源（跨 app 只读，不参与 docs 编译）。
- **H5**：`pnpm build:h5` 产出静态站（`dist/build/h5`），可部署到任意静态托管；
  仓库 CI（`uni-demo-deploy.yml`）自动发布到 GitHub Pages。
- **微信小程序**：`pnpm build:mp-weixin` 产出 `dist/build/mp-weixin`，
  用微信开发者工具导入运行。
- **页面 UI**：总览/组件页共用 `DemoPageShell`——渐变弥散背景 + 呼吸动画、
  玻璃卡（浅色透明渐变 + 圆角 + 描边，backdrop-filter 渐进增强）、中/英切换
  与深/浅主题切换按钮（`src/state/demo-ui.ts`，uni storage 持久化）、总览页
  组件搜索（中文名/英文名/key/描述本地过滤）。
- **深色主题（组件级）**：根节点挂 `dark` 类翻转 `@snui/uni/styles` 内置的
  深色变量块（49 变量：文本/面板/边框/soft tints/sunken 全套），demo 内的
  组件本体随主题翻深；demo 层仅补 `--sn-mp-color-control-knob` 一处（旋钮
  两主题保持浅色的设计约定）。H5 导航栏经 `#ifdef H5` 注入样式随主题同步。
- **双语覆盖**：分组标签、组件名（key Title Case）、场景标题（40 个高频
  key 映射 + Title Case 兜底）、页面 chrome 全部双语；组件**描述**暂无
  英文数据（英文模式下隐藏，登记于 README 待补真实翻译）。

## 脚本

| 命令                   | 说明                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `pnpm gen:demos`       | 一次性引导：从 git HEAD 的 docs demo 目录迁入 demo 源（含 MP 可移植性改写）               |
| `pnpm gen:pages`       | 由 demo 源生成 `pages.json` / 首页 / 组件聚合页 / `demos-manifest.json`（生成物提交入库） |
| `pnpm dev:h5`          | H5 开发（自动先 gen:pages）                                                               |
| `pnpm dev:mp-weixin`   | 微信小程序开发                                                                            |
| `pnpm build:h5`        | H5 生产构建（`UNI_H5_BASE` 注入部署 base，默认 `/`）                                      |
| `pnpm build:mp-weixin` | 微信小程序生产构建                                                                        |

`dev` / `build` 不进根 turbo 门禁（双端编译耗时长），以本工程构建成功为验收。

## H5 部署

1. CI 自动：push 到 `main` 且命中相关路径时，构建并发布到 GitHub Pages
   （`https://hu-snail.github.io/snail-ui/`，base 由 workflow 的 `UNI_H5_BASE` 注入）。
2. 手动：Actions 页 `uni-demo deploy` → Run workflow。
3. 本地构建任意静态托管：`UNI_H5_BASE=/your-base/ pnpm build:h5`，部署
   `dist/build/h5`。

> docs 本地联调预览：`UNI_DEMO_PREVIEW_BASE=http://localhost:5173 pnpm dev:docs`，
> 让 docs 的 iframe 指向本地 `dev:h5`。

## 微信小程序发布

1. `src/manifest.json` 的 `mp-weixin.appid` 当前为占位（`touristappid`），
   发布前替换为真实 appid。
2. `pnpm build:mp-weixin` → 微信开发者工具「导入项目」选择 `dist/build/mp-weixin`。
3. 工具内上传 → 微信后台提交审核。
4. 自动化上传（`miniprogram-ci`）登记为 follow-up，需要上传私钥。

### 分包与体积（实测）

- demo 源按 docs 总览分组物理放入 `src/pages/<sub>/demos/`，组件 chunk 随
  文件位置归入对应 subPackage；`optimization.subPackages` 开启。
- 单分包组件数上限 `SUBPACKAGE_MAX_COMPS`（`scripts/subpackages.mjs`）控制
  切分（>14 个组件的组自动拆分），保持每个分包远离 2MB 红线。
- **真实体积（排除 macOS `._` 元数据垃圾）**：主包 **0.86MB**、最大分包
  0.18MB、整包 1.76MB，全部远低于微信限制（主包/单分包 2MB，总包 30MB）。
- `clean-dist-junk.mjs` 已挂入双端构建：非原生卷（exFAT 等）会给每个产物
  文件伴生 4KB 的 `._` 垃圾（实测 3400 个 / 9MB），微信开发者工具会照单
  打包上传，构建后必须清理。复盘见 `AUI-UNI-FB-012`。

## 作为 UI 库消费（easycom，wot-ui 同款模式）

终端用户 `npm i @snui/uni` 后在 `pages.json` 配置一条 easycom 规则即可：

```json
"easycom": {
  "custom": { "^sn-(.*)": "@snui/uni/components/sn-$1/sn-$1.vue" }
}
```

- easycom 按需编译：只打包**实际用到的组件**（全量 91 组件四件套也仅
  ~0.6MB），普通业务工程的主包没有压力。
- 组件源码以 .vue 形式随包分发，由项目侧 uni 编译器按目标端编译，
  与 wot-design-uni 的分发模型一致。

## 目录结构

```
src/
├── pages/index/index.vue      首页：组件目录（生成）
├── pages/<sub>/<comp>.vue     组件聚合页：静态展开该组件全部场景（生成）
├── pages/<sub>/demos/*.vue    demo 源（唯一事实源，fork 引导 + 手工演进）
├── pages.json                 首页 + subPackages（生成）
├── demos-manifest.json        目录清单（生成，docs 消费）
├── manifest.json / App.vue / main.ts / uni.scss
scripts/
├── fork-demos.mjs             一次性引导（git HEAD → demo 源，MP 可移植改写）
├── gen-pages.mjs              页面/清单生成器
├── subpackages.mjs            分组与 subPackage 切分（fork/gen 共享单源）
└── build-h5.mjs               H5 构建编排（部署 base 注入）
```

## demo 源约定（MP 可移植性）

- 模板只用 uni 组件（`view` / `text` / `scroll-view` …），不用 HTML 标签。
- 组件引用统一走 `@snui/uni-src/components/...`（源码别名）；**不要**从
  `@snui/uni` 裸包名 import（dist 按 H5 运行时预编译，MP 端不可用）。
- 不使用浏览器 API（`document` / `window` / `new Image`）；依赖浏览器能力
  的 demo 需登记 follow-up 并加入 `fork-demos.mjs` 的 `EXCLUDE`。
- 组件库侧避免 MP 编译器不支持的能力：`v-bind="obj"` 展开传参、`v-memo`、
  `<component :is>`、Vue 3.5 `useId`（详见 ADR-0005 与组件内注释）。
