# AUI-UNI-FB-016 — sn-input 名称图标从未实例化 + 域内图标尺寸/颜色无契约

- 状态：DONE（本任务全量修复）
- 组件：`packages/uni/src/components/sn-input/sn-input.vue`
- 类型：实现根因留档（AGENTS.md §103）
- 关联：AUI-UNI-FB-015（裸数字 px/rpx 双重约定）的 input 分支，本任务后
  sn-input 不再出现在 FB-015 的「待统一」名单里

## 现象

uni-demo 输入框页：`prefix-icon="Search"` 的输入框只显示空白（图标不渲染）；
清空 × / 密码眼睛相对按钮盒明显偏大溢出；css-icon 演示是一个失控的大蓝点。

## 根因

1. **名称图标空渲染**：sn-input 模板的 prefix/suffix 名称分支只渲染
   `<view class="sn-input__icon-glyph"><slot name="prefix-icon" /></view>` ——
   默认插槽永远为空，`prefixIcon` 名称从未解析成 SnIcon。web 端 SnInput 同
   位置是 `<SnIcon :name="prefixIcon" />`，属 uni 端 parity 缺口。
2. **图标尺寸双重约定**（FB-015 同根因）：clear / password 图标写
   `:size="20"`（sn-icon 裸数字 = px = 40rpx 设计稿），套在 32rpx 圆形按钮盒
   里必然溢出；前/后图标盒则是硬编码 32rpx，三处互不一致且无 token。

## 修复

1. 名称分支渲染 `<SnIcon :icon="prefixIcon || iconPrefix"
   :size="ICON_SIZE_VAR" />`（string icon API：registry → 内置目录 →
   Provider），css-icon 模式与 `prefix-icon` / `suffix-icon` 插槽语义不变。
2. 引入域内图标契约 token（定义在 `.sn-input` 根，引用 mp token，暗色 /
   风格包自动跟随）：
   - `--sn-input-icon-size: var(--sn-mp-icon-size-medium)`
   - `--sn-input-icon-color: var(--sn-mp-color-text-tertiary)`
   前/后字形盒、清空按钮、密码按钮全部改为 token 尺寸/颜色，去掉圆形底色
   （对齐 wd-input 的平图标形态）；doodle 皮肤按钮盒放大到 48rpx 吸收描边。
3. Regression：`renders a named prefixIcon/suffixIcon through SnIcon`、
   token 不变量测试（读源码断言三处选择器都消费 token）。

## 修复后仍在 dev 环境复现的两个追加根因（2026-10-31 补）

组件修复合入后，uni-demo dev 预览里 string 图标依旧空白、radius / 边框背景 /
控件状态三个 demo 整块不渲染。排查（读 dev 转换产物 + 构建产物）发现两个独立根因：

1. **Vite 依赖预构建把注册表劈成两个实例（dev 专属）**
   demo 源里的 `import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry'`
   是 node_modules 内的纯 JS 模块，被 esbuild optimizer 收进
   `.vite/deps/@snui_uni-src_..._sn-icon-registry.js`（独立模块实例）；而
   `sn-input.vue`（.vue 不可预构建）内部相对导入走源码版 registry。结果：
   demo 的 `registerSnIcons` 写进预构建副本，组件的
   `resolveSnIconStringSync` 从源码副本读 —— 必然 miss，图标渲染成空盒。
   web 端对象形态图标（DemoPageShell 工具栏）不经注册表，所以只有 string
   形态坏。
   **修复**：`apps/uni-demo/vite.config.ts` 增加
   `optimizeDeps.exclude: ['@snui/uni-src', '@snui/templates-src']`，
   demo 导入与组件内部导入回落到同一条源码 URL（dev 转换产物已验证同一
   `?v=` 时间戳）。

2. **模板里使用组件但 `<script setup>` 未显式 import（build/dev 双杀）**
   radius / bordered-bg-radius / states 三个 demo 的 script 只有注释，
   uni 编译器对模板里的 `SnInput` 生成运行时 `resolveComponent("SnInput")`；
   构建产物无全局注册（easycom 不认 PascalCase）→ 解析失败 → 整个组件
   渲染为未知元素，section 空白。
   **修复**：三个 demo（zh/en 共 6 文件）补 `import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'`。
   **纪律**：uni-demo demo 模板里用到的任何组件必须在 `<script setup>`
   显式 import —— 已全量扫描，仅这三个命中。

## 教训（跨组件适用）

「名称 prop 声称走注册表解析」的组件必须有「渲染出 SVG」的行为测试——
空插槽兜底 + 空 view 是这类静默失效的高发形态（web/uni 双端 parity diff
可以在 review 时直接暴露它）。图标一律传 token 字符串而非裸数字，是 FB-015
结论在 input 类组件上的落地。
