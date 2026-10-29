<script setup lang="ts">
/**
 * 模板：登录页 —— 品牌绿双方式登录（验证码 / 账号密码）。
 * 布局：渐变 Hero（HELLO 标题 + 装饰形状）→ 白色大圆角卡片
 * （斜切双 tab + 输入组 + 主按钮 + 注册入口）。
 * 输入框 / 按钮全部使用 @snui/uni 组件（SnInput / SnButton / SnIcon）。
 */
import { onUnmounted, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import type { IconData } from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { User, X } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

/** 品牌绿（参考稿主色），tab / 主按钮 / 链接共用。 */
const GREEN = '#35a257';
/** 输入框浅灰底。 */
const FIELD_BG = '#f4f5f7';

/* lucide 图标数据 —— sn-icon-set 未收录的补充图标（内联数据，无需注册）。 */
const SmartphoneIcon: IconData = {
  paths: ['M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z', 'M12 18h.01'],
};
const ShieldCheckIcon: IconData = {
  paths: [
    'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
    'm9 12 2 2 4-4',
  ],
};
const LockIcon: IconData = {
  paths: ['M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z', 'M7 11V7a5 5 0 0 1 10 0v4'],
};

type LoginMode = 'sms' | 'pwd';
const MODES: { key: LoginMode; label: string }[] = [
  { key: 'sms', label: '手机快速登录' },
  { key: 'pwd', label: '账号密码登录' },
];
const mode = ref<LoginMode>('sms');

const phone = ref('');
const code = ref('');
const account = ref('');
const password = ref('');

/** 验证码 60s 倒计时（§41：卸载时清理定时器）。 */
const countdown = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;
function sendCode(): void {
  if (countdown.value > 0) return;
  if (!phone.value.trim()) {
    uni.showToast({ title: '请输入手机号', icon: 'none' });
    return;
  }
  countdown.value = 60;
  timer = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  }, 1000);
}
onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function doLogin(): void {
  uni.showToast({ title: '登录成功', icon: 'success' });
}
function goRegister(): void {
  uni.showToast({ title: '注册页为模板占位', icon: 'none' });
}
function onClose(): void {
  uni.showToast({ title: '关闭为模板占位', icon: 'none' });
}

/** SnInput 实例几何覆盖（参考稿：96rpx 高 + 28rpx 圆角大灰块）。 */
const fieldStyle = { height: '96rpx', borderRadius: '28rpx', padding: '0 28rpx' };
const submitStyle = { height: '104rpx', borderRadius: '28rpx', fontSize: '34rpx', fontWeight: '600' };
</script>

