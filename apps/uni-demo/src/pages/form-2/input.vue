<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— input 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/input-mp-basic.vue';
import Demo1 from './demos/input-mp-types.vue';
import Demo2 from './demos/input-mp-sizes.vue';
import Demo3 from './demos/input-mp-radius.vue';
import Demo4 from './demos/input-mp-prefix-suffix.vue';
import Demo5 from './demos/input-mp-slots.vue';
import Demo6 from './demos/input-mp-password-toggle.vue';
import Demo7 from './demos/input-mp-word-limit.vue';
import Demo8 from './demos/input-mp-status.vue';
import Demo9 from './demos/input-mp-states.vue';
import Demo10 from './demos/input-mp-custom-class.vue';
import Demo11 from './demos/input-mp-align.vue';
import Demo12 from './demos/input-mp-bg.vue';
import Demo13 from './demos/input-mp-border.vue';
import Demo14 from './demos/input-mp-clear-trigger.vue';
import Demo15 from './demos/input-mp-clearable.vue';
import Demo16 from './demos/input-mp-compact.vue';
import Demo17 from './demos/input-mp-composition.vue';
import Demo18 from './demos/input-mp-confirm-hold.vue';
import Demo19 from './demos/input-mp-confirm-type.vue';
import Demo20 from './demos/input-mp-count.vue';
import Demo21 from './demos/input-mp-cursor-selection.vue';
import Demo22 from './demos/input-mp-cursor-spacing.vue';
import Demo23 from './demos/input-mp-enable-native.vue';
import Demo24 from './demos/input-mp-focus.vue';
import Demo25 from './demos/input-mp-inputmode.vue';
import Demo26 from './demos/input-mp-keyboard-hold.vue';
import Demo27 from './demos/input-mp-placeholder.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell
    class="demo-host"
    :title-zh="'输入框'"
    :title-en="'Input'"
    :desc="'单行文本输入'"
    :bg="'#ffffff'"
  >
    <view class="page">
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('基础用法', 'Basic usage')" badge="basic" />
        <view class="module__body">
          <Demo0 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('类型', 'Type')" badge="types" />
        <view class="module__body">
          <Demo1 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('尺寸', 'Sizes')" badge="sizes" />
        <view class="module__body">
          <Demo2 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('圆角', 'Radius')" badge="radius" />
        <view class="module__body">
          <Demo3 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('前后图标', 'Prefix & suffix icons')"
          badge="prefix-suffix"
        />
        <view class="module__body">
          <Demo4 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('时间槽', 'Time slots')" badge="slots" />
        <view class="module__body">
          <Demo5 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('密码显隐', 'Password toggle')"
          badge="password-toggle"
        />
        <view class="module__body">
          <Demo6 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('字数统计', 'Word limit')" badge="word-limit" />
        <view class="module__body">
          <Demo7 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('校验状态', 'Validation status')"
          badge="status"
        />
        <view class="module__body">
          <Demo8 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('禁用与只读', 'Disabled & readonly')"
          badge="states"
        />
        <view class="module__body">
          <Demo9 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('自定义类名', 'Custom class')"
          badge="custom-class"
        />
        <view class="module__body">
          <Demo10 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('右对齐（alignRight）', 'Right alignment (alignRight)')"
          badge="align"
        />
        <view class="module__body">
          <Demo11 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('背景（bg）', 'Background')" badge="bg" />
        <view class="module__body">
          <Demo12 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead class="demo-host" :title="t('边框（border）', 'Border')" badge="border" />
        <view class="module__body">
          <Demo13 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="
            t(
              '清空按钮细节（clearTrigger / focusWhenClear）',
              'Clear button details (clearTrigger / focusWhenClear)',
            )
          "
          badge="clear-trigger"
        />
        <view class="module__body">
          <Demo14 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('清空按钮（clearable）', 'Clear button (clearable)')"
          badge="clearable"
        />
        <view class="module__body">
          <Demo15 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('紧凑行内形态（compact）', 'Compact inline form (compact)')"
          badge="compact"
        />
        <view class="module__body">
          <Demo16 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="
            t('输入合成（ignoreCompositionEvent）', 'Composition input (ignoreCompositionEvent)')
          "
          badge="composition"
        />
        <view class="module__body">
          <Demo17 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('确认键保持键盘（confirmHold）', 'Keyboard hold on confirm (confirmHold)')"
          badge="confirm-hold"
        />
        <view class="module__body">
          <Demo18 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('确认键文案（confirmType）', 'Confirm button label (confirmType)')"
          badge="confirm-type"
        />
        <view class="module__body">
          <Demo19 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('字数计数（showCount）', 'Character count (showCount)')"
          badge="count"
        />
        <view class="module__body">
          <Demo20 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('光标与选区', 'Caret & selection')"
          badge="cursor-selection"
        />
        <view class="module__body">
          <Demo21 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('光标间距（cursorSpacing）', 'Cursor spacing (cursorSpacing)')"
          badge="cursor-spacing"
        />
        <view class="module__body">
          <Demo22 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('原生输入（enableNative）', 'Native input (enableNative)')"
          badge="enable-native"
        />
        <view class="module__body">
          <Demo23 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('自动聚焦（focus）', 'Autofocus (focus)')"
          badge="focus"
        />
        <view class="module__body">
          <Demo24 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('软键盘提示（inputmode）', 'Soft keyboard hint (inputmode)')"
          badge="inputmode"
        />
        <view class="module__body">
          <Demo25 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="t('键盘保持与页面上推', 'Keyboard hold & page push')"
          badge="keyboard-hold"
        />
        <view class="module__body">
          <Demo26 class="demo-host" />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          class="demo-host"
          :title="
            t(
              '占位符样式（placeholderClass / placeholderStyle）',
              'Placeholder styling (placeholderClass / placeholderStyle)',
            )
          "
          badge="placeholder"
        />
        <view class="module__body">
          <Demo27 class="demo-host" />
        </view>
      </view>
    </view>
  </DemoPageShell>
</template>

<style scoped>
.page {
  padding: 24rpx 24rpx 48rpx;
}

/* 场景模块：白底圆角卡片（组件规范视觉稿：浅灰渐变画布上的浮起分区卡）。
 * 刻意不设 overflow / transform / backdrop-filter——它们会把 position: fixed
 * 的后代变成卡片坐标系，弹窗类 demo（calendar / popup / dialog …）会被困在
 * 卡片内裁切显示不全；层级感由描边 + 柔影承担。 */
.module {
  margin-bottom: 24rpx;
  padding: 32rpx;
  border-radius: 24rpx;
  background: var(--demo-card-bg);
  border: 1px solid var(--demo-card-border);
  box-shadow: var(--demo-card-shadow);
}

.module__body {
  padding: 0;
}

/* #ifdef MP-WEIXIN */
/* mp 自定义组件外壳节点按内容收缩（inline 语义）：宿主转 block 铺满列宽，
 * 否则 demo 列宽 = 各宿主 max-content —— 右锚定元素（swipe 操作钮等）不贴
 * 屏幕右缘、模块徽标行停在内容宽度处（设备实测回归，同 sn-step 的
 * virtualHost 修复；H5 上不能加 display，会盖掉 demo 根的 flex）。 */
.demo-host {
  display: block;
  width: 100%;
}
/* #endif */
</style>
