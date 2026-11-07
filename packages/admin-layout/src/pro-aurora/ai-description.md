# SnProLayoutAurora — `aurora` 布局风格（`@snui/admin-layout`）

> **机器可读契约（`aurora` 风格）** · 版本 0.1.0 · `@experimental` · ADR-0006 / ADR-0008 / ADR-0009
>
> 独立入口：`import { SnProLayoutAurora } from '@snui/admin-layout/layouts/aurora'` +
> `import '@snui/admin-layout/layouts/aurora/style.css'`。
> 兄弟风格：`standard`（`src/pro-layout/ai-description.md`）/ `classic`（`src/pro-classic/ai-description.md`）。

## 定位与硬边界（必读）

只处理布局问题，不处理功能业务（ADR-0006）。

| 属于本组件（布局域）                                   | 不属于本组件（宿主业务域）                       |
| ------------------------------------------------------ | ------------------------------------------------ |
| 通屏背景预设的排布（纯色 / 背景图 / 光晕 / 弥散）      | 真实换肤（`.dark` 类、token 覆盖、CSS 变量写入） |
| 顶部条：品牌 / 二级模块 / 工具区的位置与几何           | i18n 词典与文案翻译                              |
| 悬浮一级图标栏 + 底部退出 / 帮助按钮                   | 登出、跳帮助中心、权限校验                       |
| 亮暗 / 中英开关的受控或非受控状态                      | 偏好持久化（localStorage / 接口）                |
| 菜单渲染、二级模块随一级联动、选中高亮                 | 路由注册、导航（`router.push`）                  |
| 9 个 emit + 14 个插槽                                  | 消息数据获取、已读状态持久化、用户信息请求       |

## 结构几何

```text
[shell] 通屏背景层（inset 0，铺满布局自身：页面底 + 光晕/弥散/背景图）
[app]   透明内容层（z-index 1），只有两块浮层上色 —— 顶栏透明，背景从它后面透出来
[header]  品牌(#logo) · 胶囊导航(#modules, SnMenu horizontal = 一级菜单) · tools：
          theme(#theme-toggle, 圆形；选中=深色药丸) · locale(#locale) · notice(#notice, 圆形+红点)
          · user(#user, 圆形头像) · #header-actions
[body]
  rail(64px, 半透明白圆角浮层 + backdrop-blur)   main（白色圆角玻璃面板）
   ├ rail-menu(#rail-menu, SnMenu vertical collapsed, 选中=深色方块)      ├ title band
   └ rail-foot: logout(#logout) · help(#help)                            │  ├ text: #title / #subtitle
                                                                         │  └ controls: #search · #filter · #actions
                                                                         ├ content(默认插槽)
                                                                         └ footer(#footer)
```

- 顶部胶囊导航与左侧图标栏同源：都由 `stripMenuChildren(menus)` 得到，共用 `activeTopKey`
  （`findTopAncestorKey(menus, activeKey)`）高亮；二级菜单通过图标栏的 hover flyout 展开。
- `#search` / `#filter` / `#actions` 位于**标题带右侧**（截图里的搜索 / 筛选 / Create a Report /
  Add Wallet），因此标题带只有在 `pageTitle` / `pageSubtitle` 或这些插槽存在时才渲染。
- `#header-actions` 在顶部条最右，与标题带动作区分。
- 背景层是独立 `aria-hidden` 绘制层（`z-index: 0`，`inset: 0`），内容层 `z-index: 1` 且**不上色**：
  背景属于布局自身（顶栏后面 / 面板圆角外 / 浮层缝隙里都看得见），不是把布局放到一张页面上的外圈底色。

## 背景预设（`background`）

| 值         | 需要的配置            | 产出的 CSS 变量                                   |
| ---------- | --------------------- | ------------------------------------------------- |
| `solid`    | —                     | （无，直接用页面底色 token）                      |
| `image`    | `backgroundImage`     | `--sn-pro-aurora-bg-image`                        |
| `gradient` | `backgroundColors?`   | `--sn-pro-aurora-glow-1`…`-2`（默认 token 主色对） |
| `mesh`     | `backgroundColors?`   | `--sn-pro-aurora-glow-1`…`-4`（默认 token 主色对循环） |

规则：

