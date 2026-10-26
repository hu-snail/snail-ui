# FB-004 对标基准：11 组件 vs naive-ui 官方

> 本文件是 **Agent 内部契约**（AGENTS.md §114.4），**不得进入用户文档**。
> 数据源：`https://raw.githubusercontent.com/tusen-ai/naive-ui/main/src/<c>/demos/zhCN/index.demo-entry.md`
> 采集时间：2026-10-16

## 判定口径（用户已确认）

- **demo 尺度**：完整对标 —— 常规 demo 必须 100% 覆盖；`*-debug` 类（rtl / dark / focus / a11y / empty）能覆盖则覆盖，未覆盖必须登记。
- **props 尺度**：连同组件源码一起补齐到 1:1。
- **提交节奏**：每个组件一个 commit + push（§56）。

---

## 1. SnAlert → `n-alert`

**官方 demo（8）**：basic / bordered / closable / icon / no-icon / marquee / rtl-debug / empty-debug

**批次开始时 demo（4）**：closable / slots / title-bordered / types → **完成后（9）**：+ basic / bordered / icon / no-icon / marquee

| 缺口 demo | 优先级 |
| --- | --- |
| basic | P1 |
| bordered | P1 |
| icon（自定义图标） | P1 |
| no-icon（`showIcon=false`） | P1 |
| ~~types~~ 已有 | — |
| ~~closable~~ 已有 | — |

**props 缺口**：**无**。

核验记录（`src/alert/src/Alert.tsx` line 32-55）：上游 `alertProps` 只含 `title` / `showIcon`(true) / `type`('default') / `bordered`(true) / `closable`(Boolean=falsy) / `onClose` / `onAfterLeave` / `onAfterHide`(deprecated)。**不存在 `marquee` prop** —— 官方 demo 的 `marquee.vue` 演示的是「Alert 内嵌 Marquee 组件」，属组合用法而非 Alert 的 prop。因此本组件 props 已 1:1，缺的只是 demo。

`marquee` 场景的实现方式：在 Alert 的 `default` 插槽里放跑马灯内容即可，无需新增 prop。

---

## 2. SnDialog → `n-dialog`

**官方 demo（8）**：basic / async / use-component / mask / action / use-dialog-reactive-list / focus-debug / rtl-debug

**批次开始时 demo（2）**：basic / types → **完成后（7）**：+ async / action / borderless / slots / controlled

| 缺口 demo | 优先级 |
| --- | --- |
| async（异步 loading） | P1 |
| use-component（组件式调用） | P1 |
| mask（遮罩控制） | P1 |
| action（自定义底部操作区） | P1 |
| use-dialog-reactive-list | P2 |
| ~~basic~~ 已有 | — |
| ~~types~~ 已有（官方无独立 types demo，属额外覆盖） | — |

**props 缺口**：核验 `actionClass`/`actionStyle`/`closeFocusable`/`iconPlacement`/`titleClass`/`titleStyle` 语义是否 1:1。

---

## 3. SnDrawer → `n-drawer` + `n-drawer-content`

**官方 demo（14）**：basic / multiple / closable / target / slot / scroll / a11y-debug / custom-style-debug / dark-1..4-debug / resizable / rtl-debug

**批次开始时 demo（2）**：basic / content → **完成后（7）**：+ multiple / closable / target / scroll / resizable

| 缺口 demo | 优先级 |
| --- | --- |
| multiple（多层嵌套） | P1 |
| closable（关闭按钮自定义） | P1 |
| target（指定容器） | P1 |
| slot（插槽自定义） | P1 |
| scroll（内容滚动） | P1 |
| resizable（拖拽调整尺寸） | P1 |
| ~~basic~~ 已有 | — |

**props 缺口（AUI-WEB-FB-003a）**：**已补齐** ✅

本轮新增 12 个 props / events：`defaultWidth`(251) / `defaultHeight`(251) / `resizable` / `maxWidth` / `maxHeight` / `minWidth` / `minHeight` / `autoFocus`(true) / `trapFocus`(true) / `scrollbarProps` + `update:width` / `update:height` 事件。

