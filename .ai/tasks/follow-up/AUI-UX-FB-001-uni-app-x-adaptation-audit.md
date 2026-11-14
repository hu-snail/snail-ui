# AUI-UX-FB-001 — uni-app x 适配全面审计（web 编译实测驱动）

> 2026-11-12 · 触发：uni-demo-x web 编译逐轮实测（用户反馈 + DevTools 截图对照 uni-demo）。
> 产物：`@snui/uni-x` dist / `apps/uni-demo-x`（ADR-0004 单源码双产物）。

## 一、已修复（本轮实测发现 → 管线确定性修复）

| # | 缺陷 | 根因 | 修复 | commit |
|---|------|------|------|--------|
| 1 | web 端页面无法运行 | 缺 index.html（uni-app x web 编译入口） | 按 HBuilderX 官方模板补 `/main` 无扩展名入口 | 8a81ab3d |
| 2 | `Failed to resolve import "../sn-icon/sn-icon.vue"` 等 83 处 | 管线不改写 import 说明符；dist 实体是 `.uvue` | `transformImportSpecifiers`：相对 `.vue`→`.uvue`；IconData 类型→`sn-icon-types` | 8a81ab3d |
| 3 | `sn-icon.vue` 类型导入无实体 | SnFabAction/SnDialerPrize/SnLuckyPrize 定义在 SFC script setup | 类型契约拆到 `*-types.ts`（sn-icon-types 同构），gen-x 泛化校验 fail-loud | 8a81ab3d |
| 4 | `Failed to resolve component: SnAvatar`（全组件不渲染） | easycom 正则 `^sn-` 大小写敏感匹配不了 PascalCase 标签；gen-x 曾删除显式导入指望 easycom | gen-x 全量重映射为显式 `.uvue` 导入（局部绑定原生路径） | 378d8010 |
| 5 | `sn-rich-text-node` 包路径导入失败 | easycom 劫持 dist 组件**内部** kebab 子标签，生成不存在的目录布局路径 | `rewriteKebabTags`：有显式导入的 kebab 标签改写为 PascalCase 绑定名（16 个嵌套实体全部受益） | 39a24aae |
| 6 | **全页纵向堆叠**（flex 行变列、按钮图标文字竖排） | uni-app x 全平台把 `flex-direction` 默认重置为 **column**（W3C 为 row），App 端同样中招 | `transformCss` 注入：`display: flex/inline-flex` 且无显式方向的规则补 `flex-direction: row`（组件层 89 处 + demo/模板层同管线） | a4b56ea8 |

复现口径：`pnpm -F @snui/uni-x build && pnpm -F @snui/uni-demo-x gen && pnpm -F @snui/uni-demo-x check`（check 全绿）；回归 uni-x 47/47、uni 3800/3800。

## 二、P1 — App 端文字样式继承缺失（静态审计，真机前必处理）

**官方事实**（uni-app-x/css）：App 端（app-uvue）**样式完全不继承**——容器 view 上的 `color` / `font-size` 等文字样式对内部 `<text>` 无效；web 端继承正常。**两端行为不一致**，web 预览验证不出此缺陷。

静态审计（class→标签映射交叉 CSS 文字样式声明，过滤动态绑定后）：

```text
影响面：64 个组件 / 140 个依赖点
Top：sn-rich-text(7) sn-button(5) sn-cell(5) sn-form(5) sn-tag(5)
典型形态：.sn-button 主类 / --warning 修饰类 上的 color、font-size、line-height
         ——内部 text 无显式文字样式，靠继承（App 端将渲染为默认黑字）
```

另：`inherit` / `unset` 关键字 App 端不支持——组件源中少量真实使用
（sn-action-sheet `font-size/color: inherit`、sn-avatar `border-radius/color: inherit` 等）。

**修复策略选项**（需 Human Gate 拍板后分批执行）：

- **A. 源码级下沉**（两端一致，推荐）：把容器类上的文字样式显式写到子 `<text>` 的类规则上。改动 64 组件的模板 + CSS，修饰类状态（如 `--warning` 的 color）需同步到 text 的 class 绑定——工程量大但语义干净，符合「单源码」。
- B. 管线级自动下沉：模板树 + CSS 语义交叉分析，自动给未样式化的 text 注入继承链样式——语义边界模糊（修饰类状态联动无法静态解析），误改风险高，不建议。
- C. 真机验证驱动：先跑通 App 编译，按实际视觉缺陷逐组件修——与 A 相同终点，由实测排优先级。

**复现审计**：`node /tmp/uni-x-inherit-audit.mjs`（脚本随任务存档，口径见文件头注释）。

## 三、P2 — App 端已知视觉差异（预期内，真机确认）

