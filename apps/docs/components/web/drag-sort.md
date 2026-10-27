# DragSort 拖拽排序（Web 端）

`SnDragSort` 提供拖拽排序列表：行内拖拽实时预览、松手提交，`v-model` 双向绑定完整新数组。零第三方依赖（HTML5 DnD + TransitionGroup FLIP）。

## 何时使用

- 排序本身就是数据编辑：任务清单、播放列表、字段顺序、看板列顺序、优先级队列
- 需要「置顶项不被挤走」的列表（`disabled` 锁定行）
- 需要键盘用户也能排序（Alt + 方向键移动）

不适合：仅按某个计算值排序（直接 `sort` 数组即可）；多容器之间拖拽移动（本组件只支持单列表）。

## 代码演示

### 基础用法

拖动任意行到目标位置，拖动过程实时预览、松手提交；`disabled: true` 的行锁定，不可拖动也不可被跨越。也支持键盘：聚焦行后 `Alt + ↑/↓` 移动。

<Demo name="drag-sort-web-basic" description="拖拽实时预览 + 锁定行 + Alt+方向键键盘移动。" />

### 把手模式（handle）

`handle` 开启后只有行首的拖拽把手可以发起拖拽，行内容保持可选中；锁定行不渲染把手。

<Demo name="drag-sort-web-handle" description="只有把手可拖，置顶公告锁定不可移动。" />

### 横向排序

`direction="horizontal"` 切换为横向布局，拖拽中点判定也随之切换为左右半区；键盘改为 `Alt + ←/→`。

<Demo name="drag-sort-web-horizontal" description="横向标签排序，左右半区判定插入位置。" />

## API

### SnDragSort Props

| 名称       | 类型                         | 默认值       | 说明                                                 |
| ---------- | ---------------------------- | ------------ | ---------------------------------------------------- |
| modelValue | `SnDragSortItem[]`           | `[]`         | `v-model` 绑定行数组；`key` 必填，其余字段透传给插槽 |
| direction  | `'vertical' \| 'horizontal'` | `'vertical'` | 布局方向，同时决定拖拽中点判定轴与键盘方向键         |
| disabled   | `boolean`                    | `false`      | 禁用整表拖拽与键盘移动                               |
| handle     | `boolean`                    | `false`      | 仅内置把手可发起拖拽，行内容保持文本可选中           |

`SnDragSortItem` = `{ key: string | number; disabled?: boolean } & Record<string, unknown>`

事件：`update:modelValue`（提交的完整新数组，行对象引用不变）与 `sort({ from, to })`（本次移动的前后索引）。拖拽与键盘移动走同一提交路径。

插槽：`#item="{ item, index, isDragging }"` 自定义行内容，缺省渲染 `item.label ?? key`。

行为细节：拖动悬停行半区（上/下或左/右）即实时预览；松手（`dragend`，含取消）提交当前可见顺序（vuedraggable 语义）；锁定行不可拖、不可作为落点、不可被跨越。HTML5 DnD 不支持移动端触摸，本组件面向 PC 端。

完整契约见组件 `ai-description.md`。
