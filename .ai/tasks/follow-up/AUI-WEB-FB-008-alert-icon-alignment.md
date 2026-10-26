# AUI-WEB-FB-008 — SnAlert 图标 / 标题未居中

- 状态：FIXED
- 组件：`packages/vue-web/src/alert/SnAlert.vue`（Web 端）
- 类型：视觉缺陷（布局），非 API 变更

## 现场

用户反馈「Alert 组件标题和图标没有垂直水平居中」。浏览器实测（Playwright，Chrome，字号 14px / 行高 1.6）：

| 用例 | 图形盒 | 图形中心 − 首行文字中心 | 关闭按钮 − 首行文字中心 | 正文左边界 |
|---|---|---|---|---|
| info 标题+正文 | **14×16（横向压扁）** | **−3.5px** | — | 74 |
| info 仅标题 | 14×16 | −3.5px（图形比自身盒子中心还高 5.2px） | — | 74 |
| warning 可关闭 | 14×16 | −3.5px | **+12.89px** | 74 |
| error 多行正文 | 14×16 | −3.5px | **+24.1px** | 74 |
| default（无内置图形） | 无 | — | — | **60（凭空多缩进 8px）** |

## 四个独立根因

1. **`.sn-alert` 是 `display: flex` 但没有 `align-items`** → 默认 `stretch`，图标列与关闭按钮列被拉满整个 banner 高度；列内图形停在**列顶部**，多行正文时偏差随行数放大（关闭按钮偏到 +24px）。

2. **`.sn-alert__icon { line-height: 0 }`** → 列内是行内布局，`.sn-icon`（`display: inline-flex`）按基线对齐；svg 是替换元素、无文字基线，其基线被合成为**下边缘**，于是图形整体被顶到行盒上沿之外。与 (1) 叠加得到 −3.5px 的稳定偏差。

3. **`SnIcon` 的包装盒是 `width/height: 1em`，而图形是 px**：`.sn-alert` 字号 14px → 包装盒 14×14；`SnIcon` 默认 `size=16` → svg 16×16。包装盒本身是 flex 容器，svg 作为 flex item 默认 `flex-shrink: 1`，主轴（横向）被压缩到 14，交叉轴 `align-items: center` 不压缩 → **图形变成 14×16，横向压扁 12.5%**。这不是「没居中」，是「变形」。

4. **`type="default"` 渲染了一个空图标列**：`v-if="showIcon"` 只看开关、不看有没有图形，空列仍然贡献 `margin-right: 8px` → 正文白缩进 8px，且与带图标的 alert 文字列不对齐（文档里早已写明「`type="default"` 时……不会渲染」，代码与文档不一致）。

附带：`.sn-alert-body__title { margin-bottom: 2px }` 在「仅标题」时依然生效，使标题在自己的盒子里偏上 2px；`<button>` 不继承字号，`.sn-alert__close` 的 `em` 按 UA 的 13.33px 解析。

## 修法

| 根因 | 修法 |
|---|---|
| 1 | `.sn-alert { align-items: flex-start }` — 图标 / 关闭按钮对齐**首行**，不是多行 banner 的几何中心 |
| 2 | 图标列改 `display: flex; align-items: center; justify-content: center; height: 1.6em`，删掉 `line-height: 0`。`1.6em` 恰好等于首行行盒（14px × 1.6），图形中心 = 首行行盒中心 |
| 3 | `.sn-alert__icon :deep(.sn-icon) / .sn-alert__close :deep(.sn-icon) { width: auto; height: auto }` + `:deep(svg) { display: block; flex: none }`，让图形自己定义盒子 |
| 4 | 模板守卫改成 `v-if="showIcon && (iconComponent \|\| $slots.icon)"` |
| 附带 | 2px 间距从标题的 `margin-bottom` 移到 `.sn-alert-body__title + .sn-alert-body__content { margin-top: 2px }`；关闭按钮加 `font: inherit` |

修复后实测：图形盒 16×16；图标 / 关闭按钮与首行文字中心的偏差全部收敛到 **+0.69px**（同一行盒内 svg 盒与文字墨迹的字体度量差，亚像素级，不可再优化）；仅标题时图标与自身盒子中心偏差 −0.01px；`type="default"` 正文左边界回到 52（= padding）。多行正文时图标仍停在首行（−23.4px 相对整盒中心），符合预期。

## Follow-up（不在本次 scope）

**`SnIcon` 包装盒 `1em` 与图形 px 尺寸的口径冲突是库级问题**，本次只在 Alert 内做了局部收敛。任何 `font-size ≠ SnIcon size` 的调用点都会重现横向压扁。根治需要给 `SnIcon` 增加「包装盒跟随图形尺寸」的模式（或让 `size` 同时驱动包装盒），会改变全库图标占位，需要 Human Gate（§90 Public API / §74）。

排查方式：`getBoundingClientRect()` 看 svg 的 `width ≠ height` 即为压扁现场。
