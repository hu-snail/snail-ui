# Layout · Web（PC 端）

页面布局族五件套：SnLayout / SnLayoutSider / SnLayoutHeader / SnLayoutContent / SnLayoutFooter。

## 基础三段

<Demo name="layout-web-basic" description="Header / Content / Footer 纵向编排。" />

## 带侧栏（hasSider）

<Demo name="layout-web-sider" description="横向编排 + Sider 折叠触发器。" />

## 折叠模式（collapseMode）

<Demo name="layout-web-collapse" description="transform 保 DOM / width 重排两档。" />

## API

### SnLayout Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| hasSider | `boolean` | `false` | 横向编排（含 Sider） |
| position | `'static'\|'absolute'` | `'static'` | absolute 时铺满父容器 |
| contentStyle / headerStyle / footerStyle / siderStyle | `StyleValue` | — | 四路样式透传（snail 扩展） |

### SnLayoutSider Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| width | `number` | `272` | 展开宽度 |
| collapsedWidth | `number` | `64` | 折叠宽度 |
| collapsed | `boolean \| undefined` | — | v-model:collapsed（受控/非受控） |
| collapseMode | `'transform'\|'width'` | `'transform'` | transform 平移保 DOM / width 重排 |
| showTrigger | `boolean` | `false` | 内置折叠触发器 |
| bordered / reverse | `boolean` | `false` | 边框 / 右侧栏 |

事件：`update:collapsed`。Header 高 64 / Footer 高 40（token 可调）。

完整契约见组件 `ai-description.md`。
