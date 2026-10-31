<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— input 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/input-mp-basic.vue';
import Demo1 from './demos/input-mp-types.vue';
import Demo2 from './demos/input-mp-sizes.vue';
import Demo3 from './demos/input-mp-radius.vue';
import Demo4 from './demos/input-mp-bordered-bg-radius.vue';
import Demo5 from './demos/input-mp-prefix-suffix.vue';
import Demo6 from './demos/input-mp-slots.vue';
import Demo7 from './demos/input-mp-clearable-count.vue';
import Demo8 from './demos/input-mp-clear-focus.vue';
import Demo9 from './demos/input-mp-password-toggle.vue';
import Demo10 from './demos/input-mp-word-limit.vue';
import Demo11 from './demos/input-mp-status.vue';
import Demo12 from './demos/input-mp-states.vue';
import Demo13 from './demos/input-mp-align-compact.vue';
import Demo14 from './demos/input-mp-native-attrs.vue';
import Demo15 from './demos/input-mp-runtime.vue';
import Demo16 from './demos/input-mp-custom-class.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'输入框'" :title-en="'Input'">
    <view class="page">
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('基础用法', 'Basic usage') }}</text>
        </view>
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('类型', 'Type') }}</text>
        </view>
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('尺寸', 'Sizes') }}</text>
        </view>
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('圆角', 'Radius') }}</text>
        </view>
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('边框与背景', 'Border & background') }}</text>
        </view>
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('前后图标', 'Prefix & suffix icons') }}</text>
        </view>
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('插槽', 'Slots') }}</text>
        </view>
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('清空与字数', 'Clearable & count') }}</text>
        </view>
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('清空与聚焦', 'Clear & focus') }}</text>
        </view>
        <view class="module__body">
          <Demo8 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('密码显隐', 'Password toggle') }}</text>
        </view>
        <view class="module__body">
          <Demo9 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('字数统计', 'Word limit') }}</text>
        </view>
        <view class="module__body">
          <Demo10 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('校验状态', 'Validation status') }}</text>
        </view>
        <view class="module__body">
          <Demo11 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('禁用与只读', 'Disabled & readonly') }}</text>
        </view>
        <view class="module__body">
          <Demo12 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('对齐与紧凑', 'Alignment & compact') }}</text>
        </view>
        <view class="module__body">
          <Demo13 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('原生属性', 'Native attributes') }}</text>
        </view>
        <view class="module__body">
          <Demo14 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('运行时属性', 'Runtime attributes') }}</text>
        </view>
        <view class="module__body">
          <Demo15 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <text class="module__title">{{ t('自定义类名', 'Custom class') }}</text>
        </view>
        <view class="module__body">
          <Demo16 />
        </view>
      </view>
    </view>
  </DemoPageShell>
</template>

<style scoped>
.page {
  padding: 24rpx 32rpx;
}

/* 场景模块：无卡片底（弥散渐变背景直接透出），标题外置在页面背景上，
 * demo 内容紧随其下；仅用间距分节。 */
.module {
  margin-bottom: 40rpx;
  /* 不裁切：弹窗类 demo 的 fixed 弹层要铺满视口（弹窗不能困在卡片内）。 */
}

.module__head {
  padding: 0 8rpx 16rpx;
}

.module__title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--demo-title);
}

.module__body {
  padding: 0;
}
</style>
