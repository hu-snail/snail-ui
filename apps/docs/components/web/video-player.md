# 视频播放器 VideoPlayer · Web（PC 端）

完整视频播放器：弹幕、画中画、小窗播放、分辨率切换、下载、倍速 / 循环、直播模式，全部内置且走 `--sn-web-*` token 主题化。流媒体格式（HLS / DASH / FLV）通过 `sourceBridge` 插件边界接入第三方库（如 hls.js）——**组件库本身零流媒体依赖**。

> 本组件为 AUI 追加能力：naive-ui 与常见 Web 组件库均无视频播放器（已核对 naive-ui `src/components.ts`），不适用 §112 一比一对照。功能形态对标主流视频播放器（B 站 / 西瓜播放器），API 命名遵循本仓库约定（受控/非受控对、`update:*` 事件、`--sn-web-*` token）。视频**缩略图 + 灯箱**场景请用 [VideoPreview 视频预览](/components/web/video-preview)。

## 何时使用

- 需要完整播放能力的视频页：课程、宣传片、赛事直播、社区视频流
- 需要弹幕互动（发送 + 展示）的视频场景
- 页面滚动后希望视频「缩到小窗」继续播放（B 站式小窗）
- 同一内容多档清晰度（渐进式 MP4/WebM 阶梯或流媒体多码率）
- 需要 HLS / DASH / FLV 直播或点播——由宿主安装流媒体库并经 `sourceBridge` 注入

## 代码演示

### 基础用法

<Demo name="video-player-web-basic" description="src + poster 即用：中央播放按钮、完整控制条、进度悬停预览、音量滑杆、键盘快捷键（Space 播放暂停、←→ 快进退 5s、↑↓ 音量、M 静音、F 全屏）。" />

### 弹幕

<Demo name="video-player-web-danmaku" description="danmus 传入时间轴弹幕，控制条内输入框实时发送（self 弹幕高亮、seek 回退不重放）；弹幕开关、透明度 / 速度 / 字号 / 屏幕占比均为 prop，画布单引擎渲染。" />

### 分辨率切换（渐进式阶梯）

<Demo name="video-player-web-quality" description="qualities 传入 1080P / 720P / 360P 阶梯，设置面板切换时自动保留播放进度。" />

### 画中画

<Demo name="video-player-web-pip" description="浏览器原生画中画：按钮仅在 document.pictureInPictureEnabled 的环境渲染，快捷键 P 同效。" />

### 小窗播放（滚动自动停靠）

<Demo name="video-player-web-mini" description="mini-on-scroll-out 开启后，页面滚动使播放器离开视口时自动缩为右下角小窗（可拖拽、可关闭），滚回视野自动还原；也可由控制条按钮或 v-model:mini 手动控制。" />

### 下载

<Demo name="video-player-web-download" description="download 按钮默认用 <a download> 触发（同源直接下载、跨源新开标签）；传入 on-download 可接管为鉴权取流 / blob 下载。" />

### 直播模式 + HLS 桥接（hls.js，公开直播源）

<Demo name="video-player-web-hls-live" description="sourceBridge 注入 hls.js 桥接公开 HLS 直播测试流（Akamai moctobpltc）：自动 LIVE 徽标、隐藏进度条、弹幕照常。hls.js 由本 demo 页按需从 CDN 动态引入——组件库源码零依赖，实际项目请 npm install hls.js。" />

### 多码率点播（清晰度来自流）

<Demo name="video-player-web-hls-vod" description="hls.js 解析 Mux 公开多码率测试流后经 setQualities 上报清晰度列表，设置面板直接切换 level——与渐进式阶梯共用同一套清晰度菜单。" />

## 安装第三方流媒体库（引导）

组件库**不包含**任何流媒体实现。以 hls.js 为例，在你的应用中安装：

```bash
npm install hls.js
```

然后用 `sourceBridge` 把它接入播放器（完整说明见组件源码头注释）：

```ts
import Hls from 'hls.js';
import type { SnVideoSourceBridge } from '@snui/vue-web';

export const hlsBridge: SnVideoSourceBridge = (ctx) => {
  // Safari 原生支持 HLS 时直接放行（返回 falsy → 播放器走原生 src）
  if (ctx.video.canPlayType('application/vnd.apple.mpegurl')) return;
  if (!Hls.isSupported()) return;
  const hls = new Hls();
  hls.loadSource(ctx.source.src);
  hls.attachMedia(ctx.video);
  hls.on(Hls.Events.MANIFEST_PARSED, (_e, data) => {
    ctx.setQualities(data.levels.map((level, id) => ({ id, label: `${level.height}P` })));
  });
  return {
    destroy: () => hls.destroy(),
    selectQuality: (id) => {
      hls.currentLevel = id as number;
    },
  };
};
```