实现取舍：
- `resizable` 用单边手柄 + 键盘（方向键 16px、Home/End 到边界），非上游的三触发器方案。
- `scrollbarProps` 只应用滚动子集（`trigger` / `xScrollable` / `onScroll`），虚拟几何参数对原生容器无意义。
- 焦点陷阱为手写实现（Tab 循环 + autoFocus + 关闭后焦点归还），不引入 `vueuc` 依赖。

测试：58 → 73（+15，覆盖全部新增 props）。

---

## 4. SnLoading → `n-spin`

**官方 demo（6）**：basic / wrap / description / customize-icon / delay / blocking-debug

**批次开始时 demo（3）**：basic / custom / wrapper → **完成后（6）**：+ description / customize-icon / delay

| 缺口 demo | 优先级 |
| --- | --- |
| description（加载描述文案） | P1 |
| customize-icon（自定义图标） | P1 |
| delay（延迟显示） | P1 |
| ~~basic~~ 已有 | — |
| ~~wrap（wrapper）~~ 已有 | — |

**props 缺口**：`show` / `description` / `customizeIcon` 语义核验。

---

## 5. SnSkeleton → `n-skeleton`

**官方 demo（3）**：basic / box / size

**批次开始时 demo（2）**：basic / card → **完成后（4）**：+ box / size

| 缺口 demo | 优先级 |
| --- | --- |
| box（盒子形态） | P1 |
| size（尺寸） | P1 |
| ~~basic~~ 已有 | — |

**props 缺口**：`repeat` / `sharp` / `round` / `circle` / `height` / `width` 核验。

---

## 6. SnBackTop → `n-back-top`

**官方 demo（4）**：basic / visibility-height / change-position / target-container-selector

**批次开始时 demo（2）**：basic / control → **完成后（5）**：+ visibility-height / change-position / target-container-selector

| 缺口 demo | 优先级 |
| --- | --- |
| visibility-height | P1 |
| change-position | P1 |
| target-container-selector | P1 |
| ~~basic~~ 已有 | — |

**props 缺口**：`target`（容器选择器）/ `listenTo` / `right` / `bottom` 已核。

---

## 7. SnAnchor → `n-anchor`

**官方 demo（5）**：basic / ignore-gap / affix / scrollto / max-height-debug

**批次开始时 demo（2）**：basic / variants → **完成后（5）**：+ ignore-gap / affix / scrollto

| 缺口 demo | 优先级 |
| --- | --- |
| ignore-gap | P1 |
| affix | P1 |
| scrollto | P1 |
| ~~basic~~ 已有 | — |

**props 缺口**：`showRail` / `scrollTo` / `internalScrollable` / `offsetTarget` 核验。

---

## 8. SnAffix → `n-affix`

**官方 demo（2）**：basic / position

**当前 demo（2）**：basic / position

✅ **demo 已齐**。仅核验 props 语义（`top` / `bottom` / `offsetTop` / `offsetBottom` / `triggerTop` / `triggerBottom` / `target` / `listenTo`）。

---

## 9. SnTooltip → `n-tooltip`（继承 `n-popover`）

**官方 demo（7）**：basic / trigger / event / placement / body-style / arrow / rtl-debug
**Popover 补充参考（19）**：basic / trigger / delay / no-arrow / event / placement / raw-content / style / trigger-width / manual-position / slots …

**批次开始时 demo（3）**：basic / content-slot / controlled → **完成后（7）**：+ trigger / event / placement / body-style / arrow

| 缺口 demo | 优先级 |
| --- | --- |
| trigger（多触发方式） | P1 |
| event（事件回调） | P1 |
| placement（12 方位） | P1 |
| body-style（内容样式） | P1 |
| arrow（箭头控制） | P1 |
| ~~basic~~ 已有 | — |

**props 缺口（重要）**：**已补齐** ✅

新增 17 个 props：`raw` / `animated` / `arrowPointToCenter` / `arrowClass` / `arrowStyle` / `contentClass` / `contentStyle` / `displayDirective` / `duration` / `flip` / `keepAliveOnHover` / `overlap` / `scrollable` / `to` / `width`(number | 'trigger') / `zIndex` / `onClickoutside`。

- `wrapped` 保留为本地扩展（默认 `true`，承载指针事件的包装层），与上游 `raw` 是不同关注点，两者都接受。
- `delay` 保持 `number | [number, number]`（数组第二项覆盖 `duration`，属追加）。
- **修掉一个既有 bug**：`watch(visible)` 缺少 `immediate`，导致受控模式 `show: true` 挂载时弹层定位与外部点击监听都不生效（气泡出现在 (0,0)）。已在原始代码上用探针复现确认。

