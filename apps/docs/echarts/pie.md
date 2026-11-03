# 饼图

占比与构成。环形 + 圆角扇区是这套组件的默认长相；玫瑰图把数值映射到半径，适合品牌 / 渠道这类有序占比。

<div class="sn-chart-cases">

<ChartCase id="pie-ring" />

<ChartCase id="pie-rose" />

</div>

## 面板里能改什么

| 控制项   | 落到哪里                          | 默认         |
| -------- | --------------------------------- | ------------ |
| 圆角     | `series[].itemStyle.borderRadius` | 开           |
| 图例     | `legend`                          | 开           |
| 小数位   | `tooltip.precision`               | `0`          |
| 布局预设 | `layout`                          | `default`    |
| 主题模式 | `theme-mode`                      | `auto`       |
| 主题色   | `theme.palette` 逐槽              | 案例自带配色 |

饼图的 tooltip 触发方式固定为 `item`（没有共享轴），所以面板上没有触发方式开关。

## 相关页面

- [柱状图](/echarts/bar) — 绝对量对比
- [仪表盘](/echarts/gauge) — 单值进度
- [使用文档](/echarts/usage) — Props / 事件 / 插槽全表
