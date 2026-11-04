# 仪表盘

单值进度与评分。默认隐藏刻度与指针，只留一条圆润的进度弧——KPI 卡里这样最干净。

<div class="sn-chart-cases">

<ChartCase id="gauge-basic" />

<ChartCase id="gauge-progress" />

</div>

## 面板里能改什么

| 控制项   | 落到哪里                                              | 默认      |
| -------- | ----------------------------------------------------- | --------- |
| 圆角     | `progress.roundCap`                                   | 开        |
| 布局预设 | `layout`                                              | `default` |
| 主题模式 | `theme-mode`                                          | `auto`    |
| 主题色   | 默认跟随 UI 库主题（主色 + 逐级渐淡）；拾色后显式覆盖 | 跟随主题  |

仪表盘没有类目轴，也没有图例与 tooltip 触发方式，所以面板上不显示这些控制项——配置面板按案例类型只显示真正有意义的开关，不给无效选项。

## 相关页面

- [饼图](/echarts/pie) — 多类别占比
- [使用文档](/echarts/usage) — Props / 事件 / 插槽全表
