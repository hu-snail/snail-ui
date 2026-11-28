# AUI-UNI-FB-021 — MP heart 图标黑色 + uni-demo-x 产物过期（用户三次反馈"改了没生效"）

- 状态：RESOLVED
- 范围：`packages/uni/src/components/sn-icon/sn-icon-mp.ts`、`apps/uni-demo-x/scripts/{gen-x,check-x}.mjs`
- 类型：MP 运行时缺陷 + 生成管线纪律（§103 立档）

## 现场

用户连续三轮反馈（截图分别为 uni-demo-x H5 / uni-demo MP-WEIXIN）：

1. 胶囊边框/图标样式改了但**页面上没有任何变化**（H5 5173）。
2. 「图标颜色 token 不对，都是黑色，小程序是对的」。
3. MP 模拟器里 `type="warning"` 按钮的 heart 图标黑色，参考应为白色；蓝/红/绿按钮图标均白色正确。

## 根因

### 根因 A：MP 图标取色查询的宿主优先级被迁移破坏（heart 黑色的直接原因）

232331e5（AUI-UNI-FB-012）把 `resolveUniHost`（自由 `uni` 标识符）迁移进 `sn-icon-mp.ts`
时，把 **uni 宿主的页面级查询排在了组件 `$scope` 原生查询前面**。uni 宿主的
`uni.createSelectorQuery().in(Vue proxy)` 在嵌套自定义组件（sn-button 内嵌
sn-icon）里作用域不可靠 —— heart 两个实例的 `fields({computedStyle:['color']})`
查询落空，而单次 50ms 重试也输掉了，于是永落 `ICON_INK_FALLBACK`（#1a1a1a，近黑）。
其余图标实例（check/plus/trash/arrow/search/settings）查询成功 → 白色/灰色正确。

**共同因子是 heart 图标实例本身，不是 warning 按钮**（排查时曾被按钮类型误导）。

诊断证据：`buildIconDataUrl(heartData, '#ffffff', 2)` 与 check 烘焙输出完全一致
（`stroke="#ffffff"`）——烘焙层无辜，黑色只能来自取色失败。

### 根因 B：uni-demo-x 是生成产物，源码改动不重跑管线就不生效（"改了没生效"）

`apps/uni-demo-x` 是 `gen-x.mjs` 从 `apps/uni-demo` 场景源生成的镜像（ADR-0004）。
前两轮只改了 `apps/uni-demo` 源码，没有跑
`pnpm -F @snui/uni-x build && pnpm -F @snui/uni-demo-x sync-uni-x && pnpm -F @snui/uni-demo-x gen`，
5173（uni-demo-x dev）持续服务旧 `.uvue` 产物 —— 旧 `.capsule` 样式（`text-primary`
近黑图标、`border-default` 边框、右侧手绘 •••⊙）全部照旧。

次要干扰：demo shell 有 style-pack 切换（localStorage `snui-demo-style`），
doodle 包内联级联会把 `--aui-color-text-secondary` 重映射为 #3f3f46（重描边设计），
探针时容易误判为 token 层 bug。

## 修法

1. `sn-icon-mp.ts`：新增 `pickMpQueryHost()` —— **`$scope.createSelectorQuery` 优先**
   （微信 Component 原生作用域，`.in($scope)` 原生收敛），uni 宿主仅兜底；重试从
   单次 50ms 改为 `RETRY_DELAYS_MS = [50,100,200,400,800,1600]` 有界退避（~3s 预算）。
2. 回归测试（`sn-icon-mp.test.ts`）：宿主优先级三态、重试预算锁、heart/check/plus
   目录图标烘焙 `stroke="#ffffff"`。
3. 生成管线纪律：`gen-x.mjs` 给每个生成产物头部写入源指纹
   `gen-x: source <repo-rel-path> sha256:<16hex>`；`check-x.mjs` 新增第 6 条
   **新鲜度契约** —— 逐产物重算源哈希，不一致即 FAIL（1444/1444 fresh）。
   AGENTS.md §113 登记管线契约。

## 追加根因 C：uni-app x web 上取色器被目标假设早退（图标全黑的主因）

uni-x 转换层（`packages/uni-x/src/transform/patches.ts`）把 sn-icon 的
`#ifndef MP` inline-`<svg>` 分支替换为 `<image>` 光栅化 —— **uni-app x 无内联
svg 元素，所有端（含 web）都走 data-URL 位图**。而 `sn-icon-mp.ts` 的取色门是
`typeof document === 'undefined'`（"只有 MP 没有文档"）—— uni-app x web 上
`document` 存在 → 取色器直接早退 → `mpIconColor` 永远停在
`ICON_INK_FALLBACK`（#1a1a1a）→ **全站图标黑色**（浏览器 DOM 实证：28 个
image 全部 `stroke="#1a1a1a"`，与按钮类型 / 图标名无关）。

修法：废除目标假设，按**真实渲染形态**判断 —— 新增 `rendersRasterized($el)`：
`$el` 无 DOM（MP/App）→ 走 selector query；DOM 有 `<svg>` 子节点（经典 uni H5）
→ currentColor 继承、不查询；DOM 无 `<svg>`（uni-app x web）→ 用
`getComputedStyle($el).color` 同步读取级联色（selector query 的 computedStyle
在 web 运行时不可靠）。

## 教训

- **改 `apps/uni-demo` / `packages/uni` / `packages/templates` 源码后，预览端生效路径
  是三步管线**（uni-x build → sync-uni-x → gen-x），缺一步就是"改了没生效"。
  check-x 新鲜度门现在会拦住漏跑，但人工跑管线仍是前置动作。
- 排查"两端不一致"先确认**两端跑的是不是同一份代码**（生成镜像 vs 直接编译源），
  再查组件逻辑；本例两端本来就不同源。
- MP computedStyle 查询是运行时竞态高发区：任何只重试一次的实现都会在重型页面
  上出现"部分实例失败"的随机黑图标。