```vue
<SnVideoPlayer :src="liveUrl" :source-bridge="hlsBridge" live />
```

返回 falsy（或对不支持的环境）时播放器回退原生播放（如 Safari 内建 HLS）。`setQualities` / `setIsLive` / `reportError` 由桥接随时回报，播放器据此更新清晰度菜单、直播徽标与错误面板。

## API

### Props

| 名称               | 类型                                            | 默认值       | 说明                                                                   |
| ------------------ | ----------------------------------------------- | ------------ | ---------------------------------------------------------------------- |
| src                | `string`                                        | `undefined`  | 视频地址（简单模式）；桥接管流时忽略                                   |
| poster             | `string`                                        | `undefined`  | 首帧前封面                                                             |
| title              | `string`                                        | `undefined`  | 无障碍名称，同时用作小窗标题                                           |
| qualities          | `SnVideoQuality[]`                              | `[]`         | 渐进式清晰度阶梯 `{ label, value, src, type? }`                        |
| default-quality    | `string \| number`                              | 首档         | 初始清晰度（`qualities[].value`）                                      |
| autoplay           | `boolean`                                       | `false`      | 自动播放（浏览器要求静音，见「兼容性说明」）                           |
| muted              | `boolean`                                       | `false`      | 静音起播                                                               |
| loop               | `boolean`                                       | `false`      | 循环播放                                                               |
| preload            | `'none' \| 'metadata' \| 'auto'`                | `'metadata'` | 预加载策略                                                             |
| volume             | `number`                                        | `1`          | 初始音量 0–1                                                           |
| rate               | `number`                                        | `1`          | 初始倍速                                                               |
| live               | `boolean`                                       | 自动嗅探     | 强制直播模式；缺省按 `duration === Infinity` 或桥接回报判定            |
| shortcuts          | `boolean`                                       | `true`       | 键盘快捷键（Space/K、←→、↑↓、M、F、P、D）                              |
| danmus             | `SnVideoDanmu[]`                                | `[]`         | 弹幕时间轴 `{ text, time, color?, type?, self? }`                      |
| danmu-visible      | `boolean`                                       | `true`       | 弹幕层显示                                                             |
| danmu-send         | `boolean`                                       | `true`       | 显示弹幕输入框（直播模式自动隐藏）                                     |
| danmu-opacity      | `number`                                        | `1`          | 弹幕层透明度 0–1                                                       |
| danmu-speed        | `number`                                        | `1`          | 弹幕速度倍率                                                           |
| danmu-font-size    | `number`                                        | `16`         | 弹幕基准字号 px（随播放器宽度缩放）                                    |
| danmu-area         | `number`                                        | `0.75`       | 弹幕可用高度占比 0–1                                                   |
| mini               | `boolean`                                       | 非受控       | 小窗播放（受控），配合 `@update:mini` / `v-model:mini`                 |
| mini-on-scroll-out | `boolean`                                       | `false`      | 播放中滚出视口时自动停靠小窗                                           |
| mini-width         | `number`                                        | `320`        | 小窗宽度 px                                                            |
| pip                | `boolean`                                       | `true`       | 画中画入口（环境不支持时不渲染按钮）                                   |
| download           | `boolean`                                       | `true`       | 下载按钮（直播 / 桥接管流且未提供 `on-download` 时隐藏）               |
| settings           | `boolean`                                       | `true`       | 设置菜单（清晰度 / 倍速 / 循环）                                       |
| source-bridge      | `SnVideoSourceBridge`                           | `undefined`  | 第三方流媒体桥接函数（HLS / DASH / FLV），见上文「安装第三方流媒体库」 |
| width              | `string \| number`                              | `undefined`  | 播放器宽度（数字按 px）                                                |
| aspect-ratio       | `string`                                        | `'16 / 9'`   | 宽高比                                                                 |
| on-download        | `(source) => void \| string \| Promise<string>` | `undefined`  | 自定义下载：返回 URL 则打开该地址                                      |

### Events

