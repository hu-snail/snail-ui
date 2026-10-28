<script setup lang="ts">
/** 模板：登录页 —— 验证码登录 + 三方入口占位。 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const phone = ref('');
const code = ref('');
function doLogin(): void {
  uni.showToast({ title: '登录成功', icon: 'success' });
}
</script>

<template>
  <view class="tpl-page login">
    <view class="login__logo">蜗</view>
    <text class="login__title">欢迎回来</text>
    <text class="login__sub">未注册的手机号将自动创建账号</text>

    <view class="login__form">
      <SnInput v-model="phone" placeholder="请输入手机号" />
      <view class="login__code">
        <SnInput v-model="code" placeholder="请输入验证码" />
        <SnButton type="default" size="small">获取验证码</SnButton>
      </view>
      <SnButton class="login__submit" type="primary" @click="doLogin">登 录</SnButton>
    </view>

    <view class="login__divider"><text>其他登录方式</text></view>
    <view class="login__others">
      <view class="login__other">微信</view>
      <view class="login__other">Apple</view>
      <view class="login__other">邮箱</view>
    </view>
  </view>
</template>

<style scoped>
.login {
  min-height: 100vh;
  background: #ffffff;
  padding: 120rpx 56rpx 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.login__logo {
  width: 128rpx;
  height: 128rpx;
  border-radius: 40rpx;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: #ffffff;
  font-size: 56rpx;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
}
.login__title {
  margin-top: 32rpx;
  font-size: 44rpx;
  font-weight: 800;
  text-align: center;
}
.login__sub {
  margin-top: 10rpx;
  text-align: center;
  font-size: 24rpx;
  color: #98a2b3;
}
.login__form {
  margin-top: 64rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.login__code {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.login__code > :first-child {
  flex: 1;
}
.login__submit {
  margin-top: 8rpx;
}
.login__divider {
  margin-top: 96rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  color: #b3bac6;
  font-size: 22rpx;
}
.login__divider::before,
.login__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #eef0f4;
}
.login__others {
  margin-top: 40rpx;
  display: flex;
  justify-content: center;
  gap: 48rpx;
}
.login__other {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: #f4f6f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #667085;
}
</style>
