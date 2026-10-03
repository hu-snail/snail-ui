# uni-app 快速开始

AUI 的 uni-app 渲染器（Phase 3）与 Web 渲染器共享同一份 Protocol / Runtime 契约。渲染器把 `UINode.type` 映射到 uni-app 组件而不是 DOM 元素。

> ⚠️ `@snui/uni` 当前仍是占位 package。契约面已经定型（见 [/guide/web/architecture](/guide/web/architecture)），`/components/uni/` 下的组件文档会随着 Phase 3 实现落地而点亮。

## 1. 安装

```bash
pnpm add @snui/uni @snui/runtime @snui/protocol @snui/tokens
```

uni-app 编译目标的 peer 依赖为 `@dcloudio/uni-app`（详见 uni-app 文档）。

## 2. 同一份 UISchema，不同渲染器

```ts
// main.ts（uni-app 入口）
import { createUniRenderer, createUniRegistry } from '@snui/uni';
import { Button as UniButton } from '@snui/uni/components/button';

const registry = createUniRegistry();
registry.register('button', UniButton);

const renderer = createUniRenderer({ registry });

const schema = {
  version: '1.0.0',
  root: {
    id: 'submit',
    type: 'button',
    props: { variant: 'primary', size: 'medium', text: 'Submit' },
  },
};

// 在一个 uni-app 页面中：
export default {
  setup() {
    onMounted(() => {
      renderer.mount(schema, /* uni-app 页面 ref */);
    });
  },
};
```

## 3. Capability 降级

uni-app 的 API 在不同平台（微信小程序 / iOS / Android / H5）之间有所差异。渲染器会检测能力并降级：

```ts
import { UICapabilitySchema } from '@snui/protocol';

const capability: UICapability = {
  platform: 'mp-weixin',          // 微信小程序
  feature: 'clipboard.write',
  // 渲染器为当前平台挑选最合适的 API，不支持时降级。
};
```

完整的能力协商系统见 [架构](/guide/web/architecture)。

## 相同 vs 差异

| 关注点 | Web | uni-app |
| --- | --- | --- |
| Schema | UISchema | 同 |
| Runtime | AUIRuntime | 同 |
| Tokens | Theme / Style / Density | 同 |
| Actions | ActionRegistry + AppBridge | 同 AppBridge，host 服务实现不同 |
| 事件目录 | DOM 事件（`click`、`change`、…） | Uni 事件 + H5 上的 DOM 事件 |
| 渲染器 | `createVueRenderer()` | `createUniRenderer()` |

组件契约的 `events` 与 `capabilities` 字段因端而异。请查看 `/components/uni/` 了解每个组件的 uni 专属事件目录。

## 下一步

- [Button (uni)](/components/uni/button)
- [架构](/guide/web/architecture)
- [Web 快速开始](/guide/web/quick-start)