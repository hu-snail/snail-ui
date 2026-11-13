# uni-app x App 端渲染适配批量修复（badge / fab fan / 弹出层 / circle / swipe-action / avatar 状态点）

> 来源：真机验收反馈（HBuilderX 5.33 alpha，vapor 模式）。四个并行子任务（A overflow / B 弹出层 / C circle / D swipe-action）+ sn-icon computedStyle 双形态修复。

## 根因清单（官方文档依据）

1. **App 端 `overflow` 默认 `hidden`**（W3C 默认 `visible`；官方 css/overflow 文档）。所有依赖「子元素溢出容器渲染」的组件必须显式 `overflow: visible`（仅 view 支持）：
   - sn-fab：fan 动作项定位在 `.sn-fab` root（96rpx）与 `.sn-fab__menu--fan`（0×0 锚点）之外 → 扇形整体被裁（症状：状态翻转但动作项永不出现）。
   - sn-badge：marker `translateY(-50%) translateX(50%)` 骑在包裹内容右上角，超出部分被裁（症状：只剩小方块、文字不可见）。
   - sn-tabbar：凸起圆钮 `-52rpx` 上浮出栏顶，bar→item→inner→icon 每层 view 都默认裁剪，溢出路径须逐层放开。
2. **App 端样式不级联**（仅 color/font-size 原生继承；`inherit` 关键字、`white-space` 不可靠）：sn-badge `.sn-badge__text` 的 `inherit` 三连改为显式 token 值。
3. **App 端 `position: absolute` 锚定直接父元素内容区**（无 web 的「最近定位祖先」查找；官方 css/position 文档）：弹出层 demo 的 `.sn-x.sn-demo-contained { position: absolute }` 钉住规则（复合选择器在 App 端遵循 web 规范生效 + 组件根样式传递不受样式隔离影响）把全屏 fixed 层钉进 demo 卡片小盒，再被圆角 + overflow hidden 裁剪（症状：所有弹出层不全屏、幕帘内联渲染）。修复：七族 demo 的钉住规则包进 `/* #ifdef H5 || WEB */`；popup/curtain/overlay/drop-menu 覆盖层根与遮罩补显式 `width/height: 100%`（四边 longhand 隐式拉伸在 App 端不可靠，官方 position 示例均带显式尺寸）。
4. **App 端 slot 内容 tap 跨不过组件编译单元**：popover/tooltip 触发区新增 `#ifdef APP` 透明 catcher 节点（组件自有节点）接收 tap，Web/MP 剥离。
5. **App 端 background-image 仅支持 linear-gradient**（conic-gradient/mask/url/data-URL 全不支持）：sn-circle 的 conic+mask 环形方案在 App 全灭（症状：饼形色块）。修复：uni-x 管线补丁把环改为 `<image>` + SVG data URL（stroke-dasharray 弧长 JS 内算好；12 点起笔 rotate(-90)；逆时针垂直轴镜像；linecap 真实生效；0% 省略圆、100% 满环）。颜色解析复用 sn-icon 的 computedStyle 回读模式，兜底 token 实值永不空白。
6. **App 端层叠边缘合成取整**：sn-swipe-action 闭合态靠内容层 z-index 遮盖动作区，App 端漏 1–2px 缝隙。修复：闭合且非拖拽/动画时动作区 inline `translateX(±100%)` 移出 root `overflow: hidden` 边界，不依赖层叠。附带修复：`contentStyle` 偏移量 `×2` 转 rpx 的 375px 视口假设改为直接 px（测量/触摸坐标本就是 px；顺带修复 docs 预览滑动位移从未生效——rpx-transform 只处理 CSS 声明不处理运行时字符串）。
7. **uni-app x `fields` 回调传 NodeInfo 对象本身**（经典 uni-app 传数组）：sn-icon 首版取色按数组读 `nodes[0]` 在 App 端永远读不到 → 全部图标空白。修复：对象/数组双形态探测 + JSON.stringify 正则兜底；ink 色首帧可见、解析成功升级级联色、失败回退 ink 永不空白。
8. **App 端圆角根节点裁剪 absolute 子元素，`overflow: visible` 也压不住**（sn-badge 贴内钉住改造的延续实测）：sn-avatar 的 `status` 状态点骑在右下角（`right: 0; bottom: 0`），App 端被圆角根裁成月牙（真机截图只剩弧内一小条）。修复（终版）：组件拆成**双层结构**——根节点是纯定位盒（尺寸 / 叠层 margin / role，不圆角不裁剪），绘制的圆形是 `__body` 子节点（背景 / 形状 / 分隔环 / 裁剪都在它身上），状态点锚在**未圆角的 wrapper 盒角**：越过圆弧但永不离开 wrapper 盒，全端统一骑边渲染，不依赖任何 overflow 行为。首版「按 0.146×(D−点径) 贴内 inset」因与 uniapp 端骑角视觉不统一被否，已回退。回归测试断言 DOM 结构（点是 body 的兄弟节点）+ 源码 CSS（绘制属性在 body、wrapper 无 background/border-radius、点锚 corner）。
9. **sn-avatar-group 裁剪窗口少算一个 overlap**：窗口宽 `visible × step` 只覆盖成员的步进和，第一（row/column 模式自拉）成员的外弧被窗口削边、最后一个可见成员的远弧也差一个 overlap——白底空头像时代不可见，渐变底色成员后显形（真机：成员被削边 / 竖向窗口过矮）。修复：窗口长度改 `(visible − 1) × step + diameter`（成员全弧跨度），窗口按补偿侧 `margin −overlap + padding +overlap` 拉过根节点的补偿 padding（`box-sizing: border-box` 防止 padding 撑宽），最后一个可见成员远弧恰好压窗口远边、其后成员的缝隙由后绘的折叠气泡盖住。`left-up`（row-reverse）模式成员不自带拉力、窗口几何另有差异，削边为预存在问题、本任务不扩 scope（follow-up）。

