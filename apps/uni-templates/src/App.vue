<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';
// 组件 token 样式（--sn-mp-* CSS 变量）。dist 产物，需先构建 @snui/uni。
import '@snui/uni/styles';

onLaunch(() => {});
onShow(() => {});
onHide(() => {});
</script>

<style>
/* 模板工程全局：浅色移动端页面基底 + 通用工具类（各模板页复用）。 */
page {
  background-color: #f4f6f9;
  color: #1d2129;
  font-size: 26rpx;
}

.tpl-page {
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: env(safe-area-inset-bottom);
}

/* 通用卡片 / 分组面板 */
.tpl-card {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 24rpx;
  box-sizing: border-box;
}

.tpl-gap {
  height: 20rpx;
}

/* 原型填充条（灰阶笔触） */
.tpl-line {
  height: 16rpx;
  border-radius: 8rpx;
  background: #eef0f4;
}

/* 价格 */
.tpl-price {
  color: #e5484d;
  font-weight: 700;
}

/* 单元行 */
.tpl-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.tpl-row--between {
  justify-content: space-between;
}
</style>