| 项 | 静态计数 | 说明 |
|---|---|---|
| `box-shadow` | 47 处（产物保留） | App 端不支持；web 端生效。App 编译器忽略或报错待真机确认 |
| 伪类/伪元素/cursor/user-select/outline/appearance | 管线剥离，PORTING-REPORT 逐条在案 | 按压反馈改 hover-class（App 子集） |
| `white-space` 等文本属性 | 已剥 | App text 默认单行；web text 自动换行 |

## 四、P3 — 运行时行为真机验证清单（静态计数 = 验证量级参考）

| 项 | 计数 | 状态 |
|---|---|---|
| `position: fixed` | 21 处 | 真机清单（safe-area / 层级） |
| `gap` | 114 处 | 真机清单（字节码渲染） |
| `@keyframes` | 39 处 | 真机清单 |
| `transition` | 42 处 | 真机清单 |
| `overflow: auto/scroll` | 1 处（sn-popup:410） | App 需 scroll-view，验证是否降级 |
| `:style` 动态注入 CSS 变量 | ~80 处 | 真机清单（MANUAL_FLAGS 在案） |

## 五、预览口径

- **web 端 rpx 按屏宽等比换算**（750rpx = 屏宽）：桌面宽视口下组件等比放大为官方预期行为；demo 场景布局 px 与组件 rpx 在宽屏下失配。**web 预览请用 DevTools 手机模拟（375px）**，与 uni-demo 手机框口径一致。
- App 真机不受影响（屏宽即基准）。

## 六、App 端实测发现（第二轮，真机/模拟器截图驱动）

### 已修复

| # | 实测缺陷 | 根因 | 修复 |
|---|---------|------|------|
| 1 | 气泡 popover / 文字提示 tooltip 点击触发器无反应 | **uni-app x App 端事件传播不跨编译单元**：默认 slot 的触发内容（页面编译单元，如 SnButton）点击进不了组件编译单元的 trigger 包裹层（web 端靠 DOM 冒泡所以正常）。picker demo 佐证：页面直绑 emit 的点击链路在 App 端有效 | sn-popover / sn-tooltip 新增 **`trigger: 'slot' \| 'manual'`** prop（additive，默认 slot 不变）；manual 模式触发绑定 no-op，页面自绑 @click 切 v-model。26 个 demo 场景源全部适配（`@snui/uni` 102 项测试含新用例） |

### 已知边界（能力限制，非 bug）

| # | 实测缺陷 | 定性 |
|---|---------|------|
| 2 | sn-fab 扇形（fan）点击展开后 item 堆在锚点不散开 | 官方文档：transform 全系函数 App 端要求 **Vapor 5.21+/iOS 5.11+**（Android(Vapor) 5.21）。fan 布局核心依赖 `rotate+translateX+scale` 组合——低版本 App 编译目标下 transform 不生效，item 停在 `left/top: 50%` 锚点（与截图吻合）。line 模式不依赖 transform，不受影响。需在 HBuilderX 升级后复验 |

### 待复验（本轮未定论）

| # | 实测缺陷 | 现象与初步定性 |
|---|---------|--------------|
| 3 | picker 滚轮选中行分割线颜色发黑、视觉偏粗 | dist 规则 `border-top/bottom: 2rpx solid var(--sn-mp-color-border-subtle)` 完好；变量链完整（theme 产物浅色 #f4f4f5 系）。实测黑色 ≈ 暗色值 `#27272a`（tokens 暗色块）命中浅色弹层——疑似暗色变量作用域在 App 端与弹层挂载链路交叉。待用浅色主题复验 + HBuilderX 编译产物检查 |
| 4 | 图标（collapse 箭头等）颜色全黑 | **P1 继承缺陷的实证**：sn-icon 默认 `currentColor`（依赖父元素 color 继承），App 端样式不继承 → 回退默认黑。随 §二 P1「文字样式下沉」一并修复（消费方显式设色） |
| 5 | code-input 格子边框黑粗 | 与 #3 同源（`var()` 链在暗色作用域交叉），随复验一并确认 |

### 全面检索结论（本轮新增静态扫描）

- 事件传播模型：`@tap.stop` / `.stop` 修饰符全平台支持；`@tap`→`@click` 管线改写正确；页面直绑 emit 链路两端一致。**「默认 slot 内容触发组件行为」是 App 端唯一事件断点**（trigger-slot 组件全量检索：popover / tooltip 受影响，fab trigger 为组件内元素不受影响）。
- transform：官方 10 函数（rotate/scale/translate 系）；translate 百分比支持；matrix 不支持。App 端版本门槛见 #2。
- CSS 变量：App 端跨编译单元可达（`--sn-mp-color-action-primary` 实测生效）；暗色块（`.sn-theme-dark`）由 sn-config-provider / 宿主挂载——demo 工程页面根目前**静态挂浅色 `.sn-theme-root`**（DemoPageShell），暗色主题切换（demo-ui toggleTheme / uni.onThemeChange）在 App 端的挂载链路待验证（关联 #3/#5）。