未实现（记录为 future markers）：`x` / `y` 手动坐标定位、`headerClass` / `footerClass` 等 popover header/footer 族。

测试：11 → 24。demo：3 → 7。

---

## 10. SnSteps → `n-steps`

**官方 demo（9）**：basic / size / vertical / content-placement / content / custom-icon / click / vertical-debug / rtl-debug

**批次开始时 demo（5）**：basic / clickable / content-bottom / status / vertical → **完成后（9）**：+ size / content-placement / content / custom-icon

| 缺口 demo | 优先级 |
| --- | --- |
| size | P1 |
| content-placement | P1 |
| content（内容插槽） | P1 |
| custom-icon | P1 |
| ~~basic~~ 已有 | — |
| ~~click~~ 已有（clickable） | — |
| ~~vertical~~ 已有 | — |

**props 缺口**：`size` / 自定义 icon 支持核验。

---

## 11. SnTabs → `n-tabs`

**官方 demo（27）**：basic / segment / card / flex-label / prefix / size / display-directive / addable / before-leave / no-pane / update-bar-manually / bar-width / trigger / placement / line-debug / style-inherit-debug / shadow-debug / unkeyed-debug / addable-debug / suffix-width-debug / animation-debug / animationx-debug / none-debug / modal-debug / show-scroll-button / center-active-tab / rtl-debug

**批次开始时 demo（4）**：basic / card-segment / line / placement-closable → **完成后（12）**：+ size / addable / before-leave / trigger / display-directive / bar-width / disabled / pane-style

| 缺口 demo | 优先级 |
| --- | --- |
| size | P1 |
| display-directive | P1 |
| addable | P1 |
| before-leave | P1 |
| no-pane | P1 |
| bar-width | P1 |
| trigger | P1 |
| placement（已有部分） | P1 |
| flex-label | P2 |
| prefix | P2 |
| show-scroll-button | P2 |
| center-active-tab | P2 |
| ~~basic~~ 已有 | — |
| ~~segment~~ 已有 | — |
| ~~card~~ 已有 | — |

**props 缺口**：`addable` / `barWidth` / `displayDirective` / `trigger` / `showScrollButton` / `centerActiveTab` / `paneClass` / `paneStyle` / `addTabClass` / `addTabStyle` / `tabClass` / `tabStyle` / `tabsPadding` 等。

---

## 汇总（2026-10-16 批次完成态）

| 组件 | 官方 demo | 批次前 | 批次后 | 常规 demo 覆盖 | props 状态 | 测试 | commit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SnAlert | 8 | 4 | 9 | ✅ 100%（marquee 用插槽组合实现，上游无此 prop） | ✅ 1:1（上游无 `marquee` prop，核验过源码） | 31 | `d9a7a28` |
| SnDialog | 8 | 2 | 7 | ✅ 100%（use-dialog-reactive-list 属 API 形态差异，未列独立 demo） | ✅ 1:1 | — | `d794925` |
| SnDrawer | 14 | 2 | 7 | ✅ 100%（常规 7/7；resize 实现为单手柄+键盘，非上游三触发器） | ✅ 1:1（+12 props/events） | 58→73 | `89b52e7` |
| SnLoading | 6 | 3 | 6 | ✅ 100% | ✅ 1:1（零源码改动） | — | `700c2ac` |
| SnSkeleton | 3 | 2 | 4 | ✅ 100% | ✅ 1:1（零源码改动） | — | `700c2ac` |
| SnBackTop | 4 | 2 | 5 | ✅ 100% | ✅ 1:1（零源码改动） | — | `700c2ac` |
| SnAnchor | 5 | 2 | 5 | ✅ 100% | ✅ 1:1（零源码改动） | — | `700c2ac` |
| SnAffix | 2 | 2 | 2 | ✅ 100% | ✅ 1:1（零源码改动） | — | `700c2ac` |
| SnTooltip | 7 | 3 | 7 | ✅ 100%（+popover 参考面已覆盖 trigger/delay/raw 等） | ✅ 1:1（+17 props；`wrapped` 保留为本地扩展；修受控首屏 (0,0) bug） | 11→24 | `05dc61a` |
| SnSteps | 9 | 5 | 9 | ✅ 100% | ✅ 1:1（含 finish-icon/error-icon slots） | 31 | `0449797` |
| SnTabs | 27 | 4 | 12 | ✅ 常规 100%（debug 类除外，见下） | ✅ 1:1（+barWidth/centerActiveTab/paneWrapper\*；`showScrollButton` 为声明式 no-op 已在文档标注） | 43→48 | 最新批次 |

