# AUI-DOCS-FB-012 — rpx demo anchor 差一层 `..` 静默失效 + vite 改写 `new URL(字面量, import.meta.url)`

- 状态：CLOSED（本 note 即修复记录）
- 文件：`apps/docs/.vitepress/utils/rpx-transform.ts`、`packages/uni/src/components/sn-slider/sn-slider.vue`
- 类型：预览管线 + 组件样式

## 现场

`/components/uni/slider` 手机预览布局错乱：

1. 所有横向 slider 的蓝色进度线比旋钮中心高 12px（垂直 slider 左偏 12px）；
2. demo 文件自己的 scoped 样式（`gap` / `padding` / `font-size` 的 rpx 值）全部被浏览器丢弃，
   meta 文案继承页面默认字号、`custom-class` 的边框整条消失、vertical demo 间距塌掉；
3. `.sn-slider__mark` 标签继承页面行高，24px 高的文字溢出 16px 的 marks 行。

## 根因

**根因 1（demo anchor 差一层 `..`）**：`rpxTransform()` 里 demo anchor 写的是
`new URL('../../demo', import.meta.url)`。`import.meta.url` 是**文件**路径
（`…/apps/docs/.vitepress/utils/rpx-transform.ts`），URL 解析先替换文件名再逐级 `..`：
两次 `..` 从 `utils/` 落到 `apps/docs/`，拼出 **`apps/docs/demo`（不存在）**。
真实目录是 `apps/docs/.vitepress/demo`，需要**一次** `..`。anchor 永远匹配不上 →
demo scoped CSS 的 rpx 从未被转换 → 含 rpx 的声明被浏览器整条丢弃。
同类陷阱：`uniSrcAbsPath` 用 4 次 `..`（utils → .vitepress → docs → apps → 仓库根）是对的，
两个 anchor 少算一层是因为把「文件所在目录」当成了「目录本身」做起点。

**根因 2（组件内联样式覆盖类居中）**：`sn-slider.vue` 的 `activeStyle` 给横向 line 发
`top: '0', bottom: '0'`（垂直发 `left: '0', right: '0'`），内联样式覆盖了 scoped 类里
`top: 50%; margin-top: -2rpx` / `left: 50%; margin-left: -2rpx` 的居中定位。
over-constrained 下 `height` 赢、`bottom` 被忽略 → 线钉在轨道顶/左缘，
与 `top: 50%` 定位的旋钮错开半个轨道（24px 轨道 → 12px）。**真机 MP 端同样中招**，不是预览专属。

## 修法

1. anchor 改为 `new URL('../demo', moduleUrl)`，`demo-en` 同理；
2. `import.meta.url` 先存进 `moduleUrl` 变量再传给 `new URL` —— **vite 的 asset 插件会静态改写
   `new URL('<字面量>', import.meta.url)`**（把相对路径当模块解析成 `http://…/@fs/...`），
   vitest 经 vite-node 加载该文件时 `fileURLToPath` 直接抛
   `The URL must be of scheme file`。变量形式打断静态匹配，esbuild 配置打包 / vite dev / vitest 三条加载路径行为一致；
3. demo 目录命中加 `isCssModuleId` 守卫（`type=style` / `lang.css` / `.css`）——
   demo 目录还服务 `?raw` 源码模块（代码面板必须保留原始 rpx 供用户复制）和编译后 JS chunk
   （模板内联 `custom-style` 的 rpx 由 uni-preview-shims 运行时桥处理）；
4. `activeStyle` 只发几何（横向 `left`+`width`、垂直 `bottom`+`height`），垂直居中/水平居中还给 scoped 类；
5. `.sn-slider__mark` 加 `line-height: 1.2`。

## Regression

- `apps/docs/.vitepress/utils/rpx-transform.test.ts`：demo scoped style 转换、`?raw`/JS chunk 不转换、
  uni-src / dist css 转换、无关 id 跳过（含 0.5 比率与负数/小数）。
- `sn-slider.test.ts`："leaves line centering to the stylesheet instead of inline overrides"——
  断言 line 内联样式只含 `left`/`width`（横向）与 `bottom`/`height`（垂直），不得再出现 `top`/`bottom`/`left`/`right` 居中覆盖。
- 浏览器实测：9 个 slider 线-旋钮中心偏移全部归零；demo scoped 值生效（meta 12px、边框 1px、row gap 24px）；
  生产构建 dist CSS 0 个 rpx 残留、`?raw` 源码仍保留 rpx。

## 关联

- anchor 注释里提到的 `0622e1e`（uni-src 路径少一个 `..`）是**同一类错误第二次发生**——
  写「从 import.meta.url 出发走 N 层」的路径时，必须先明确起点是文件还是目录。
