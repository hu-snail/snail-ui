<script setup lang="ts">
/** 模板：地址管理 —— 地址卡 / 默认标签 / 编辑删除 / 新增。 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';

const addresses = ref([
  { id: 1, name: '蜗蜗', tel: '138****8888', text: '杭州市西湖区蜗蜗科技园 1 号楼 808', isDefault: true },
  { id: 2, name: 'Aria', tel: '186****6666', text: '上海市徐汇区漕河泾开发区 2 期 301', isDefault: false },
]);
function add(): void {
  uni.showToast({ title: '打开新增表单', icon: 'none' });
}
function edit(id: number): void {
  uni.showToast({ title: `编辑地址 ${id}`, icon: 'none' });
}
</script>

<template>
  <view class="tpl-page addr">
    <view v-for="a in addresses" :key="a.id" class="tpl-card addr__card">
      <view class="addr__head">
        <text class="addr__name">{{ a.name }}</text>
        <text class="addr__tel">{{ a.tel }}</text>
        <SnTag v-if="a.isDefault" type="primary" size="small">默认</SnTag>
      </view>
      <text class="addr__text">📍 {{ a.text }}</text>
      <view class="addr__ops">
        <text class="addr__op" @tap="edit(a.id)">编辑</text>
        <text class="addr__op">删除</text>
      </view>
    </view>
    <view class="addr__foot">
      <SnButton class="addr__add" type="primary" @click="add">新增收货地址</SnButton>
    </view>
  </view>
</template>

<style scoped>
.addr {
  padding: 24rpx;
}
.addr__card {
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.addr__head {
  display: flex;
  align-items: center;
  gap: 14rpx;
}
.addr__name {
  font-size: 30rpx;
  font-weight: 700;
}
.addr__tel {
  font-size: 24rpx;
  color: #98a2b3;
}
.addr__text {
  font-size: 24rpx;
  line-height: 1.6;
  color: #667085;
}
.addr__ops {
  display: flex;
  justify-content: flex-end;
  gap: 32rpx;
}
.addr__op {
  font-size: 24rpx;
  color: #667085;
}
.addr__foot {
  margin-top: 40rpx;
}
.addr__add {
  width: 100%;
}
</style>