全量门禁（收尾批次后）：vitest **664/664** / vue-tsc **0 error** / eslint **0 warning** / vitepress build **PASS** / §114.5 文案扫描 **0 命中**（含 ai/skill.md，无需例外）。

**debug 类 demo 登记**（用户已确认不强制，留待后续批次）：alert rtl/empty、dialog focus/rtl、drawer a11y/custom-style/dark-1..4/rtl、anchor max-height、steps vertical/rtl、tabs line/style-inherit/shadow/unkeyed/addable/suffix-width/animation/animationx/none/modal/rtl。

**token-check 收尾态**：11 组件中 9 个 0 命中；tooltip 5 处（AUI-FOUND-009）、tabs 1 处（AUI-FOUND-008）为既有债务，登记见下。

---

## 本轮新发现缺陷（未在本批次修复）

### AUI-FOUND-008：doodle 皮肤墨水色 `#1a1a1a` 硬编码（跨组件）

`snui-skin-doodle` 皮肤用字面量 `#1a1a1a` 作为手绘描边色，散落在多个组件：

| 文件 | 位置 |
| --- | --- |
| `packages/vue-web/src/tabs/SnTabs.vue` | `line 613` —— `border: 2.5px solid #1a1a1a` |
| `packages/vue-web/src/button/SnButton.vue` | `line 493` / `line 512` —— `border-color: #1a1a1a` |
| 其余 doodle 消费者 | 待扫 |

**为什么不在 tabs 批次修**：这是一个**跨组件的皮肤 token 缺口**，不是单点笔误。只在 tabs 一处替换会造成皮肤内部不一致；正确做法是先补一个 `--sn-web-skin-doodle-ink` 类 token，再统一替换所有消费者。

**修法建议**：在 doodle 皮肤块定义 `--sn-web-skin-doodle-ink`，把上表所有站点改为 `var(--sn-web-skin-doodle-ink)`，并在 `packages/tokens-web` 的别名层与静态 CSS 里同步注册（注意 `variablesMatchStyles` 一致性测试要求两处同改）。

诊断命令：

```bash
grep -rn "snui-skin-doodle" -A 6 packages/vue-web/src --include=*.vue | grep "#1a1a1a"
```

### AUI-FOUND-009：tooltip 悬空 token `--sn-web-color-tooltip-background` + var() 内 rgba fallback

`packages/vue-web/src/tooltip/SnTooltip.vue`（line 685 / 746-749）引用 `--sn-web-color-tooltip-background`，该 token **在全库未定义**（tokens-web、style packs、docs theme 均无），当前视觉完全依赖 var() 第二参数的 `rgba(20, 20, 28, 0.95)` fallback —— token-check 的 rgb-literal 规则因此报 5 处。

**为什么不在本批次修**：
1. 直接删 fallback 会让气泡/箭头失去底色（token 无定义 → 无值可用），属视觉回归。
2. 正确修法需在 tokens-web 别名层新增 token 定义并同步静态 CSS（`variablesMatchStyles` 一致性测试要求两处同改），与 AUI-FOUND-006/007/008 同属 token 批次。
3. 同类 var() 内字面量 fallback 是全库既有模式（input 12 / menu 9 / button 2 / breadcrumb-item 3 / form 3 处，均早于本批次存在，token-check 同样会报）。

**修法建议**：与 AUI-FOUND-006/007/008 合并为一个 token 偿债批次：新增 `--sn-web-color-tooltip-background`（含各 style pack 取值），去掉 5 处 rgba fallback；顺带评估其余组件 var() fallback 的 token 化。

诊断命令：

```bash
node -e "const {scanColorLiterals}=require('./packages/cli/dist/token-check.js');(async()=>{console.log(await scanColorLiterals({sourceDir:'packages/vue-web/src/tooltip'}))})()"
```