- 纯函数 `auroraBackgroundVars({ type, image, colors })` 是唯一事实源（可单测、可在宿主侧直接调用）；
- `cssUrl()` 会百分号编码 `"` `'` `(` `)` `\` 与空白（`encodeURIComponent` 不编码前三者之一组，
  故不用它）；空 URL 返回 `undefined` → 不产出变量（样式回退到品面）；
- `auroraGlowColors()` 丢弃空白项并用默认色补足到预设所需数量，因此 `mesh` 永远有 4 个色斑；
- 强度与模糊是**样式侧**变量，宿主可覆写：`--sn-pro-aurora-glow-opacity`（默认 0.5）、
  `--sn-pro-aurora-mesh-opacity`（0.7）、`--sn-pro-aurora-glow-blur`（56px）。

## AI Patch Boundary

| 字段 / 插槽                                                   | patchable | 说明                                    |
| ------------------------------------------------------------- | --------- | --------------------------------------- |
| `menus` / `activeKey`                                         | ✅        | 数据来源与选中项由宿主决定              |
| `background` / `backgroundImage` / `backgroundColors`         | ✅        | 背景预设与调色板                        |
| `railWidth` / `headerHeight` / `fixed`                        | ✅        | 几何                                    |
| `logo` / `title` / `mark` / `#logo`                           | ✅        | 品牌三件套                              |
| `pageTitle` / `pageSubtitle` / `#title` / `#subtitle`         | ✅        | 标题带（大标题 + 副标题）                |
| `showThemeToggle` / `mode` / `themeToggleLabel`               | ✅        | 亮暗开关（`v-model:mode`）              |
| `showSearch` / `searchPlaceholder` / `searchLabel` / `#search` | ✅       | 标题带搜索区（默认 SnProSearch）        |
| `showFilter` / `filterLabel` / `#filter`                      | ✅        | 标题带筛选按钮（emit `filter`）          |
| `showLocale` / `locale` / `localeLabel` / `localeLabels`      | ✅        | 中英开关（`v-model:locale`）            |
| `showNotice` / `noticeCount` / `noticeMax` / `noticeItems`    | ✅        | 通知区                                  |
| `showUser` / `user` / `userMenus`                             | ✅        | 个人信息区                              |
| `showLogout` / `logoutLabel` / `showHelp` / `helpLabel`       | ✅        | 一级栏底部按钮                          |
| `#modules` / `#actions` / `#header-actions` / `#rail-menu` / `#logout` / `#help` / `#footer` | ✅ | 区域整替（自定义按钮） |
| 菜单点击后的导航                                              | ❌        | emit `select`，宿主 `router.push`       |
| 搜索命中后的导航                                              | ❌        | emit `search-select`                    |
| 通知打开 / 标记已读                                           | ❌        | emit `notice-select` / `notice-read-all` |
| 个人信息菜单语义（登出 / 个人中心）                           | ❌        | emit `user-select`                      |
| 登出 / 帮助的真实行为                                         | ❌        | emit `logout` / `help`                  |
| 筛选面板的真实行为                                            | ❌        | emit `filter`，弹窗/抽屉由宿主实现      |
| 真实换肤（写 `.dark`、改 token）                              | ❌        | 只 emit `update:mode`，CSS 写入在宿主   |
| 语言切换后的文案翻译                                          | ❌        | 只 emit `update:locale`                 |
| 登录态 / 权限过滤                                             | ❌        | 宿主在传入 `menus` 前过滤               |

## 样式契约

- 颜色以 `--sn-web-*` token 为基础，壳级调色板（页面底 / 应用卡片 / 浮动面板 / 选中墨色）另由
  `--sn-pro-aurora-page|app|panel|ink|ink-contrast|muted` 提供，宿主可整体改主题；
- 壳级 hook：`--sn-pro-aurora-rail-width` / `-header-height` / `-gap` / `-inset` / `-radius-app` /
  `-radius-pill` / `-page` / `-app` / `-surface` / `-panel` / `-ink` / `-muted` /
  `-header` / `-border` / `-glow-opacity` / `-mesh-opacity` / `-glow-blur`；
- 悬浮图标栏与内容面板是**半透明玻璃**面（`-panel` = rgba 白 + `backdrop-filter: blur(-panel-blur)`，
  内容面板 = `color-mix(in srgb, -app 94%, transparent)`），通屏背景从面板后透出；
- 页面底 `-page` 是不透明兜底色（`solid` 预设就是它），再叠加 `-glow-opacity` / `-mesh-opacity` 的绘制层；
- 样式文件：`@snui/admin-layout/layouts/aurora/style.css`（自包含：aurora 壳 + 它用到的共享件规则，
  不含 `standard` / `classic` 专属规则）。

## 测试

`SnProLayoutAurora.test.ts`（40）：结构、几何变量、一级栏拉平与祖先高亮、二级模块联动与事件转发、
四种背景预设与调色板、亮暗受控/非受控、中英受控/非受控与字形、搜索/通知/个人信息事件、
退出/帮助 emit、14 个插槽整替、标题带与页脚。
`sn-pro-aurora-background.test.ts`（14）：四种预设的变量产出、URL 转义、调色板补足、纯函数确定性。
