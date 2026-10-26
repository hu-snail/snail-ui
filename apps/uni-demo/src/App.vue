<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';
// 组件 token 样式（--sn-mp-* CSS 变量）。dist 产物，需先构建 @snui/uni。
import '@snui/uni/styles';

onLaunch(() => {});
onShow(() => {});
onHide(() => {});
</script>

<style>
/* 全局页面底色，与演示场景和 docs 预览壳一致。 */
page {
  background-color: #f7f7f7;
}
</style>
