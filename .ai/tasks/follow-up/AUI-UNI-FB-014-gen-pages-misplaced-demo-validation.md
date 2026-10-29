# AUI-UNI-FB-014 — gen-pages 缺少「demo 文件与聚合页分包错位」校验

- 状态：OPEN
- 范围：`apps/uni-demo/scripts/gen-pages.mjs`
- 类型：构建工具健壮性（AGENTS.md §85 可预期回退）

## 现场

2026-06 修复 sn-img 预览构建问题时发现 `pnpm build:h5` / `build:mp-weixin` 在
HEAD 上就是坏的（与本修复无关的既有问题）：

- `pages/form/captcha.vue` import `./demos/captcha-mp-*.vue`，但文件实际在
  `pages/feedback-2/demos/`（已修：`git mv` 到 `form/demos/`）。
- `pages/form-2/picker.vue` import `./demos/picker-mp-*.vue`，但文件在
  `pages/form/demos/`（已修：`git mv` 到 `form-2/demos/`）。

根因：demo 文件被手工放进了错误的 subPackage 目录；`gen:pages` 只按
overview-data 的分组生成聚合页与 pages.json，从不校验「聚合页 import 的
demo 文件是否真的存在于同一目录」，于是生成物带着断链 import 入库，
构建在下一个人才跑时才炸。

## 修法方向

1. `gen-pages.mjs` 在生成每个聚合页后校验其 import 的 demo 文件存在；
   不存在时列出全部断链并 `process.exit(1)`（fail fast，不要生成坏产物）。
2. 反向校验可选：扫描 `pages/*/demos/*-mp-*.vue`，若某组件的 demo 目录与
   overview-data 分出的 subPackage 不一致则告警（提示应移动的目录）。
3. 把 `build:h5` 纳入 CI gate（当前 CI 只跑组件库测试，demo 站构建断裂
   两个提交才被发现）。

## 备注

按 §2 任务边界，修复 img 预览时只做了最小修复（移动 4+8 个已跟踪文件，
`git mv` 保留历史），生成器校验留此 follow-up。
