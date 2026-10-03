# snail-aui Master Plan v5.1

**版本**：v5.1  
**状态**：Active（supersedes Master Plan v5.0）  
**架构**：Component First / Token First / Style Pack First / AI Native / **End-aware（端独立）**  
**日期**：2026-10-03

---

## 1. 战略定位

snail-aui v3.1 是 **AI-Native UI 框架生态**，按端独立：

```text
Web 端（PC 桌面）  →  @snui/vue-web     +  @snui/tokens-web
移动端（触屏）     →  @snui/uni         +  @snui/tokens-mp
React 端（未来）   →  @snui/react-web   +  @snui/tokens-react

跨端共用（每个端独立 install）：
  @snui/tokens         原始 --aui-* 底层
  @snui/style-packs    风格包描述
  @snui/ai              Skill + MCP + ai-meta
  @snui/cli            resolver + llms.txt + token-check + pack-validate
  @snui/docs            文档站
```

每端独立打包，互不跨端复用源代码。

---

## 2. 端独立性原则

| 维度 | 端间关系 |
|---|---|
| 源代码 | **0 行复用**。每端独立写。 |
| 构建产物 | 每端独立 dist/。独立 npm 包。 |
| TypeScript 类型 | 每端独立 .d.ts。 |
| Token 命名空间 | 每端独立别名层（`--sn-web-*` / `--sn-mp-*` / `--sn-react-*`）。 |
| API 风格 | 每端参考对应生态最佳实践，不要求跨端同形。 |
| 组件清单 | 端专属 + 少量共享（Button / ConfigProvider / Icon）。 |
| 单元测试 | 每端独立。 |
| 风格包 / Skill / 文档 | 跨端共用，按 `end` 字段过滤。 |

---

## 3. 里程碑（v5.1）

| 里程碑 | 时间 | 交付 |
|---|---|---|
| M0 | 2026-10 | ADR-0001 + Button demo ✅ |
| M0.5 | 2026-10 | ADR-0002 + PRD v3.0 ✅ |
| **M0.6** | 2026-10 | **PRD v3.1 + 双端独立拆分 + 双 Token 别名层 + WBS v3.1 + Master Plan v5.1** ✅ |
| M1 | 2026-11 | `@snui/tokens-web` + `@snui/tokens-mp` 新包 + 端独立组件 M1（Web ~50 / uni ~50 个，按各自场景） |
| M2 | 2026-12 | Style Pack 默认 3 Pack（`end: 'both'`）+ 移动端 2 Pack（`end: 'mp'`）+ AI Layer + StyleSwitcher / ThemeCopier |
| M3 | 2027 Q1 | doodle / sticky-note + wechat Pack + render_preview 实装 |
| M4 | 2027 Q2 | 新增 React 端（按 v3.1 模式）+ VSCode 插件 + 视觉回归 |

---

## 4. M1 双端组件交付

### Web 端（PC 桌面，~50 个组件）

按 v3.1 WBS 路线图（详见 WBS v3.1 §M1-WEB）：

- 基础 10 个（Button / Icon / Text / Layout / ConfigProvider / Divider / Dropdown / Tooltip / Splitter / Layout Header Sider）
- 表单 16 个（Form / FormItem / Input / Textarea / InputNumber / Select / Cascader / TreeSelect / DatePicker / TimePicker / DateRangePicker / ColorPicker / AutoComplete / Slider / Switch / Checkbox / Radio）
- 数据 10 个（Table / VirtualList / Tree / DataPicker / FilterPanel / Transfer / Descriptions / Pagination / Empty / Statistic）
- 反馈 8 个（Dialog / Toast / Drawer / Notify / Popover / Loading / Skeleton / Alert）
- 导航 8 个（Menu / Tabs / Breadcrumb / Steps / Segmented / Affix / Anchor / BackTop）
- 布局 5 个（Card / Grid / Space / Layout / Collapse）

### uni 端（移动触屏，~50 个组件）

按 v3.1 WBS 路线图（详见 WBS v3.1 §M1-MP）：

- 基础 8 个
- 表单 10 个
- 反馈 8 个
- 导航 10 个
- 列表与滚动 12 个（PullRefresh / Swiper / sticky-tabs / lazy-image / waterfall / infinite-list / swipe-action / sticky 等移动端专属）
- 业务 5 个（Card / Countdown / Progress / Circle / Rate 等）

---

## 5. M2 Style Pack + AI Layer（跨端共用）

### Style Packs

| Pack | end | 阶段 |
|---|---|---|
| default | both | M2 |
| dark | both | M2 |
| ios | both | M2 |
| mp-taobao | mp | M2 |
| mp-douyin | mp | M2 |

### AI Layer

- Skill 文件（带 end 分类）
- MCP Server 4 工具按 end 过滤
- ai-meta.json components 按 end 分组

### 文档站

- 端选择器：Web 组件 / uni-app 组件 两个分组
- StyleSwitcher 按 end 过滤 Pack
- ThemeCopier 按 end 生成 snippet

---

## 6. 未来扩展（React 端 / 其他端）

按 v3.1 模式完全独立地新增：

```
@snui/tokens-react  →  --sn-react-* 别名层
@snui/react-web    →  React 组件实现（0 行复用）
```

每端是**自包含**的，不破坏现有端。

---

## 7. 治理

- **架构变更**：必须先写 ADR → Human Gate
- **端独立性破坏**：CI 门禁 + Code Review（不允许跨端源代码复用）
- **Token 别名前缀错误**：CI 门禁 + token-check 按端校验
- **Public API**：每端独立管理版本（changesets）
- **CI 门禁**：typecheck + lint（0 warning）+ test（100% pass）+ build（0 error），按端独立执行

---

## 8. 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-08 | 初始 |
| v4.0 | 2026-10-03 | 改为组件库（ADR-0001） |
| v5.0 | 2026-10-03 | Style Pack + AI Layer（ADR-0002） |
| **v5.1** | 2026-10-03 | **双端独立 + 双 Token 别名 + 端独立性原则（Active）** |