## 七、CDP 实锤（第三轮）：产物链验证方法论 + 黑粗线根因

**方法论突破**：HBuilderX web 运行 = vite dev（内存 serve，`localhost:5173`）+ 内置浏览器（CDP 调试端口 9777）。直接 curl `http://localhost:5173/@fs/<绝对路径>/sn-popover.uvue` 可拿到**运行时编译产物**（grep 验证新逻辑/水印）；CDP `Runtime.evaluate` / `CSS.getMatchedStylesForNode` 可远程实测 DOM。产物链验证水印法：往 dist 注释埋标记 → 编译 → grep 缓存 sourcemap。

**结论**：产物链 **100% 通**（vite dev 实时编译最新 dist，运行时组件含全部修复）——此前「没生效」均非链路问题。

### 黑粗线根因（实锤 + 已修复）

CDP `getComputedStyle`：picker indicator `border-top: 3px solid rgb(9,9,11)`（medium + currentColor）而变量在元素上解析正常（#f4f4f5）。**编译后 CSS**：皮肤 flatten 在目标类上追加了 `border-top-width/color: var(--snx-…)`（**无 fallback**）——皮肤容器 class 未激活时 var() 走 initial（width=medium 3px、color=currentColor 黑），**打碎了基础 shorthand 的 1px 细灰线**。影响全部「皮肤声明 prop 而基础规则只有 shorthand」的注入点。

**修复**：`transformCss` Pass 0 收集时 `expandBorderShorthand` 把 border 简写拆成 longhand 存入基础表；flatten 注入带基础值 fallback（`var(--snx-…, 2rpx)` / `var(--snx-…, var(--sn-mp-color-border-subtle))`），合成条目（无真实节点）改为挂载式注入到目标类规则。dist 已验证。

### CDP 探测的其余定性

- **tooltip/popover 弹出**：桌面端 CDP 模拟点击实测**正常弹出**（`popAfterClick: true`）——manual trigger 修复生效。
- **fan 扇形**：inline transform 完整、收起态矩阵正常应用；展开态 computed 冻结在过渡起点是**后台 tab rAF 冻结**（内置浏览器失焦）——前台表现待用户复验；App 端仍受 transform 版本门槛约束。
- **暗色主题**：demo-ui 暗色下弹层 panel 正确渲染 #18181b 深底白字——暗色渲染链路正常。
- **rpx 视口放大**：indicator 3px = 4rpx × 视口系数 0.75（1125px 宽视口）——官方预期行为，DevTools 手机模拟归位。

## 八、第四轮更正：popover / tooltip 真机仍打不开的根因（manual trigger 修复不完整）

第二轮的修复（`trigger: 'slot' | 'manual'`，demo 切 manual + 页面自绑 @click）**没有修好真机**：
manual 模式依赖「页面给插槽里的 SnButton 绑 @click」这条链路，而它在 App 端同样不通——
事件监听绑在**插槽内容**（页面编译单元）上的组件 emit、以及插槽内容 tap 向宿主组件视图的
原生冒泡，在 App 端都到不了对方编译单元。当时「picker demo 佐证页面直绑 emit 有效」的引用
有误：picker demo 的 `@click` 绑在**页面自己的 `<view>`**（非组件、非插槽）上，不是 emit 链路。

真机有效的事件路径只有两条：
1. **组件内部视图的 tap**（fab 的 `@tap.stop="toggle"` 实测可开）；
2. **页面级普通元素 tap + v-model 进组件**（picker：`<view @click="open = true">` + `v-model:visible` 实测可开）。

**修复（源码级，两端共用）**：sn-popover / sn-tooltip 模板在 trigger 包裹层内新增
`<!-- #ifdef APP -->` 透明 catcher（组件自有节点，盖在触发器盒上，`@tap.stop="onTriggerTap"`）——
tap 直接落在组件自己的节点上（路径 1），不再依赖任何跨编译单元事件。hover-class 给出按压反馈
（App 端被 catcher 盖住的插槽内容收不到 touch）。web / MP 编译期剥除该节点（uni 端行为零变化）。
26 个 demo 场景回退到默认 slot 模式（撤销第二轮的 manual 适配）；`trigger="manual"` prop 保留，
语义收窄为「触发点在插槽外/编程式开关」场景。

App 端关闭路径：trigger 再点一次、气泡内关闭按钮；页面根 closeOutside 在 App 端不触发
（tap 不出编译单元），outside-close 通道在 App 上是 inert 的——drop-menu / fab / swipe-action /
toast 同样注册在该队列，App 端 outside-close 失效是**全队列问题**，留待后续任务统一处理。
