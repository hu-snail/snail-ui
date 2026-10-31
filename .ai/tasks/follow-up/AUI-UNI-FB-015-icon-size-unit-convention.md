# AUI-UNI-FB-015 — mp 组件内 SnIcon 数字尺寸存在 px/rpx 双重约定（部分组件待统一）

- 状态：OPEN（button / cell 已修，其余组件待统一）
- 组件：`packages/uni/src/components/*`（约 29 个组件、~55 处）
- 类型：实现根因留档（AGENTS.md §103 / §2 Follow-up）

## 现象

sn-button / sn-cell 的内置图标相对文字明显偏大（约 2 倍），圆形小按钮里图标几乎顶满按钮。

## 根因

包内存在两套「裸数字 size」约定：

- `sn-loading`：裸数字按 **rpx**（`${size}rpx`，750 设计稿）；
- `sn-icon`：裸数字按 **px**（`width: ${size}px`，与 web 端 SnIcon 一致）。

mp 组件层的图标数值全部按设计稿写（与 `--sn-mp-icon-size-*` rpx token 同值：
24/28/32/40…，§112.3a 的 backtop「28/32/40rpx 图标」亦为 rpx 语义），经 sn-icon
渲染后被当成 px，视觉上放大 2 倍。`sn-button` 的 spinner 路径拼了 `rpx`、图标
路径没拼，同一组件内两条路径已经互相矛盾。

## 本次已修（scope 内）

- `sn-button`：`toRpxSize()` 归一——`iconSize` 裸数字与 auto-fit 档位
  （small 28 / medium 32 / large 40）统一转 `rpx` 字符串再传 sn-icon；
  spinner 复用同一归一（模板不再二次拼 `rpx`）。
- `sn-cell`：默认图标尺寸由裸 `32`（=32px，2 倍大）改为
  `var(--sn-mp-icon-size-medium)`（=32rpx）；裸数字 `iconSize` 转 rpx；
  `isLink` 箭头 32 → `32rpx`；`<image>` 图标盒同步。

## 待统一（不在本次 scope，AGENTS.md §2）

以下组件仍有裸数字 `:size` 传给 SnIcon（px 语义渲染，约 2 倍于设计稿值），
逐个按「裸数字 = rpx 设计值」归一并补断言：

sn-keyboard / sn-checkbox / sn-cascader / sn-switch / sn-action-sheet /
sn-upload / sn-textarea / sn-table / sn-select-picker / sn-search / sn-radio /
sn-paging / sn-notify / sn-notice-bar / sn-input / sn-input-number /
sn-dialog / sn-captcha / sn-video-preview / sn-tooltip / sn-sort-button /
sn-sidebar-item / sn-qr-code / sn-popup / sn-navbar / sn-loadmore /
sn-img-cropper / sn-image-preview / sn-curtain / sn-avatar。

注意其中 16/18/20 等小尺寸原按 px 调过视觉，归一时需 ×2 转 rpx（375 视口下
视觉不变，其它宽度恢复随设备缩放）。

## 备选方案（未采纳）

直接翻转 `sn-icon` 裸数字语义为 rpx（对齐 sn-loading）：一处修复全局生效，
但属 Public API 行为变更（sn-icon 文档/测试/web 端均为 px），且 apps 内
icon-mp-* demo、docs demo、uni-templates 约 35 处按 px 调用的调用点需同步重调，
回归面过大。若未来做 uni 端图标单位大统一，建议在 Human Gate 下整体切换。
