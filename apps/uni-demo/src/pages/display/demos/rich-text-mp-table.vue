<script setup lang="ts">
/** Demo: sn-rich-text (uni-end) — 表格：colspan / rowspan / colgroup 列宽 / 横向滚动。 */
import SnRichText from '@snui/uni-src/components/sn-rich-text/sn-rich-text.vue';

const tables = `
  <h3>周末安排</h3>
  <table>
    <colgroup><col width="25%"><col width="35%"><col width="40%"></colgroup>
    <tr><th>时间</th><th colspan="2">安排</th></tr>
    <tr><td>09:00</td><td>湖畔集合</td><td>沿湖慢走</td></tr>
    <tr><td>12:00</td><td rowspan="2">野餐</td><td>轻食与水果</td></tr>
    <tr><td>13:30</td><td>树荫下小睡</td></tr>
  </table>
  <h3>宽表格横向滚动</h3>
  <table>
    <tr><th>项目</th><th>说明</th><th>备注</th><th>负责人</th><th>状态</th></tr>
    <tr><td>装备</td><td>登山杖、雨衣、头灯</td><td>轻装优先</td><td>队长</td><td>已就绪</td></tr>
  </table>
`;
</script>

<template>
  <view class="sn-demo">
    <SnRichText :content="tables" />
  </view>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
