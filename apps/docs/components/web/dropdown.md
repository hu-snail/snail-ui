# Dropdown · Web（PC 端）

下拉菜单。click / hover 双触发，六档 placement + 视口翻转，滚动跟随。

## 基础用法

<Demo name="dropdown-web-basic" description="点击触发 + options（含 divider）。" />

## hover 触发

<Demo name="dropdown-web-hover" description="300ms 关闭延迟，进面板取消。" />

## 位置（placement）

<Demo name="dropdown-web-placement" description="六档方位 + 翻转。" />

## 子菜单（children）

<Demo name="dropdown-web-submenu" description="右滑二级面板 + 键盘进出。" />

## 右键菜单（contextMenu）

`trigger="contextMenu"`（对齐 Arco Design）：右键触发内容时，面板锚定**鼠标位置**打开并替换浏览器原生菜单；再次右键可重新定位。`placement` 的对齐后缀依然围绕光标点生效。

<Demo name="dropdown-web-context-menu" description="trigger=contextMenu：右键打开、锚定鼠标位置、图标行、select 关闭。" />

## 图标

`options[].icon` 接受任意 Vue 图标组件（与 SnMenu `icon` 约定一致），在 click / hover / contextMenu 三种触发模式下渲染行为一致。

## 插槽自定义（#content）

提供 `#content` 作用域插槽后，面板内容**完全由插槽接管**（`options` 与子菜单被忽略），插槽作用域为 `{ close }`——自定义行内调用 `close()` 关闭菜单。该模式下组件不再管理选项键盘高亮（Enter/Space 仍可打开、Esc 仍可关闭、点击外部关闭），可访问性由插槽内容自行负责。与 `trigger="contextMenu"` 组合即为完全自定义的右键菜单。

<Demo name="dropdown-web-content-slot" description="#content 插槽接管面板：自定义图标行、危险操作行、页脚，close() 关闭。" />

## API

### SnDropdown Props

| Prop      | 类型                              | 默认值     | 说明                                                             |
| --------- | --------------------------------- | ---------- | ---------------------------------------------------------------- |
| options   | `SnDropdownOption[]`              | `[]`       | {label, key, disabled?, icon?, children?}，type:'divider' 分隔线 |
| trigger   | `'click'\|'hover'\|'contextMenu'` | `'hover'`  | 触发方式；contextMenu 为右键触发，面板锚定鼠标位置               |
| placement | 六档 bottom/top ± start/end       | `'bottom'` | 弹出方位（翻转保留对齐后缀）                                     |
| disabled  | `boolean`                         | `false`    | 禁用                                                             |
| size      | `'small'\|'medium'\|'large'`      | `'medium'` | 尺寸                                                             |
| show      | `boolean`                         | —          | 受控开关（v-model:show）                                         |

事件：`update:show` / `select(key, option)` / `clickoutside`。键盘：Enter/Space/ArrowDown 打开、ArrowUp/Down 高亮、ArrowRight/Left 进出子菜单、Esc 关闭。aria：menu/menuitem/separator。

### SnDropdown Slots

| 插槽    | 作用域      | 说明                                                                                                                                                                                                                                                        |
| ------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| default | —           | 触发内容；建议渲染可聚焦元素（其 keydown 会冒泡到组件，键盘用户可打开菜单）。                                                                                                                                                                               |
| content | `{ close }` | 完全接管面板内容：提供后 `options` 与子菜单被忽略，自定义行调用 `close()` 关闭菜单。该模式下组件不再管理选项键盘高亮（Enter/Space 仍可打开、Esc / 点击外部关闭仍生效），可访问性由插槽内容负责。与 `trigger="contextMenu"` 组合可构建完全自定义的右键菜单。 |

图标：`options[].icon` 接受任意 Vue 图标组件（与 SnMenu `icon` 约定一致），click / hover / contextMenu 三种触发模式渲染行为一致。

完整契约见组件 `ai-description.md`。
