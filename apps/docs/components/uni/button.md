# Button · uni-app

与 [Button · Web](/components/web/button) 同一份契约——只是渲染器不同。Phase 3 落地实际的 uni-app 实现；本页记录契约以及渲染器的预期行为。

<script setup>
import ComponentPreview from '../../.vitepress/components/ComponentPreview.vue';
</script>

> ⚠️ 在 Phase 1 时 `@snui/uni` 仍是占位 package。下面的 preview 会优雅降级 —— `<ComponentPreview end="uni">` 槽会显示 "framework failed" 提示，直到 uni-app 渲染器真正上线。这里文档化的 **契约面** 是未来实现必须满足的。

## Live render · 契约预览

下面的 preview 在 Phase 3 落地后会调用 `createUniRenderer().mount()`。在此之前，它们只验证 schema 形状和 prop 名是否匹配契约。

<ComponentPreview end="uni" name="button" variant="primary" text="Primary (uni)" />

<ComponentPreview end="uni" name="button" variant="secondary" text="Secondary (uni)" />

<ComponentPreview end="uni" name="button" variant="danger" text="Danger (uni)" />

<ComponentPreview end="uni" name="button" variant="ghost" text="Ghost (uni)" />

<ComponentPreview end="uni" name="button" :disabled="true" text="Disabled (uni)" />

## Props

与 Web Button 相同——规范的 Props 表见 [Web Props](/components/web/button#props)。uni 渲染器必须遵守的契约不变量：

| 不变量 | 原因 |
| --- | --- |
| Prop 名完全一致 | 跨端 schema 可移植 |
| `variant` 枚举值完全一致 | 同一套 4 种视觉风格 |
| `size` 枚举值完全一致 | 同一套 3 种尺寸 |
| `text` 最小长度 1 | 移动端不允许空标签 |

## Events · uni-app 事件目录

uni-app 事件目录是 Web 事件目录的超集，外加 uni 专属的 touch + 生命周期事件：

<table class="props">
  <thead>
    <tr><th>Event id</th><th>Uni / H5 等价</th><th>说明</th></tr>
  </thead>
  <tbody>
    <tr><td><code>click</code></td><td><code>@click</code>（H5） / <code>@tap</code>（小程序 + App）</td><td>由渲染器的事件映射层统一。</td></tr>
    <tr><td><code>touchstart</code></td><td>Uni 触摸事件</td><td>仅移动端——能力门控。</td></tr>
    <tr><td><code>touchend</code></td><td>Uni 触摸事件</td><td>仅移动端。</td></tr>
    <tr><td><code>getuserinfo</code></td><td>仅微信小程序</td><td>能力门控；其它端降级为不绑定。</td></tr>
  </tbody>
</table>

## Capability 感知降级

uni-app 渲染器在绑定触摸监听器前会读 `platform.capabilities`。在 H5 构建上，`@touchstart` 映射为原生 DOM 事件。在微信小程序上使用 uni-app 的触摸垫片。在不支持的端（例如支付宝小程序的某些事件），渲染器跳过绑定——永不静默失败（AGENTS.md §85）。

## Tokens

逻辑 token 名与 Web 一致——但 **CSS 变量绑定**会解析到 uni-app 宿主样式表作用域。Theme / Style / Density 三轴相同；区别是渲染器把解析后的绑定挂到页面容器上，而不是 `:root`。

## AI Patch Boundary

与 Web 完全相同。`ai.patchable` 和 `ai.readonly` 是组件契约的一部分，不属于渲染器。

## Source

`packages/protocol/src/button-contract.ts` ·（未来）`packages/uni/src/button.ts`

## Web equivalent

Web 渲染面与规范契约源见 [Button · Web](/components/web/button)。