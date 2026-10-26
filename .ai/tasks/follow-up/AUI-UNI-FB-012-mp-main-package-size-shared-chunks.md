# AUI-UNI-FB-012 — MP 包体"超限"复盘：AppleDouble 垃圾污染测量，真实主包 0.86MB 达标

- 状态：CLOSED（结论：无体积问题；保留 `._` 清理与分包护栏）
- 工程：`apps/uni-demo`（ADR-0005）
- 类型：测量方法复盘 / 构建产物卫生

## 现场（错误结论，留档防止复发）

首轮验收报告称"主包 2.93MB 超微信 2MB 限制"，并据此设计了组件闭包按分包
复制方案（未实施即推翻）。

## 根因：测量脚本把 AppleDouble 垃圾算进了包体

- 本仓库位于非原生卷（exFAT 类）：每写入一个文件，macOS 伴生一个 4KB 的
  `._x` AppleDouble 元数据文件。MP 产物 dist 中实测 **2327~3400 个 `._`
  文件 ≈ 9MB**。
- 首轮统计命令的过滤条件 `grep -v "^\._"` 只能排除路径**开头**的 `._`，
  嵌套在目录内的 `node-modules/.../._sn-input.js` 全部漏网。
- 排除 `._` 后的真实体积：**主包 0.86MB**（app 根文件 205KB + 组件库四件套
  571KB + common 99KB + 首页 26KB），最大分包 0.18MB，整包 1.76MB ——
  全部远低于微信限制（主包/单分包 2MB，总包 30MB）。

## 仍然保留的两个措施

1. **`scripts/clean-dist-junk.mjs`**（挂入 build:h5 / build:mp-weixin）：
   构建后删除 dist 内全部 `._` 文件。这不是测量问题——微信开发者工具会把
   dist 里的垃圾一并打包上传，必须清理；CI（Linux）不会产生，脚本幂等。
2. **分包切分护栏**（`SUBPACKAGE_MAX_COMPS = 14`，form → form/form-2）：
   真实体积下非必需，但组件数继续增长时保持每个分包远离 2MB 红线，成本为零。

## wot-ui 消费模式对齐说明（"别人用这个库主包会不会满"）

不会。库侧机制与 wot-design-uni 一致：

- `@snui/uni` 的 exports 暴露 `./components/*`（源码 .vue），消费者在
  `pages.json` 配一条 easycom 规则即可按需编译：

  ```json
  "easycom": { "custom": { "^sn-(.*)": "@snui/uni/components/sn-$1/sn-$1.vue" } }
  ```

- easycom 只编译**实际用到的组件**；全量 91 个组件的四件套也只有 ~0.6MB，
  用多少算多少，主包不构成压力。
- 跨分包共享的组件 chunk 由 uni 编译进主包 common（本量级 < 1MB）。

## 教训

1. 卷会生成 AppleDouble 垃圾时，任何包体统计必须按 basename 过滤 `._*`。
2. 包体结论以微信开发者工具/上传校验为准，脚本统计只作参考。
