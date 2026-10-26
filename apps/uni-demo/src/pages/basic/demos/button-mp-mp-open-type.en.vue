<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — the open-type extension attributes.
 *
 * Every attribute below belongs to a miniprogram platform (WeChat / Alipay) and
 * only takes effect under the matching `open-type`:
 *
 *   | prop                 | attribute              | belongs to                       |
 *   | -------------------- | ---------------------- | -------------------------------- |
 *   | sessionFrom          | session-from           | open-type=contact                |
 *   | sendMessageTitle     | send-message-title     | open-type=contact                |
 *   | sendMessagePath      | send-message-path      | open-type=contact                |
 *   | sendMessageImg       | send-message-img       | open-type=contact                |
 *   | showMessageCard      | show-message-card      | open-type=contact                |
 *   | appParameter         | app-parameter          | open-type=launchApp              |
 *   | lang                 | lang                   | open-type=contact (session lang) |
 *   | buttonId             | button-id              | WeChat customer-service anchor   |
 *   | scope                | scope                  | Alipay open-type=getAuthorize    |
 *   | hoverStopPropagation | hover-stop-propagation | any (stop press bubbling)        |
 *
 * The component forwards these values to the root node: the H5 preview has no
 * such capability, so the attributes land on the node without triggering any
 * platform behaviour; a miniprogram runtime reads the same attribute and calls
 * the real platform API. The demo prints the forwarded values instead of
 * reading the DOM.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

/** Customer-service session config for open-type=contact (miniprogram side). */
const contactConfig = ref({
  sessionFrom: 'snui-demo-session',
  sendMessageTitle: 'AUI support',
  sendMessagePath: 'pages/chat/index?from=docs',
  sendMessageImg: 'https://example.com/snui-card.png',
  showMessageCard: true,
  lang: 'zh_CN' as 'zh_CN' | 'zh_TW' | 'en' | '',
  buttonId: 'snui-contact-btn',
});

const langs = ['zh_CN', 'zh_TW', 'en'] as const;
const lang = ref<'zh_CN' | 'zh_TW' | 'en'>('zh_CN');

/** One-line summary of the forwarded attributes, for cross-checking the docs. */
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
      Session config for open-type=contact (session-from / send-message-* / show-message-card /
      button-id / lang). H5 has no customer service, so the attributes only reach the root node.
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
        Contact support
      </SnButton>
    </view>
    <text class="sn-demo__attrs">{{ contactAttrs }}</text>

    <text class="sn-demo__meta">Three lang values: zh_CN / zh_TW / en (session language)</text>
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
    <text class="sn-demo__meta">Current lang: {{ lang }}</text>

    <text class="sn-demo__meta">
      app-parameter for open-type=launchApp (payload carried when jumping to the app)
    </text>
    <view class="sn-demo__row">
      <SnButton type="success" open-type="launchApp" app-parameter="snui_demo=1&from=docs">
        Launch the app
      </SnButton>
    </view>
    <text class="sn-demo__attrs"
      >open-type="launchApp" app-parameter="snui_demo=1&amp;from=docs"</text
    >

    <text class="sn-demo__meta">
      scope is the Alipay authorization range for open-type=getAuthorize; sn-button's open-type enum
      has no getAuthorize, so this only shows that scope itself reaches the root node.
    </text>
    <view class="sn-demo__row">
      <SnButton open-type="getUserInfo" scope="userInfo">scope=userInfo</SnButton>
      <SnButton open-type="getUserInfo" scope="phoneNumber">scope=phoneNumber</SnButton>
    </view>
    <text class="sn-demo__meta">
      hover-stop-propagation governs the **press state (hover-class)** bubbling, not the tap event:
      hold the left button and only it enters the pressed state — the wrapper stays plain; hold the
      default button on the right and the wrapper enters it too. Both taps still bubble to the
      wrapper (same counter).
    </text>
    <view class="sn-demo__bubble" hover-class="sn-demo__bubble--pressed" @tap="bumpHover">
      <view class="sn-demo__row">
        <SnButton type="warning" hover-stop-propagation>hover-stop-propagation</SnButton>
        <SnButton type="warning">Default</SnButton>
      </view>
      <text class="sn-demo__meta"
        >Taps received by the wrapper: {{ hoverCount }} (either button adds)</text
      >
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
/* One-line summary of the forwarded attributes, for cross-checking the docs. */
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
