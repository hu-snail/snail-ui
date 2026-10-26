# AUI-UNI-FB-012 — MP 主包体积：跨分包共享组件 chunk 留主包（2.93MB > 2MB）

- 状态：OPEN
- 工程：`apps/uni-demo`（ADR-0005）
- 类型：小程序发布链路 / 构建优化

## 现场

`pnpm build:mp-weixin` 产物可在微信开发者工具导入运行，但**上传被包体限制拦截**：

- 主包（app + common + `node-modules/` 组件 chunk）≈ **2.93MB** > 微信主包 2MB。
- 11 个分包均 ≤ 1.45MB ✓（demo 源按 `pages/<sub>/demos/` 物理归包 +
  `optimization.subPackages` 已生效）。

超限部分 = `node-modules/` 下组件库 chunk ≈ 2.61MB。

## 根因

- 91 个组件中 **84 个只被单一分包使用**，7 个跨多分包
  （sn-icon ×8、sn-button ×9、sn-form / sn-input / sn-tag / sn-switch / sn-tabs）。
- uni 的 `optimization.subPackages` 只下沉「分包目录内文件」；node_modules
  路径的组件 chunk 一律输出到主包 `node-modules/`，不做按引用下沉。
- 微信规则：跨分包共享的代码必须放主包 → 7 个共享组件 chunk 无法下沉，但
  84 个单分包组件本可以（uni 无此机制）。

## 修法方向（按推荐序）

1. **组件闭包按分包复制 + 按导入方解析**：gen-pages 为每个分包复制其 demo
   所需组件的源码闭包（含组件内部相互引用，tokens 走 npm 包不动）到
   `pages/<sub>/vendor/`；vite alias 用 customResolver 按 importer 所在分包
   解析到该分包副本。demo 源保持 `@snui/uni-src` 写法不变（docs 用法面板
   不受影响）。预期主包 < 1MB。工作量 ≈ 一个任务，需回归双端构建。
2. 缩减 MP demo 覆盖（产品决策）：低频组件不进 MP 演示包。
3. 等待 uni 官方优化器支持 node_modules chunk 按引用下沉（不可控）。

## Regression

方案 1 落地后验收：`build:h5` 与 `build:mp-weixin` 全过、主包 ≤ 2MB、
docs `loadDemoUsage` 对全部 351 个 demo 仍能取到源码、抽查 3 个分包页面在
开发者工具正常渲染。
