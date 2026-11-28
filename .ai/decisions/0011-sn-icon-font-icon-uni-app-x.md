# ADR-0011 — sn-icon 字体图标方案（uni-app x 优先）

> 状态：**PROPOSED（等待 Human Gate §74 审批）**
> 关联：AUI-UNI-FB-021（MP/uni-app x 图标取色三连修）、AGENTS.md §84/§85（Capability/Fallback）
> 作者：AUI Agent ｜ 日期：2026-11-16

## 1. Decision（拟决策）

sn-icon 引入**一等字体图标路径**：内置 iconfont 子集 + 宿主字体双轨，uni-app x
端字形渲染改为 `<text>` + unicode 字面量（App 原生不支持伪元素），SVG 光栅化
降级为 Fallback。分两阶段落地：

- **阶段一（验证链路）**：不改默认行为——宿主可注入 iconfont 字体（样式表 +
  `loadFontFace` bootstrap），sn-icon `name` 路径在 uni-app x 端改用 `<text>`
  渲染 unicode；demo 加字体图标场景实测三端（web / MP-WEIXIN / App）。
- **阶段二（内置子集）**：从现有目录取高频子集（约 100 枚）制作 fill 风格
  iconfont（woff2 base64 进分包 CSS + ttf 供 App），发布 `snui-icons` 字体与
  name→codepoint 映射；`sn-icon` 增加渲染策略 prop
  `render: 'auto' | 'font' | 'svg'`（默认 auto：字体已加载且命中映射 → 字体，
  否则 SVG 光栅化，§85 显式可测）。

## 2. Context（为什么现在做）

1. **SVG 光栅化的颜色链路脆弱**：uni-app x 无内联 `<svg>` 元素，转换层把所有端
   （含 web）的图标都替换为 `<image>` 位图（ADR-0004 管线）。位图颜色必须把
   级联色"烘焙"进 data-URL —— 取色链路连续三轮出问题（AUI-UNI-FB-021：宿主
   优先级回归 / 重试竞态 / web 目标假设早退）。
2. **字体图标在所有端天然继承 CSS `color`**：无需取色、无需烘焙、无查询竞态、
   任意缩放清晰、渲染开销远低于 base64 位图 —— 这是成熟 uni 系方案清一色选
   字体的原因。
3. 现有字形路径（`name` + `classPrefix` + `css-icon`）在 MP/web 可用（宿主提供
   iconfont CSS，伪元素/类承载字形），但 **uni-app x App 端不可用**：uvue 原生
   渲染不支持 CSS 伪元素与任意 view 内文本，字形必须走 `<text>` 字面量。

## 3. Reference Survey（成熟方案调研）

| 方案                                                      | 字体资产                                                                                             | 端适配                                                                                               | 关键机制                                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **uni-ui `uni-icons`**（uni 生态标准答案）                | 自带 ttf + JS 端 glyphMap（name→unicode）                                                            | App：`uni.loadFontFace` 启动加载；MP/H5：@font-face CSS                                              | `<text>` 渲染 unicode 字面量；字号走 font-size                                                                                                                                                                                                                                                                              |
| **Lime UI `lime-icon`**（uni-app x 原生库，用户指定参考） | `registerFontIcon({ prefix, fontFamily, icons: {name→'E600'}, fontUrl, jsonUrl })` —— 注册制字体图标 | 三端：`<text>` 渲染 unicode 字面量 + fontFamily；App 端注册内部走 loadFontFace；web/MP 走 @font-face | 双轨图标源：内置字体 + **Iconify**（`collection:name`，默认走 iconify API，可 `@iconify/tools` 私有化离线 JSON）+ 图片 URL；SVG 在 App 端**依赖收费原生插件 lime-svg**（¥8 + 自定义基座）；token：`--l-icon-size`（App 16px / Web 1em）、`--l-icon-color`（App $text-primary / Web currentColor）、`inherit: true` 继承父色 |
| **wot-ui `wd-icon`**                                      | iconfont.cn 项目字体（woff2/ttf），CSS 类承载                                                        | MP/H5/App：@font-face + class 伪元素                                                                 | class 字形 + `color` 继承                                                                                                                                                                                                                                                                                                   |
| **uview-plus `u-icon`**                                   | 内置 ttf（@font-face 网络地址）+ `custom-fontUrl` 宿主自定义                                         | MP/H5：class 字形；App：loadFontFace                                                                 | class 字形 + name→unicode 兜底                                                                                                                                                                                                                                                                                              |
| **vant 4 / element-plus**                                 | 仅 web 端方案（vant 字体、element SVG 组件）                                                         | 不覆盖小程序/App 原生                                                                                | 不适用（但 element 证实"svg 组件式"在纯 web 是主流）                                                                                                                                                                                                                                                                        |

**结论**：

1. uni 生态的跨端收敛答案是 **ttf + glyphMap（name→unicode）+ loadFontFace + `<text>`
   unicode 渲染**（uni-ui / lime-icon 双重印证）。wot-ui/uview 的 class+伪元素方案在
   uni-app x App 端不可行。
