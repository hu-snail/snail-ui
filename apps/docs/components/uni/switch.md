# Switch 开关（uni 端 / 移动端）

跨 uni-app 多端的开关控件。easycom 自动注册（`components/sn-switch/sn-switch.vue` → `<sn-switch>`），几何值使用 `rpx`，颜色全部走 `--sn-mp-*` token。

值模型与 wot-ui 一致：`activeValue`（默认 `true`）/ `inactiveValue`（默认 `false`）把任意 `boolean | string | number` 载荷映射到轨道的开关状态。

## 基础用法

`v-model` 绑定值；`change` 在切换成功后触发。

<Demo name="switch-mp-basic" description="v-model + change 事件。" />

## 外观（`activeText` / `inactiveText` / `shape` / `size` / `activeColor` / `inactiveColor`）

`activeText` / `inactiveText` 渲染在轨道内（设置 `activeIcon` 时被图标取代）；`shape` 支持 `round` / `square`；`size` 传数字按 rpx 设计值处理；`activeColor` / `inactiveColor` 是用户 CSS 颜色，内联覆盖 token 默认值。

<Demo name="switch-mp-appearance" description="轨道文案、square 形状、自定义尺寸、自定义颜色。" />

## 受控守卫与状态（`activeValue` / `inactiveValue` / `beforeChange` / `loading` / `disabled`）

`beforeChange` 可返回布尔或 Promise；返回 `false`（或 reject）时切换被拦截，不会 emit。`loading` 显示旋钮内的转圈并阻断交互；`disabled` 置灰并阻断。

<Demo name="switch-mp-before-change" description="字符串 activeValue/inactiveValue；beforeChange 拦截；loading；disabled。" />
## 图标（`activeActionIcon` / `inactiveActionIcon` / `activeIcon` / `inactiveIcon`）

旋钮图标用 `activeActionIcon` / `inactiveActionIcon`（经 sn-icon registry 解析），轨道图标用 `activeIcon` / `inactiveIcon`（会替换掉 `activeText` / `inactiveText`）。不设图标时旋钮回落到 Check / X。

<Demo name="switch-mp-icons" description="activeActionIcon / inactiveActionIcon 旋钮图标；activeIcon / inactiveIcon 轨道图标；图标与文案混用。" />

## CSS 类图标（`activeActionCssIcon` / `inactiveActionCssIcon` / `activeCssIcon` / `inactiveCssIcon` / `classPrefix`）

四个 `*CssIcon` 开关把同一个字符串从「registry 图标名」切换为「CSS 类名」，样式由宿主类提供；`classPrefix` 为与 wd-switch 对齐的提示性前缀参数（不参与渲染）。

<Demo name="switch-mp-css-icons" description="activeActionCssIcon / inactiveActionCssIcon；activeCssIcon / inactiveCssIcon；classPrefix。" />

## 加载与自定义样式（`loadingProps` / `customClass` / `customStyle`）

`loadingProps` 为与 wd-switch 对齐而声明，本构建的 spinner 是纯 CSS 环（颜色 / 尺寸固定为 token 与 24rpx），**该对象目前不参与渲染**；`customClass` / `customStyle` 挂根节点。

<Demo name="switch-mp-loading-custom" description="loading（旋钮内 spinner）；loadingProps（声明但未参与渲染）；customClass；customStyle。" />

## Props

| 属性                    | 类型                                | 默认值      | 说明                                          |
| ----------------------- | ----------------------------------- | ----------- | --------------------------------------------- |
| `modelValue`            | `boolean \| string \| number`       | `false`     | 绑定值，与 `activeValue` 比较。               |
| `disabled`              | `boolean`                           | `false`     | 禁用并置灰。                                  |
| `inactiveActionIcon`    | `string`                            | `''`        | 非激活态旋钮图标名（registry 解析）。         |
| `activeActionIcon`      | `string`                            | `''`        | 激活态旋钮图标名。                            |
| `activeIcon`            | `string`                            | `''`        | 激活态轨道图标，设置后忽略 `activeText`。     |
| `inactiveIcon`          | `string`                            | `''`        | 非激活态轨道图标，设置后忽略 `inactiveText`。 |
| `classPrefix`           | `string`                            | `'wd-icon'` | 图标类名前缀（为 wot-ui 对齐保留）。          |
| `inactiveActionCssIcon` | `boolean \| string`                 | `false`     | 把 `inactiveActionIcon` 当 CSS 类名。         |
| `activeActionCssIcon`   | `boolean \| string`                 | `false`     | 把 `activeActionIcon` 当 CSS 类名。           |
| `activeCssIcon`         | `boolean \| string`                 | `false`     | 把 `activeIcon` 当 CSS 类名。                 |
| `inactiveCssIcon`       | `boolean \| string`                 | `false`     | 把 `inactiveIcon` 当 CSS 类名。               |
| `activeText`            | `string`                            | `''`        | 激活态轨道文案。                              |
| `inactiveText`          | `string`                            | `''`        | 非激活态轨道文案。                            |
| `activeValue`           | `boolean \| string \| number`       | `true`      | 「开」的值（严格相等比较）。                  |
| `inactiveValue`         | `boolean \| string \| number`       | `false`     | 「关」的值。                                  |
| `activeColor`           | `string`                            | `''`        | 激活态轨道颜色（CSS 颜色，内联覆盖）。        |
| `inactiveColor`         | `string`                            | `''`        | 非激活态轨道颜色。                            |
| `size`                  | `string \| number`                  | —           | 轨道尺寸，数字按 rpx 处理。                   |
| `shape`                 | `'round' \| 'square'`               | `'round'`   | 轨道形状。                                    |
| `loading`               | `boolean`                           | `false`     | 旋钮内显示 loading，阻断交互。                |
| `beforeChange`          | `() => boolean \| Promise<boolean>` | —           | 切换前钩子，返回 `false` 拦截。               |
| `customClass`           | `string`                            | `''`        | 根节点类名。                                  |
| `customStyle`           | `string`                            | `''`        | 根节点 inline style。                         |

## Events

| 事件名              | 说明                              | 参数      |
| ------------------- | --------------------------------- | --------- |
| `update:modelValue` | 切换成功（`beforeChange` 通过后） | `(value)` |
| `change`            | 与 `update:modelValue` 同时触发   | `(value)` |

## Slots

无插槽。轨道内容由 `activeText` / `inactiveText` / 图标类 props 提供。

## 主题变量

| 变量                                  | 用途                  |
| ------------------------------------- | --------------------- |
| `--sn-mp-color-control-unchecked`     | 非激活态轨道          |
| `--sn-mp-color-action-primary`        | 激活态轨道 + 旋钮图标 |
| `--sn-mp-color-control-knob`          | 旋钮底板              |
| `--sn-mp-color-text-on-primary`       | 轨道文案 / 轨道图标   |
| `--sn-mp-radius-full` / `-sm` / `-xs` | 圆角 / 方角几何       |
| `--sn-mp-color-border-subtle`         | loading 转圈底环      |

## 无障碍

- 根节点 `role="switch"`，`aria-checked` 为 `"true"` / `"false"`。
- `disabled` 时设置 `aria-disabled="true"`。
- 被阻断（disabled / loading / pending）时 `tabindex` 降为 `-1`。

## 暗色模式

所有颜色通过 `--sn-mp-color-*` 解析，无浅色兜底。`.sn-theme-dark` 下轨道、旋钮底板、轨道文案颜色自动翻转（品牌色 `--sn-mp-color-action-primary` 在两种主题下保持同一品牌色相）。验证方式：
