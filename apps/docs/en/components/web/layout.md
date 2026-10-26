# Layout · Web

Page layout family (n-layout five-piece): SnLayout / SnLayoutSider / SnLayoutHeader / SnLayoutContent / SnLayoutFooter.

## Basic three-section

<Demo name="layout-web-basic" description="Header / Content / Footer vertical stack." />

## With sider (hasSider)

<Demo name="layout-web-sider" description="Horizontal + Sider collapse trigger." />

## Collapse mode

<Demo name="layout-web-collapse" description="transform (keep DOM) / width (reflow) modes." />

## API

### SnLayout Props

| Prop                                                  | Type                   | Default    | Notes                                |
| ----------------------------------------------------- | ---------------------- | ---------- | ------------------------------------ |
| hasSider                                              | `boolean`              | `false`    | Horizontal row with sider            |
| position                                              | `'static'\|'absolute'` | `'static'` | absolute fills the parent            |
| contentStyle / headerStyle / footerStyle / siderStyle | `StyleValue`           | —          | Style pass-through (snail extension) |

### SnLayoutSider Props

| Prop               | Type                   | Default       | Notes                     |
| ------------------ | ---------------------- | ------------- | ------------------------- |
| width              | `number`               | `272`         | Expanded width            |
| collapsedWidth     | `number`               | `64`          | Collapsed width           |
| collapsed          | `boolean \| undefined` | —             | v-model:collapsed         |
| collapseMode       | `'transform'\|'width'` | `'transform'` | Keep DOM vs reflow        |
| showTrigger        | `boolean`              | `false`       | Built-in collapse trigger |
| bordered / reverse | `boolean`              | `false`       | Border / right sider      |

Events: `update:collapsed`. Header 64 / Footer 40 (token-tunable).

See the component `ai-description.md` for the full contract.
