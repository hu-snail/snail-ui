# Button 按钮

最常用的交互组件，触发一个操作。支持多种类型、尺寸、状态。

## 基础用法

<Demo name="button-web-basic" description="六种语义类型：default / primary / success / warning / danger / info。" />

## 尺寸

`tiny` / `small` / `medium` / `large` 四档，对应 `--sn-web-button-height-{tiny,small,medium,large}`。

<Demo name="button-web-size" description="四档高度，覆盖从紧凑列表到首屏 CTA 的全部场景。" />

## 块级与圆角

<Demo name="button-web-shape" description="block 占满父容器宽度，round 应用胶囊形圆角。" />

## 状态

<Demo name="button-web-state" description="disabled 完全禁用；loading 显示 spinner 且不可点击；可手动触发 loading 状态。" />

`loading` 状态下按钮不可点击，自动显示旋转图标。

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| type | `'primary' \| 'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | 按钮类型 |
| size | `'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | 按钮尺寸 |
| block | `boolean` | `false` | 块级（占满父容器宽度） |
| round | `boolean` | `false` | 胶囊形 |
| disabled | `boolean` | `false` | 禁用 |
| loading | `boolean` | `false` | 加载中 |
| htmlType | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 button type |
| bordered | `boolean` | `true` | 显示边框（对 default 类型有效） |
| ariaLabel | `string` | — | 无障碍标签 |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| click | `(event: MouseEvent)` | 点击按钮触发；`disabled` / `loading` 时不触发 |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 按钮内容 |
| icon | 自定义图标（替代 loading spinner） |
| loading | 自定义加载图标（替代默认 spinner） |

## 无障碍

- 使用原生 `<button>` 元素，`role="button"`
- `disabled` 时设置 `aria-disabled="true"`
- `loading` 时设置 `aria-busy="true"`
- 支持 `aria-label` 覆盖
- 键盘 Enter / Space 原生触发 click

## 相关

- [uni 端 sn-button](/components/uni/button)
