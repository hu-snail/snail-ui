# uni-app x · 微信小程序兼容（uni-demo-x MP-WEIXIN）

> 现象：MP 端编译通过后整页报错 `AbortController is not defined` 与
> `_a.call is not a function`，且所有 @snui 组件"裸奔"（无颜色 / 圆角 / 尺寸），
> demo 外壳却样式正常。

## 根因 1 — 运行时没有 AbortController

- 现场：`sn-icon.uvue:182` `ReferenceError`，发生在 `watch(..., { immediate: true })`
  触发的 `loadRemote()`。
- 根因：微信小程序 JS 运行时无全局 `AbortController`；`loadRemote` 在 try 外
  `new AbortController()`，错误直接冒到 app 级。图标走网络回退（iconify）即触发。
- 同类隐患：`sn-icon-iconify.ts` 的 `ctx.signal ?? new AbortController().signal`
  与 `defaultRequest` 里对 `external` 无保护的 `addEventListener`。
- 修复：能力探测 `typeof AbortController === 'undefined'` → null；signal 全链路
  可选（`signal?: AbortSignal | undefined`，注意 `exactOptionalPropertyTypes`）；
  竞态仍由 `loadSeq` 序号守卫保证。fetch 分支保留（MP 无 fetch，不进入）。
- 回归：`sn-icon.test.ts` "still resolves the icon when the runtime has no AbortController"。

## 根因 2 — uni-mp-vue 的槽内容是数组，不是渲染函数

- 现场：`sn-avatar-group.uvue:174` `TypeError: _a.call is not a function`，堆栈落在
  `totalCount` computed。
- 根因：swc 把 `slots.default?.()` 编译成 `(_a = slots.default) == null ? void 0 : _a.call()`；
  H5/App 的 vue runtime 里 slots 是函数，uni-mp-vue 里是**预渲染的 vnode 数组** →
  `.call` 不存在 → computed 抛错 → 整个分组渲染失败。
- 修复：`resolveSlotNodes()` 纯函数归一化（函数 → 调用；数组 → 原样；其余 → []）。
- 回归：`sn-avatar-group-slots.test.ts`（4 例，含 MP 数组形态）。

## 根因 3 — token 变量在 MP 上从未定义（样式全失效）

- 现场：组件 class / scoped 样式 / wxss 全部正常产出，但视觉效果=无样式；
  `page { --demo-* }` 的 demo 外壳正常。
- 根因：token 层改写为类钩子 `.sn-theme-root`（ADR-0004，App 端无 `:root`）。
  该 class 挂在 demo-page-shell 组件**内部**，而规则写在 app.wxss —— 微信自定义
  组件样式隔离下，app.wxss 的**选择器不匹配组件内部节点**，所以 `--aui-*` /
  `--sn-mp-*` 从未生效；demo 外壳靠 `page{--demo-*}`（page 节点 + 自定义属性继承，
  继承不受选择器隔离影响）存活。
- 修复：token transform 同时产出 `page` 与 `.sn-theme-root` 双钩子 ——
  MP 走 page 继承链，App 继续走 class 钩子；文件体积两份选择器共享同一规则体。
- 回归：`transform-css.test.ts` tokens 模式断言 `page, .sn-theme-root`。

## 遗留 / Follow-up

- MP 深色模式：dark 覆盖仍挂在 `.dark` / `.sn-theme-dark` 类上（同样在组件内部），
  MP 上需要 `@media (prefers-color-scheme: dark)` + `page` 层产物，或宿主把 dark
  变量写进各页面 wxss。当前 MP 只保证浅色主题下组件样式生效。
- `[data-theme='dark']` 属性选择器 WXSS 不支持：仅该规则在 MP 被忽略，无副作用。

## 编译产物"文件翻倍" — exFAT AppleDouble（环境问题，非遗留代码问题）

- 现场：`unpackage/dist/dev/mp-weixin` 里 1538 个 js 有 769 个是 `._avatar.js`
  这类文件；微信开发者工具文件树里 `pages/**/demos/._*` 与真实页面交错，看起来
  像"组件源码混进 pages"。
- 根因：仓库位于 **exFAT 卷**（`diskutil info` → File System Personality: exFAT）。
  macOS 对 exFAT 上写入的每个文件生成 `._同名` 伴生文件（存 xattr /
  `com.apple.provenance`）。`pages/` 下的 demo 页面按设计一页一场景（pages.json
  100 个页面），每个真实文件在 dist 里都多出一个二进制伴生文件 → 文件数翻倍。
- 验证：`._avatar.js` 开头是 `Mac OS X        ATTR`（AppleDouble 头），不是 JS；
  `git ls-files | grep '/\._'` = 0（全部未被跟踪，`.gitignore` 已含 `._*`）。
- 处置：
  - 已删除 dist 与源码树中的 `._*`（dist 769 → 0，源码 3643 → 0）。
  - 新增根脚本 `pnpm clean:appledouble`，构建后需要时再跑。
  - 根治在系统层（需重启生效）：
    `defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true`
    （exFAT 移动卷）/ `DSDontWriteNetworkStores`（网络卷）。
- 微信开发者工具若仍报 `WAWorker.js ... reading 'bg'` / `navigateTo:fail timeout`：
  前者是工具自身 worker（隐私授权链路）内部的错误，清理后重开项目观察；后者与
  100 个 demo 页面冷启动 + 工具压力相关，不是组件库代码路径。