## 教训（Memory 要点）

- **可用性优先于精确性**：异步取色/测量类修复的兜底必须是「可见但可能颜色不准」，绝不能「解析失败 = 不渲染」（sn-icon blank-first-paint 回归，circle 设计时已规避）。
- **修复 uni-x 适配前先查官方 CSS 文档逐属性确认**（overflow 默认值、absolute 锚点、background-image 白名单都与我按 web 直觉的预期不同）；已知结论存档后，子任务按事实执行，不要重新质疑。
- **子任务文件所有权划分**防并行冲突：patches.ts 单一所有者；dist 重建/demo regen/commit 统一由主控执行。
- 子任务报告要与实际 diff 逐一核对（B 的报告漏列 popover/tooltip/css.ts 三处实际改动）——主控以 git diff 为准。

## 遗留（follow-up 候选）

- sn-toast / sn-notify / sn-popover / sn-floating-panel 的 demo 同用 `sn-demo-contained` 钉住，需同款 `#ifdef` 处理；sn-tour / sn-image-preview / sn-navbar / sn-paging / sn-watermark / sn-root-portal / sn-captcha / sn-backtop 的 fixed CSS 逐一核对。
- sn-slider 滑钮/气泡、sn-loading 的溢出渲染节点需补 `overflow: visible`（同 A 类根因）。
- sn-slide-verify.vue:379 存在与 swipe-action 相同的 `×2rpx` 单位假设。
- sn-tooltip App 端气泡几何（max-content / calc(100vw) / margin-auto 居中）未验证。
- sn-circle 渐变 color 在 App 退化为末 stop 实色；speed 过渡 App 端跳变（显式降级，已注释）。
- App 端关系选择器（`.a .b`）在 Vapor 模式不受支持（官方文档）——组件内大量后代选择器若启用 Vapor 需去依赖重构。
- fan pill 文字 `white-space: nowrap` 在 App 被丢弃，CJK 长标签可能逐字换行，需真机确认。

## Commit

- fix(uni): overflow visible + badge text 显式取值（fab/badge/tabbar）
- fix(uni): 弹出层 App 全屏（显式宽高 + demo #ifdef + App trigger catcher）
- fix(uni-x): sn-circle SVG data-URL 环形 + css.ts border longhand fallback
- fix(uni): swipe-action 闭合态显式隐藏 + px 偏移
- fix(uni-x): sn-icon computedStyle 双形态探测（前置 commit 410d2795）
