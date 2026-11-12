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
