<script setup lang="ts">
/** 模板：步骤表单 —— 分步入驻（步骤条 + 字段 + 协议）。 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';

const shopName = ref('');
const phone = ref('');
const agreed = ref(true);
function next(): void {
  if (!agreed.value) {
    uni.showToast({ title: '请先阅读入驻协议', icon: 'none' });
    return;
  }
  uni.showToast({ title: '进入下一步', icon: 'none' });
}
</script>

<template>
  <view class="tpl-page form">
    <view class="form__steps">
      <SnSteps :active="1">
        <SnStep title="店铺信息" description="进行中" />
        <SnStep title="资质上传" description="待开始" />
        <SnStep title="完成" description="" />
      </SnSteps>
    </view>

    <view class="tpl-card form__body">
      <text class="form__label">店铺名称</text>
      <SnInput v-model="shopName" placeholder="填写店铺名称" />
      <text class="form__label">经营类目</text>
      <view class="form__cell">
        <text>数码配件</text>
        <text class="form__cell-arrow">›</text>
      </view>
      <text class="form__label">联系电话</text>
      <SnInput v-model="phone" placeholder="用于平台与您联系" />
    </view>

    <view class="form__foot">
      <text class="form__agree" :class="{ 'is-off': !agreed }" @tap="agreed = !agreed">
        {{ agreed ? '●' : '○' }} 已阅读并同意《入驻协议》
      </text>
      <SnButton class="form__next" type="primary" @click="next">下一步</SnButton>
    </view>
  </view>
</template>

<style scoped>
.form {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.form__steps {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 28rpx 12rpx;
}
.form__body {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}
.form__label {
  font-size: 24rpx;
  color: #667085;
  margin-top: 10rpx;
}
.form__cell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 22rpx;
  border-radius: 14rpx;
  background: #f4f6f9;
  font-size: 26rpx;
}
.form__cell-arrow {
  color: #b3bac6;
  font-size: 30rpx;
}
.form__foot {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}
.form__agree {
  text-align: center;
  font-size: 22rpx;
  color: #667085;
}
.form__agree.is-off {
  color: #b3bac6;
}
.form__next {
  width: 100%;
}
</style>
