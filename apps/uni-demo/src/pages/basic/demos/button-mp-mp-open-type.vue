<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — open-type 的扩展参数透传。
 *
 * 这些属性全部来自小程序平台（微信 / 支付宝），只在对应 `open-type` 下生效：
 *
 *   | prop                | 属性名               | 归属                              |
 *   | ------------------- | -------------------- | --------------------------------- |
 *   | sessionFrom         | session-from         | open-type=contact                 |
 *   | sendMessageTitle    | send-message-title   | open-type=contact                 |
 *   | sendMessagePath     | send-message-path    | open-type=contact                 |
 *   | sendMessageImg      | send-message-img     | open-type=contact                 |
 *   | showMessageCard     | show-message-card    | open-type=contact                 |
 *   | appParameter        | app-parameter        | open-type=launchApp               |
 *   | lang                | lang                 | open-type=contact（会话语言）      |
 *   | buttonId            | button-id            | 微信客服消息定位                  |
 *   | scope               | scope                | 支付宝 open-type=getAuthorize     |
 *   | hoverStopPropagation| hover-stop-propagation| 通用（阻止按下态冒泡到祖先）       |
 *
 * 组件把这些值透传到根节点：H5 预览里没有对应能力，属性挂在节点上但不触发任何
 * 平台行为；小程序运行时读到同一个属性才真正走平台 API。下面用代码 + 说明展示
 * 传了什么值，不需要读 DOM。
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

/** open-type=contact 的客服会话配置（小程序侧生效）。 */
const contactConfig = ref({
  sessionFrom: 'snui-demo-session',
  sendMessageTitle: 'AUI 咨询',
  sendMessagePath: 'pages/chat/index?from=docs',
  sendMessageImg: 'https://example.com/snui-card.png',
  showMessageCard: true,
  lang: 'zh_CN' as 'zh_CN' | 'zh_TW' | 'en' | '',
  buttonId: 'snui-contact-btn',
});

const langs = ['zh_CN', 'zh_TW', 'en'] as const;
const lang = ref<'zh_CN' | 'zh_TW' | 'en'>('zh_CN');

/** 说明用：把当前透传的属性拼成一行，方便对照小程序文档。 */
const contactAttrs = [
  ['open-type', 'contact'],
  ['session-from', contactConfig.value.sessionFrom],
  ['send-message-title', contactConfig.value.sendMessageTitle],
  ['send-message-path', contactConfig.value.sendMessagePath],
  ['send-message-img', contactConfig.value.sendMessageImg],
  ['show-message-card', String(contactConfig.value.showMessageCard)],
  ['lang', contactConfig.value.lang],
  ['button-id', contactConfig.value.buttonId],
]
  .map(([key, value]) => `${key}="${value}"`)
  .join(' ');

const hoverCount = ref(0);

function bumpHover(): void {
  hoverCount.value += 1;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">
      open-type=contact 的会话配置（session-from / send-message-* / show-message-card / button-id /
      lang）。H5 无客服能力，属性只透传到根节点。
    </text>
    <view class="sn-demo__row">
      <SnButton
        type="primary"
        open-type="contact"
        :session-from="contactConfig.sessionFrom"
        :send-message-title="contactConfig.sendMessageTitle"
        :send-message-path="contactConfig.sendMessagePath"
        :send-message-img="contactConfig.sendMessageImg"
        :show-message-card="contactConfig.showMessageCard"
        :button-id="contactConfig.buttonId"
        :lang="contactConfig.lang"
      >
        联系客服
      </SnButton>
    </view>
    <text class="sn-demo__attrs">{{ contactAttrs }}</text>

    <text class="sn-demo__meta">lang 三档：zh_CN / zh_TW / en（会话语言）</text>
    <view class="sn-demo__row">
      <SnButton
        v-for="item in langs"
        :key="item"
        open-type="contact"
        :lang="item"
        :button-id="`snui-lang-${item}`"
        @tap="lang = item"
      >
        lang={{ item }}
      </SnButton>
    </view>
    <text class="sn-demo__meta">当前 lang：{{ lang }}</text>

    <text class="sn-demo__meta">
      open-type=launchApp 的 app-parameter（小程序跳转 App 时携带的参数）
    </text>
    <view class="sn-demo__row">
      <SnButton type="success" open-type="launchApp" app-parameter="snui_demo=1&from=docs">
        启动 App
      </SnButton>
    </view>
    <text class="sn-demo__attrs"
      >open-type="launchApp" app-parameter="snui_demo=1&amp;from=docs"</text
    >

    <text class="sn-demo__meta">
      scope 是支付宝 open-type=getAuthorize 的授权范围；sn-button 的 open-type 枚举不含
      getAuthorize，这里只演示 scope 属性本身会透传到根节点。
    </text>
    <view class="sn-demo__row">
      <SnButton open-type="getUserInfo" scope="userInfo">scope=userInfo</SnButton>
      <SnButton open-type="getUserInfo" scope="phoneNumber">scope=phoneNumber</SnButton>
    </view>

    <text class="sn-demo__meta">
      hover-stop-propagation 管的是**按下态（hover-class）**的冒泡，不是 tap 事件：
      按住左边的按钮，只有它自己变按下态，外层不会跟着变；按住右边的默认按钮，
      外层同时进入按下态。两者的 tap 都会冒泡到外层（计数一致）。
    </text>
    <view class="sn-demo__bubble" hover-class="sn-demo__bubble--pressed" @tap="bumpHover">
      <view class="sn-demo__row">
        <SnButton type="warning" hover-stop-propagation>hover-stop-propagation</SnButton>
        <SnButton type="warning">默认</SnButton>
      </view>
      <text class="sn-demo__meta">外层收到 tap：{{ hoverCount }} 次（两个按钮都会加）</text>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* 透传属性的一行摘要 —— 等宽显示，方便对照小程序文档。 */
.sn-demo__attrs {
  padding: var(--sn-mp-spacing-2);
  border-radius: var(--sn-mp-radius-sm);
  background-color: var(--sn-mp-color-background-subtle);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
  word-break: break-all;
}
.sn-demo__bubble {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: var(--sn-mp-spacing-3);
  border: 2rpx dashed var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
}

/* Pressed state of the outer container — visible only when the inner button
   does NOT set hover-stop-propagation. */
.sn-demo__bubble--pressed {
  background: var(--sn-mp-color-background-subtle);
}
</style>