2. **lime-icon 证实了 uni-app x 的 svg 渲染困境**：连它都要靠收费原生插件才能在
   App 端画 SVG —— 我们的 base64 `<image>` 光栅化是免插件路线，应保留为 Fallback。
3. **采纳 lime-icon 的注册 API 形态**：`registerFontIcon({ prefix, fontFamily,
icons, fontUrl })` —— 比 ADR 初稿的 `registerIconFont({ family, css })` 更清晰
   （name→unicode 映射 + 字体 URL 显式分离），宿主字体与内置字体同一条注册通道。
4. lime-icon 的 `--l-icon-color`（App 固定 $text-primary / Web currentColor）与我方
   `--sn-mp-*` 继承策略一致；其 `inherit` prop 印证"颜色继承"是字体图标的核益。

## 4. Options

### Option A — 仅内置自研字体（全面替换 SVG）

- 优点：单一渲染路径，删除整个光栅化/取色子系统。
- 缺点/风险：
  1. **stroke→fill 设计成本**：现有目录是 lucide 描边风格，iconfont 字形是
     fill 轮廓 —— 描边图形无法无损转字体，需要重绘或描边转轮廓（约 100+ 枚
     设计工作量）；
  2. 失去描边风格一致性与 `stroke-width` 旋钮；
  3. 全量字体文件体积大（全目录 woff2 ≈ 150-300KB，base64 进 MP 主包不可接受）。

### Option B — 仅宿主字体通道（现状增强，无内置字体）

- 优点：零设计成本、零包体；demo/文档讲清用法即交付。
- 缺点：默认体验仍是 SVG 光栅化，颜色链路脆弱性保留；"内置开箱即用"缺位。

### Option C — 混合（推荐）：内置 fill 风格子集字体 + SVG Fallback + 宿主字体通道

- 内置子集（高频 100 枚，fill 风格重绘）走字体；长尾/描边特殊图形保留 SVG；
- 宿主 iconfont 继续走 `name`/`css-icon` class 通道（wot-ui 兼容形态）；
- 渲染策略 `render: 'auto' | 'font' | 'svg'` 显式可测（§85），auto = 字体优先 +
  SVG 兜底。

## 5. Reason

- uni-app x 三端一致的字形渲染必须 `<text>` 字面量（App 端无伪元素），uni-ui
  模式是唯一全端覆盖的成熟路径；
- 颜色继承消除 FB-021 整个 bug 类；
- 分阶段把风险拆开：阶段一先证明 `<text>` 字形在三端可用（尤其 uni-app x App
  的 loadFontFace 时序），阶段二再做字体资产（依赖 Human 的设计资源）。

## 6. Trade-offs

- 字体子集 = 双源维护（SVG 目录 ↔ 字体 codepoint），需要 CI 校验映射同步；
- MP 主包体积：woff2 base64 必须放**分包** CSS（web/MP 均可延迟加载）；
- App 首帧：loadFontFace 完成前字形可能闪底 → auto 模式在字体未就绪时回落
  SVG（已加载状态存内存标记，不引入取色查询）；
- `render` prop 是 Public API additive（§78），需 §90 Human Gate（本 ADR 即 Gate）。

## 7. Consequences / Rollout

1. **阶段一**（约 0.5d，纯代码）：
   - `sn-icon` 字形分支按端分流：uni-app x（转换补丁识别）→ `<text>{{unicode}}</text>`
     - `fontFamily` 样式；MP/web → 维持 class 字形；
   - 新增 `registerFontIcon({ prefix, fontFamily, icons, fontUrl, jsonUrl })`
     （lime-icon 同形态）：name→unicode 映射注册；App 端 `uni.loadFontFace(fontUrl)`
     bootstrap，web/MP 端注入 @font-face 样式（fontUrl https 直链或 base64）；
   - 内置目录与字体的对应关系：注册成功后 `name` 命中映射 → 走字形渲染，未命中
     → 回落 SVG 目录/Provider（现有解析链不动）；
   - demo：`icon-mp-font.vue` 三端场景（内置字体 + 宿主注册字体 + unicode 直传）；
     文档双语同步（§110）。
   - 验收：web / MP-WEIXIN / App（HBuilderX）三端字形显示 + color 继承正确。
2. **阶段二**（依赖设计资源，约 1-2d）：
   - `scripts/build-icon-font.mjs`：目录子集 SVG → fill 轮廓字体（svgtofont /
     iconfont 工具链）→ woff2 base64（分包）+ ttf + codepoint map TS；内置字体
     走同一 `registerFontIcon` 通道注册（内置 = 默认注册的字体包）；
   - CI：codepoint map 与目录一致性校验（缺映射即 FAIL）；
   - `render` prop + auto 策略 + Fallback 测试；`docs` 同步。
3. 明确不做：全量目录字体化（Option A）；删除 SVG 光栅化（保留为 Fallback，
   uni-app x App 的 svg 原生插件路线不考虑——收费 + 自定义基座，§57 依赖原则）。

## 8. 影响 Public API

- additive：`sn-icon.render` prop（阶段二）、`registerFontIcon()`（阶段一，
  lime-icon 同形态签名）、`sn-icon` 新增内置字体类目常量。均 additive（§78），
  不破坏现有调用。
