# 面积图

折线的填充形态：强调「量」与构成趋势。面积用半透明填充而不是渐变对象，这样复制出去的配置是纯 JSON、可直接进项目。

<div class="sn-chart-cases">

<ChartCase id="area-soft" />

<ChartCase id="area-multi" />

</div>

## 面板里能改什么

| 控制项   | 落到哪里             | 默认         |
| -------- | -------------------- | ------------ |
| 平滑     | `series[].smooth`    | 开           |
| 图例     | `legend`             | 开           |
| 触发方式 | `tooltip.trigger`    | `item`       |
| 小数位   | `tooltip.precision`  | `0`          |
| 布局预设 | `layout`             | `default`    |
| 主题模式 | `theme-mode`         | `auto`       |
| 主题色   | `theme.palette` 逐槽 | 案例自带配色 |

面积填充本身走 `areaStyle.opacity`，由系列色自动派生明暗，不需要手配渐变。

## 相关页面

- [折线图](/echarts/line) — 无填充形态
- [柱状图](/echarts/bar) — 离散量对比
- [使用文档](/echarts/usage) — Props / 事件 / 插槽全表
