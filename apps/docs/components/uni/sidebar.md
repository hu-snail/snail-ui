# Sidebar 侧边导航（uni 端 / 移动端）

`sn-sidebar` 是 `@snui/uni`（移动端 / 小程序 / H5）的竖向侧边导航容器，`sn-sidebar-item` 是单个选项。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 基础用法

`v-model` 绑定激活项的值，右侧内容由宿主按 `change` 联动：

<Demo name="sidebar-mp-basic" description="v-model 绑定 value；sn-sidebar-item 的 label 渲染文案；右侧面板由 change 驱动。" />

## 图标与徽标

`icon` 经图标注册表解析，`badge` / `isDot` 渲染徽标，`disabled` 阻止切换：

<Demo name="sidebar-mp-badge" description="icon 图标；badge 数字徽标；is-dot 点状徽标；disabled 禁用选项。" />

## 切换拦截与 select 方法

`before-change` 在切换前调用，返回 `false` 阻止切换；模板 ref 上的 `select(value, label)` 可从代码驱动侧边栏；item 的 `max` 控制徽标上限：

<Demo name="sidebar-mp-guard" description="before-change 拦截前两次切换；ref.select() 从代码切换；max 控制徽标上限。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-sidebar v-model="active">
  <sn-sidebar-item label="全部" :value="0" />
</sn-sidebar>
```

如需显式 import：

```ts
import { SnSidebar } from '@snui/uni/components/sn-sidebar/sn-sidebar.vue';
import { SnSidebarItem } from '@snui/uni/components/sn-sidebar/sn-sidebar-item.vue';
```

## Props

### sn-sidebar

| 属性           | 类型                                     | 默认值      | 说明                                |
| -------------- | ---------------------------------------- | ----------- | ----------------------------------- |
| `modelValue`   | `string \| number`                       | `0`         | 当前激活项的值                      |
| `beforeChange` | `(value) => boolean \| Promise<boolean>` | `undefined` | 切换前钩子，返回 `false` 可阻止切换 |
| `customClass`  | `string`                                 | `''`        | 根节点自定义类名                    |
| `customStyle`  | `string`                                 | `''`        | 根节点自定义 inline style           |

### sn-sidebar-item

| 属性          | 类型                | 默认值      | 说明                                      |
| ------------- | ------------------- | ----------- | ----------------------------------------- |
| `label`       | `string`            | `''`        | 当前选项标题                              |
| `value`       | `string \| number`  | `undefined` | 当前选项值（不传时回退为 `label`）        |
| `badge`       | `string \| number`  | `undefined` | 徽标显示值                                |
| `icon`        | `string`            | `''`        | 图标名称（经 `registerSnIcons()` 注册）   |
| `iconPrefix`  | `string`            | `''`        | 字体图标类名前缀                          |
| `cssIcon`     | `boolean \| string` | `false`     | 渲染字体图标；字符串值直接作为 class 前缀 |
| `isDot`       | `boolean`           | `false`     | 是否显示点状徽标                          |
| `max`         | `number`            | `99`        | 徽标最大值，超过显示 `{max}+`             |
| `disabled`    | `boolean`           | `false`     | 是否禁用当前选项                          |
| `customClass` | `string`            | `''`        | 根节点自定义类名                          |
| `customStyle` | `string`            | `''`        | 根节点自定义 inline style                 |

## Events

| 事件名              | 说明             | 参数                        |
| ------------------- | ---------------- | --------------------------- |
| `update:modelValue` | 激活值变化时触发 | `(value: string \| number)` |
| `change`            | 激活项切换时触发 | `({ value, label })`        |

## Slots

| 插槽名               | 说明             |
| -------------------- | ---------------- |
| `default`（sidebar） | SidebarItem 列表 |
| `icon`（item）       | 自定义图标内容   |

## 主题变量

| 变量                                        | 用途                     |
| ------------------------------------------- | ------------------------ |
| `--sn-mp-color-background-soft`             | 侧边栏底色               |
| `--sn-mp-color-background-surface`          | 激活项底色               |
| `--sn-mp-color-text-secondary`              | 非激活项文字色           |
| `--sn-mp-color-text-disabled`               | 禁用项文字色             |
| `--sn-mp-color-action-primary`              | 激活项文字色与左侧指示条 |
| `--sn-mp-color-feedback-danger`             | 徽标填充                 |
| `--sn-mp-color-text-on-primary`             | 徽标文字色               |
| `--sn-mp-font-size-md`                      | 选项文字字号             |
| `--sn-mp-font-weight-medium`                | 激活项字重               |
| `--sn-mp-radius-xs` / `--sn-mp-radius-full` | 指示条 / 徽标圆角        |
| `--sn-mp-spacing-3`                         | 选项内边距               |

## 无障碍

- 容器 `role="tablist"` 且 `aria-orientation="vertical"`。
- 每个选项 `role="tab"`，`aria-selected` 反映激活态，`aria-disabled` 反映禁用态，`aria-label` 取 `label`。
- 徽标是选项内的装饰文本，语义由 `label` 承担。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## 暗色模式

`sn-sidebar` 的全部颜色来自 `--sn-mp-color-*`，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配：轨道底色切到暗色 soft 表面，激活项为暗色表面色，激活文字与指示条保持主色。

用 sn-config-provider 的 theme 设为 dark 包裹即可验证：

## 相关

- 标签页：[`sn-tabs`](/components/uni/tabs)
- 分段器：[`sn-segmented`](/components/uni/segmented)
- 索引栏：[`sn-index-bar`](/components/uni/index-bar)