<template>
  <view class="tpl-page login">
    <view class="login__hero">
      <view class="login__deco login__deco--a" aria-hidden="true" />
      <view class="login__deco login__deco--b" aria-hidden="true" />
      <view class="login__deco login__deco--c" aria-hidden="true" />
      <view class="login__close" aria-label="关闭" @tap="onClose">
        <SnIcon :icon="X" :size="36" color="#16181d" :stroke-width="2.4" />
      </view>
      <view class="login__hello">
        <text class="login__hello-en">HELLO,</text>
        <view class="login__hello-row">
          <text class="login__hello-cn">欢迎使用</text>
          <view class="login__badge"><text class="login__badge-text">蜂鸟采集</text></view>
        </view>
      </view>
    </view>

    <view class="login__card">
      <view class="login__tabs">
        <view
          v-for="m in MODES"
          :key="m.key"
          class="login__tab"
          :class="{ 'is-active': mode === m.key }"
          @tap="mode = m.key"
        >
          <text class="login__tab-text">{{ m.label }}</text>
        </view>
      </view>

      <view v-if="mode === 'sms'" class="login__fields">
        <SnInput
          v-model="phone"
          type="number"
          size="large"
          placeholder="请输入手机号"
          :maxlength="11"
          border="none"
          :custom-bg="FIELD_BG"
          :custom-style="fieldStyle"
          aria-label="手机号"
        >
          <template #prefix>
            <SnIcon :icon="SmartphoneIcon" :size="32" color="#a3a9b3" />
          </template>
        </SnInput>
        <SnInput
          v-model="code"
          type="number"
          size="large"
          placeholder="请输入验证码"
          :maxlength="6"
          border="none"
          :custom-bg="FIELD_BG"
          :custom-style="fieldStyle"
          aria-label="验证码"
        >
          <template #prefix>
            <SnIcon :icon="ShieldCheckIcon" :size="32" color="#a3a9b3" />
          </template>
          <template #suffix>
            <SnButton
              variant="text"
              size="small"
              :custom-style="{ color: countdown > 0 ? '#98a2b3' : GREEN }"
              :disabled="countdown > 0"
              @click="sendCode"
            >{{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}</SnButton>
          </template>
        </SnInput>
      </view>

      <view v-else class="login__fields">
        <SnInput
          v-model="account"
          size="large"
          placeholder="请输入账号"
          border="none"
          :custom-bg="FIELD_BG"
          :custom-style="fieldStyle"
          aria-label="账号"
        >
          <template #prefix>
            <SnIcon :icon="User" :size="32" color="#a3a9b3" />
          </template>
        </SnInput>
        <SnInput
          v-model="password"
          type="password"
          size="large"
          placeholder="请输入密码"
          show-password
          border="none"
          :custom-bg="FIELD_BG"
          :custom-style="fieldStyle"
          aria-label="密码"
        >
          <template #prefix>
            <SnIcon :icon="LockIcon" :size="32" color="#a3a9b3" />
          </template>
        </SnInput>
      </view>

      <SnButton block :bg-color="GREEN" :custom-style="submitStyle" @click="doLogin">立即登录</SnButton>

      <view class="login__register">
        <text class="login__register-tip">没有账号？</text>
        <text class="login__register-link" @tap="goRegister">去注册</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

/* ── 渐变 Hero：淡黄绿 → 浅绿，装饰形状低透明度铺在右上 ─────────────── */
.login__hero {
  position: relative;
  overflow: hidden;
  padding: 60rpx 48rpx 100rpx;
  background: linear-gradient(150deg, #f7f9e0 0%, #e9f5da 45%, #cdeeda 100%);
}
.login__deco {
  position: absolute;
  border-radius: 32rpx;
  background: #4caf6d;
}
.login__deco--a {
  width: 150rpx;
  height: 130rpx;
  top: 40rpx;
  left: 52%;
  opacity: 0.16;
}
.login__deco--b {
  width: 200rpx;
  height: 190rpx;
  right: -56rpx;
  top: 170rpx;
  border-radius: 48rpx;
  opacity: 0.28;
}
.login__deco--c {
  width: 110rpx;
  height: 110rpx;
  right: 24%;
  top: 300rpx;
  border-radius: 28rpx;
  opacity: 0.12;
}
.login__close {
  position: relative;
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -12rpx;
}
.login__hello {
  position: relative;
  margin-top: 36rpx;
}
.login__hello-en {
  display: block;
  font-size: 76rpx;
  font-weight: 900;
  line-height: 1.15;
  color: #16181d;
}
.login__hello-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-top: 4rpx;
}
.login__hello-cn {
  font-size: 58rpx;
  font-weight: 900;
  line-height: 1.2;
  color: #16181d;
}
.login__badge {
  padding: 10rpx 24rpx;
  border-radius: 14rpx;
  background: #35a257;
}
.login__badge-text {
  font-size: 30rpx;
  font-weight: 700;
  color: #ffffff;
}

/* ── 白色大圆角卡片：负 margin 压在渐变上，圆角缺口露出渐变 ────────── */
.login__card {
  flex: 1;
  margin-top: -48rpx;
  position: relative;
  padding: 48rpx 48rpx calc(48rpx + env(safe-area-inset-bottom));
  border-radius: 48rpx 48rpx 0 0;
  background: #ffffff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 斜切双 tab（skew 背景块 + 内容反向回正） */
.login__tabs {
  display: flex;
  gap: 20rpx;
}
.login__tab {
  flex: 1;
  height: 104rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24rpx;
  background: #f1f3f5;
  transform: skewX(-10deg);
  transition: background-color 0.15s;
}
.login__tab.is-active {
  background: #35a257;
}
.login__tab-text {
  transform: skewX(10deg);
  font-size: 30rpx;
  font-weight: 600;
  color: #3d4451;
}
.login__tab.is-active .login__tab-text {
  color: #ffffff;
}

.login__fields {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  margin-top: 56rpx;
}

.login__register {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8rpx;
  margin-top: 40rpx;
}
.login__register-tip {
  font-size: 28rpx;
  color: #667085;
}
.login__register-link {
  font-size: 28rpx;
  font-weight: 600;
  color: #35a257;
}
</style>
