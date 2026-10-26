# Switch · Web（PC 端）

开关。`role="switch"` + aria-checked，Enter / Space 键盘激活，checked / unchecked 插槽文案。

## 基础用法

<Demo name="switch-web-basic" description="v-model 双向绑定。" />

## 选中值映射（checkedValue / uncheckedValue）

<Demo name="switch-web-values" description="非 boolean 值：'on' / 'off'、1 / 0。" />

## 尺寸（size）

<Demo name="switch-web-sizes" description="small / medium / large 三档。" />

## 禁用 / 只读 / 加载中

<Demo name="switch-web-states" description="disabled / readonly / loading spinner。" />

## 插槽文案（checked / unchecked）

<Demo name="switch-web-slots" description="rail 内嵌选中 / 未选中文案。" />

## API

### SnSwitch Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue | `boolean \| string \| number` | `false` | v-model |
| checkedValue | `boolean \| string \| number` | `true` | 选中值 |
| uncheckedValue | `boolean \| string \| number` | `false` | 未选中值 |
| size | `'small'\|'medium'\|'large'` | `'medium'` | 尺寸 |
| disabled | `boolean` | `false` | 禁用 |
| readonly | `boolean` | `false` | 只读 |
| loading | `boolean` | `false` | 加载中（不响应切换） |
| railStyle | `(info: { checked: boolean }) => StyleValue` | — | rail 样式函数 |

### Slots

`checked` / `unchecked`（按选中态条件渲染）/ `loading-icon`。

完整契约见组件 `ai-description.md`。
