# Follow-up: uni-demo 生产构建（build:mp-weixin）丢失全局 token 级联

- **发现日期**: 2026-11-20（popover 重构任务 AUI-OPT-07 后续验证中发现）
- **现象**: `pnpm build:mp-weixin` 产物的 `app.wxss`（约 270KB）完全缺失
  `@snui/uni/styles` 注入的 `--aui-color-*` 原语定义与 `--sn-mp-*` 别名级联
  （dev 构建 `uni -p mp-weixin` 的 app.wxss 约 464KB，两者都在）。全部组件颜色
  链 `--sn-mp-color-* → var(--aui-color-*)` 在生产构建运行时解析失败 → 背景透明、
  文字回退初始黑。`grep -c -- "--aui-color-text-primary:" app.wxss`：
  dev=1..N / build=0。
- **复现**: 干净 HEAD worktree（add58e37）`pnpm build:mp-weixin` 同样复现 →
  非本次改动引入；`rm -rf node_modules/.cache` 后复现 → 非构建缓存。
- **根因假设**: uni 生产构建对全局 CSS import（App.vue `import '@snui/uni/styles'`）
  的提取/minify 管线静默丢弃（无 warning）。dev 与 build 的 CSS 处理分支差异。
- **影响面**: 仅生产 mp-weixin 构建的演示工程运行时配色（组件库本身 token 机制
  无关；H5 与 uni-app x 构建不受影响）。
- **修复方向**: 对比 uni（5.33）dev/build 的 css 插件分支
  （@dcloudio/uni-mp-vite css 处理 / vite build cssCodeSplit、minify）；
  或演示工程改用 import 具体文件 + `uni.scss` 注入；或 manifest `mp-weixin.setting`
  关闭 postcss/minified 对照验证。
- **对应代码**: apps/uni-demo/src/App.vue（`import '@snui/uni/styles'`）、
  packages/uni/package.json exports（`./styles`）、
  apps/uni-demo/dist/{build,dev}/mp-weixin/app.wxss
