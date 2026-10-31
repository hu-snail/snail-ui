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

## 教训（跨组件适用）

「名称 prop 声称走注册表解析」的组件必须有「渲染出 SVG」的行为测试——
空插槽兜底 + 空 view 是这类静默失效的高发形态（web/uni 双端 parity diff
可以在 review 时直接暴露它）。图标一律传 token 字符串而非裸数字，是 FB-015
结论在 input 类组件上的落地。
