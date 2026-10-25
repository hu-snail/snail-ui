# uni-app x（蒸汽模式）支持

`@snui/uni` 是 uni-app x（App 端蒸汽模式）的唯一组件源码：一套源码同时服务
uni-app（H5 / 小程序 / App）与 uni-app x。uni-app x 消费的 `.uvue` 产物由
`@snui/uni-x` 的确定性转换管线生成（见 `ADR-0004`），不存在第二套手写组件代码。

## 何时使用

- 目标平台是 uni-app x 的 **App 端**（Android / iOS / 鸿蒙，蒸汽模式，HBuilderX 5.21+）。
- uni-app x 的 web / 小程序目标目前仍建议使用 `@snui/uni`（成熟度更高）。

## 接入步骤

### 1. 安装

```bash
pnpm add @snui/uni-x
```

组件产物（`.uvue` + 主题层）**已随包发布**（包内 `dist/components/…` 结构），
无需在本地执行生成、也无需拷贝目录。包尚未正式发版时，可在本仓库执行
`pnpm -F @snui/uni-x build && pnpm -F @snui/uni-x pack` 得到 tarball 后安装。

### 2. 配置 easycom

在 `pages.json` 中加入：

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^sn-(.*)": "@snui/uni-x/components/sn-$1/sn-$1.uvue"
    }
  }
}
```

### 3. 引入主题变量

在 `App.uvue` 的 style 中引入 class-only token 层（App 端无 `:root`，变量挂载在
`.sn-theme-root` 上，`sn-config-provider` 会自动携带该 class）：

```css
@import "@snui/uni-x/theme/index.css";
```

不使用 `sn-config-provider` 的页面，请在页面根节点加 `class="sn-theme-root"`。

### 4. 开启蒸汽模式

在 HBuilderX（5.21+，推荐 5.31+）的 `manifest.json` 可视化界面勾选「蒸汽模式」。

### 5. 暗色模式

与 uni 端一致：`<sn-config-provider theme="dark">` 包裹，或手动在根节点加
`sn-theme-dark` class。

## 当前状态

| 项 | 状态 |
| --- | --- |
| 组件生成 | 全量 82 组件（95 个 `.uvue`）+ 29 个 ts 工具文件 |
| 主题 / 暗色 | 已生成 class-only token 层 |
| Style Pack（skin） | 暂缺：`.snui-skin-doodle` 后代选择器规则在 App 端无法表达，待变量化改造 |
| sn-table | `<component :is>` 动态组件待手工适配 |
| canvas 四件套（qr-code / signature / watermark / img-cropper） | 待按 uni-app x canvas API 适配 |
| 桌面 H5 鼠标手势（picker-view） | 已用 `#ifdef H5` 隔离，App 端仅触摸 |

每条转换决定的明细（删除的规则、包的文本、重写的事件）见
`packages/uni-x/PORTING-REPORT.md`。

## 平台差异要点

uni-app x App 端 CSS 是子集，转换管线已自动处理：

- 仅 class 选择器（复合 `.a.b` 可用）；后代选择器降级为 CSS 变量上下文注入
- 不支持伪类 / 伪元素：按压反馈改走 `hover-class`（官方推荐），细线用真实元素
- 文本节点自动包裹 `<text>`；文字样式不继承
- `@tap` 统一为 `@click`；`data-*` 属性被剥离（uni-x 产物）
- `cursor` / `user-select` 等无原生等价的属性被剥离

## 真机验证清单（未验证事项）

以下行为**尚未在 HBuilderX + 真机环境编译验证**，接入时请优先确认：

- [ ] `hover-class` 按压态（sn-button / sn-cell）
- [ ] `<image>` 渲染 SVG data URL（sn-icon；不可用时改用 iconfont glyph 路径）
- [ ] `:style` 动态注入 CSS 变量（约 80 处，如 tabs 动画时长）
- [ ] `gap` / `@keyframes` 在字节码渲染管线下的表现
- [ ] `position: fixed` 与安全区变量（浮层类组件）
- [ ] `defineProps` / `withDefaults` / `defineSlots` 宏支持面（sn-form-item 消费了 `defineSlots` 返回值）

验证通过后，本节将更新为支持矩阵。
