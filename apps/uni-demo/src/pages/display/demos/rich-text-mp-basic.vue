<script setup lang="ts">
/** Demo: sn-rich-text (uni-end) — 基础图文：标题 / 段落 / 强调 / 引用 / 列表。 */
import SnRichText from '@snui/uni-src/components/sn-rich-text/sn-rich-text.vue';

const article = `
  <h1>周末出走 · 山野手记</h1>
  <p>沿着林间小路慢慢走，<strong>给生活留一点空白。</strong></p>
  <blockquote>把周末留给山野，把时间还给自己。</blockquote>
  <h2>出发前，装好这三样</h2>
  <ul>
    <li>舒适的鞋</li>
    <li>饮水与轻食</li>
    <li>随身垃圾袋</li>
  </ul>
  <h3>路线要点</h3>
  <ol>
    <li>上午沿湖慢走</li>
    <li>午后树荫下休息</li>
    <li>傍晚原路返回</li>
  </ol>
  <p>行前读一读 <code>装备清单.md</code>，<em>轻装最舒服</em>。</p>
`;
</script>

<template>
  <view class="sn-demo">
    <SnRichText :content="article" selectable />
  </view>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
