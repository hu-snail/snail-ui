# Avatar · Web（PC 端）

头像组件。图片 / 文字缩略 / 图标三态，加载失败自动 fallback。

## 基础用法

<Demo name="avatar-web-basic" description="src 图片 + 尺寸。" />

## 形状与颜色

<Demo name="avatar-web-shapes" description="round / circle / color。" />

## 失败回退

<Demo name="avatar-web-fallback" description="加载失败 → fallbackText / icon；换 src 自动复位。" />

## 懒加载

 <Demo name="avatar-web-lazy" description="长列表 / 可滚动容器内的头像：lazy 走原生 loading=lazy；再加 intersection-observer-options 则进入视口后才请求（注意把 root 指向滚动容器）。" />

## API

### SnAvatar Props

| Prop                        | 类型                                               | 默认值     | 说明                                                                     |
| --------------------------- | -------------------------------------------------- | ---------- | ------------------------------------------------------------------------ |
| src                         | `string`                                           | —          | 图片地址                                                                 |
| size                        | `number \| 'small'\|'medium'\|'large'`             | `'medium'` | 尺寸（28/34/40px）                                                       |
| round                       | `boolean`                                          | `false`    | 圆角                                                                     |
| circle                      | `boolean`                                          | `false`    | 圆形                                                                     |
| color                       | `string`                                           | —          | 背景色（fallbackText/icon 时）                                           |
| objectFit                   | `'cover'\|'contain'\|'fill'\|'none'\|'scale-down'` | `'cover'`  | 图片适配                                                                 |
| lazy                        | `boolean`                                          | `false`    | 懒加载开关，单独使用走原生 `loading="lazy"`                              |
| intersectionObserverOptions | `{ root?, rootMargin?, threshold? }`               | —          | 与 `lazy` 同时使用时进入视口前不设置 `src`（视口内先渲染 fallback 内容） |
| fallbackText                | `string`                                           | —          | 无图/失败时文字缩略                                                      |
| icon                        | `string`                                           | —          | SnIcon 注册名                                                            |

事件：`error`；Slots：`default`（自定义内容，优先级最高）。fallback 链：slot → fallbackText → icon → 内置 SVG。

懒加载判定：`lazy` + `intersection-observer-options` 才启用 IntersectionObserver 门控（与 `SnImage` 共用
`_internal/lazy-visibility`）。进入视口一次后即永久加载，滚出视口不会卸载；运行环境没有
`IntersectionObserver` 时退化为立即加载（不会出现永远不加载的破图）。

完整契约见组件 `ai-description.md`。
