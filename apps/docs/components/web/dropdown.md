# Dropdown · Web（PC 端）

下拉菜单（对标 n-dropdown）。click / hover 双触发，六档 placement + 视口翻转，滚动跟随。

## 基础用法

<Demo name="dropdown-web-basic" description="点击触发 + options（含 divider）。" />

## hover 触发

<Demo name="dropdown-web-hover" description="300ms 关闭延迟，进面板取消。" />

## 位置（placement）

<Demo name="dropdown-web-placement" description="六档方位 + 翻转。" />

## 子菜单（children）

<Demo name="dropdown-web-submenu" description="右滑二级面板 + 键盘进出。" />

## API

### SnDropdown Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| options | `SnDropdownOption[]` | `[]` | {label, key, disabled?, icon?, children?}，type:'divider' 分隔线 |
| trigger | `'click'\|'hover'` | `'hover'` | 触发方式 |
| placement | 六档 bottom/top ± start/end | `'bottom'` | 弹出方位（翻转保留对齐后缀） |
| disabled | `boolean` | `false` | 禁用 |
| size | `'small'\|'medium'\|'large'` | `'medium'` | 尺寸 |
| show | `boolean` | — | 受控开关（v-model:show） |

事件：`update:show` / `select(key, option)` / `clickoutside`。键盘：Enter/Space/ArrowDown 打开、ArrowUp/Down 高亮、ArrowRight/Left 进出子菜单、Esc 关闭。aria：menu/menuitem/separator。

完整契约见组件 `ai-description.md`。
