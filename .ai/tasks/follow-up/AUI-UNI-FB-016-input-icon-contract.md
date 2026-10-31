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

## 追加：uni-h5 输入管线的行为契约（2026-10-31 第二轮，数字实时性 + 清除链路）

用户实测仍报：数字类输入"没有实时计算"、点击 × 后再输入图标不回来、
清除图标要是圆形。用真实 uni-h5 Input 组件写 vitest 复现（import
uni-h5.es.js + happy-dom）拿到三条行为契约：

1. **update:modelValue 走 100ms 节流**（useValueSync.triggerInputFn =
   throttle(100)）：快速输入时中间值全部丢弃（实测 ["1","12345"]），计数器 /
   v-model 回显最多滞后 100ms —— "没有实时计算"的主体。
   修复：sn-input 在字段祖先元素上挂 **capture 相位**原生 input 监听镜像
   （capture 先于 uni 自己的字段级监听器，其 stopPropagation 拦不住捕获），
   每次击键实时 emit；uni 的组件级 emit 用事件对象同一性去重。MP 无 DOM，
   组件事件本就不节流，镜像天然只挂 H5（typeof document 守卫）。
2. **外部 value 变更走 100ms 防抖 + lastUserInputValue 跳过守卫**：× 点击
   后 100ms 内的击键会 cancel 掉 pending 的清空同步，旧文本复活。
   修复：onClear 直接调用 uni-input 暴露的 `$triggerInput({value:""})`
   立即落值。
3. **number/digit 的中间态拦截**：digit 映射原生 number input，"12." 属
   badInput，uni 的 beforeInput 直接 return false 不发事件（小数点后回滚在
   blur）—— 平台行为，组件层只保证自己的 Number() 强转不再制造受控回写
   （canonical 转换：仅 String(Number(raw))===raw 才发 number，否则透传
   string；change/confirm 提交点全量转换）。

另两个修复：

- **focusWhenClear 从未实现**（onClear 里是 no-op 注释）：× 点击使字段失焦，
  用户续打无处落地 → 图标"不回来"。修复为 H5 命令式 refocus（$(el).focus）。
  不用模板 :focus 绑定的原因：raw 测试环境里 patchDOMProp 对 `focus` 键
  走 el[key] = value（连 undefined 都会覆盖 focus 方法）。MP 键盘由点击唤起，
  文档已注明。
- **清除图标改圆形删除 chip**：token 色圆底 + surface 色 ×（62%），暗色 /
  风格包双变量自动翻转；doodle 皮肤描边盒放大 48rpx。

教训：**uni 端组件的单测跑在裸 Vue + happy-dom 上，input 标签是原生元素，
完全绕开 uni-h5 的 Input 包装层** —— 节流/防抖/数字拦截这一整类行为只有
拿真实 uni-h5 Input 写复现才看得见。凡涉及输入事件时序的改动，先在
uni-h5.es.js 的 useValueSync/useField 契约上对一遍。
