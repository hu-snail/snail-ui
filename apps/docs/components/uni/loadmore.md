# LoadMore 加载更多（uni 端 / 移动端）

`sn-loadmore` 是 `@snui/uni`（移动端 / 小程序 / H5）的列表页脚：用 `state` 汇报「加载中 / 已加载完毕 / 加载失败（可点重试）」。**状态驱动**：组件不自己发请求、不挂滚动监听、不开定时器，分页由宿主页面负责。基于 easycom 自动注册（`components/sn-loadmore/sn-loadmore.vue` → `<sn-loadmore>`），样式几何值走 `rpx`。

> **未实现**
>
> - wot-ui 的国际化默认文案在本轮硬编码为简体中文（uni 端暂无 locale provider）；需要本地化请传 `loadingText` / `finishedText` / `errorText`。

## 基础用法

`state` 为 `loading` 时渲染加载器 + 文案，`finished` 渲染结束文案，`error` 渲染失败文案 +「点击重试」并可点击触发 `reload`。

<Demo name="loadmore-mp-basic" description="三种状态切换 + 点击重试计数。" />

## 自定义文案与插槽

三个 `*-text` 属性覆盖默认文案；`loading` / `finished` / `error` 插槽可完全自定义该状态的内容。

<Demo name="loadmore-mp-text" description="自定义文案与 loading 插槽。" />

## 加载器属性与自定义样式

`loadingProps` 直接透传给内部的 `sn-loading`，因此 `type` / `color` / `size` 都可以改；`customClass` / `customStyle` 落在根节点。

<Demo name="loadmore-mp-custom" description="loading-props 换 spinner 形态与颜色 / custom-class 加虚线框 / custom-style 加圆角。" />

## Props

| 属性         | 类型                                     | 默认值              | 说明                           |
| ------------ | ---------------------------------------- | ------------------- | ------------------------------ |
| state        | '' \| 'loading' \| 'finished' \| 'error' | ''                  | 加载状态；空字符串不渲染       |
| loadingText  | string                                   | '正在努力加载中...' | 加载中文案                     |
| finishedText | string                                   | '已加载完毕'        | 加载完成文案                   |
| errorText    | string                                   | '加载失败'          | 加载失败文案                   |
| loadingProps | Record<string, unknown>                  | `{}`                | 透传给内部 `sn-loading` 的属性 |
| customClass  | string                                   | ''                  | 根节点自定义类名               |
| customStyle  | string                                   | ''                  | 根节点自定义样式               |

## Events

| 事件名 | 说明                       | 参数 |
| ------ | -------------------------- | ---- |
| reload | `state="error"` 时点击组件 | —    |

## Slots

| 插槽名   | 说明               |
| -------- | ------------------ |
| loading  | 自定义加载中内容   |
| finished | 自定义加载完成内容 |
| error    | 自定义加载失败内容 |

## 主题变量

| 变量                            | 用途             |
| ------------------------------- | ---------------- |
| --sn-mp-color-text-secondary    | 加载中文案       |
| --sn-mp-color-text-tertiary     | 加载完成文案     |
| --sn-mp-color-feedback-danger   | 加载失败文案     |
| --sn-mp-color-action-primary    | 「点击重试」提示 |
| --sn-mp-font-size-sm            | 页脚文案字号     |
| --sn-mp-font-line-height-normal | 页脚文案行高     |
| --sn-mp-spacing-2`/`-4`/`-5     | 内边距与间距     |

## 无障碍

- 根节点：`role="status"` + `aria-live="polite"`，`aria-busy` 跟随 `state === "loading"`
- 错误态可点击，重试提示以可见文案呈现

## 暗色模式

文案颜色来自语义色 token（`--sn-mp-color-text-secondary` / `-tertiary` / `--sn-mp-color-feedback-danger` / `--sn-mp-color-action-primary`），都在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：

## 相关

- 骨架屏：[`sn-skeleton`](/components/uni/skeleton)
- 空状态：[`sn-empty`](/components/uni/empty)