| 名称                      | 参数                  | 说明                            |
| ------------------------- | --------------------- | ------------------------------- |
| play / pause              | —                     | 播放 / 暂停                     |
| ended                     | —                     | 播放结束                        |
| timeupdate                | `currentTime: number` | 播放时间更新                    |
| seeked                    | `currentTime: number` | seek 完成（弹幕指针已重锚定）   |
| waiting / canplay         | —                     | 缓冲状态                        |
| error                     | `unknown`             | 媒体或桥接失败（错误面板出现）  |
| ready                     | —                     | 元数据加载完成                  |
| rate-change               | `rate: number`        | 倍速变化                        |
| volume-change             | `{ volume, muted }`   | 音量 / 静音变化                 |
| fullscreen-change         | `active: boolean`     | 元素全屏切换                    |
| pip-change                | `active: boolean`     | 画中画切换                      |
| update:mini / mini-change | `active: boolean`     | 小窗切换（`v-model:mini` 模式） |
| quality-change            | `{ id, label? }`      | 清晰度切换（阶梯或桥接 level）  |
| danmu-send                | `SnVideoDanmu`        | 从输入框发送了一条弹幕          |
| download                  | `SnBridgeSource`      | 触发下载                        |

### Slots

| 名称  | 参数 | 说明             |
| ----- | ---- | ---------------- |
| error | —    | 替换内置错误面板 |

### Methods（通过模板 ref 调用）

| 名称                              | 类型                                   | 说明                       |
| --------------------------------- | -------------------------------------- | -------------------------- |
| play / pause / toggle             | `() => void \| Promise<void>`          | 播放控制                   |
| seek                              | `(t: number) => void`                  | 跳转（直播钳制到当前时刻） |
| setVolume / setMuted / toggleMute | `(v) => void`                          | 音量控制                   |
| setRate                           | `(r: number) => void`                  | 倍速                       |
| toggleFullscreen                  | `() => void`                           | 元素全屏                   |
| toggleWebFullscreen               | `() => void`                           | 页面全屏（B 站式网页全屏） |
| togglePip                         | `() => Promise<void>`                  | 画中画                     |
| toggleMini                        | `() => void`                           | 小窗                       |
| toggleDanmu                       | `() => void`                           | 弹幕开关                   |
| sendDanmu                         | `(text, opts?) => void`                | 以当前时刻发送弹幕         |
| retry                             | `() => void`                           | 错误后重试                 |
| videoEl / rootEl                  | `Ref<HTMLVideoElement \| HTMLElement>` | 底层元素（高级用法）       |

## 主题 Tokens

组件作用域 `--sn-web-video-player-*` 变量，全部带 `--sn-web-*` 通用 token 兜底，可在任意祖先覆盖：

| Token                                                        | 说明            | 兜底                 |
| ------------------------------------------------------------ | --------------- | -------------------- |
| `--sn-web-video-player-bg`                                   | 播放器背景      | `#000000`            |
| `--sn-web-video-player-controls-bg`                          | 控制条背景      | `#000000a6`          |
| `--sn-web-video-player-scrim`                                | 遮罩 / 浮层底   | `#00000073`          |
| `--sn-web-video-player-color`                                | 前景色          | `#ffffff`            |
| `--sn-web-video-player-button-hover`                         | 按钮悬停底      | `#ffffff29`          |
| `--sn-web-video-player-track` / `-buffered` / `-hover-track` | 进度轨道        | 白色阶梯透明         |
| `--sn-web-video-player-big-play-size`                        | 中央播放键尺寸  | `64px`               |
| `--sn-web-video-player-mini-width` / `-mini-z`               | 小窗宽度 / 层级 | `320px` / `1050`     |
| `--sn-web-video-player-radius`                               | 圆角            | `--sn-web-radius-lg` |

## 无障碍行为

- 所有控制按钮为真实 `<button>`，带本地化 `aria-label`（`VideoPlayer` 文案命名空间）；开关型按钮带 `aria-pressed` / `aria-checked`。
- 进度条 `role="slider"` + `aria-valuemin/max/now/text`，可聚焦，←/→ 键 ±5s。
- 设置面板 `role="menu"` + `menuitemradio` + `aria-checked`，循环行 `role="switch"`。
- 键盘快捷键在输入框聚焦时自动失效；Space / 方向键 `preventDefault`，不会滚动页面。
- `playsinline` 恒渲染，iOS Safari 不会劫持全屏。

## 兼容性说明

- 现代浏览器均要求**静音才可自动播放**；被策略拒绝的 `play()` 会进入错误面板而非抛错。
- 画中画 / 全屏按钮按能力检测渲染，不支持的平台不出现。
- 直播判定用规范信号 `duration === Infinity`；`NaN`（元数据未加载）不会误判为直播，桥接可用 `setIsLive(true)` 覆盖。
- 下载按钮基于 `<a download>`：同源文件直接下载，跨源地址由浏览器策略决定（通常新开标签）；鉴权 / blob 场景请提供 `on-download`。
- 弹幕画布在无 2D 上下文的环境（测试 / 非渲染 DOM）自动退化为纯调度，不影响排期逻辑。
