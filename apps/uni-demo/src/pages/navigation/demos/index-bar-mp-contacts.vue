<script setup lang="ts">
/**
 * Demo: sn-index-bar — 整页通讯录。
 *
 * 顶部搜索栏筛选，主体是分组联系人列表，右侧 `sn-index-bar` 索引字母栏
 * 点击即滚动到对应分组；每行联系人头像用 `sn-avatar` 文字头像（颜色由姓名
 * 哈希稳定映射到一组 token 色）。搜索框用内置 `Search` 图标。
 *
 * 演示能力：
 *   - `show-indicator` 在列表中央回显当前索引（additive，见组件说明）
 *   - `anchor-id` 给分组一个稳定 DOM id（additive），便于深链定位
 */
import { computed, ref } from 'vue';
import SnIndexBar from '@snui/uni-src/components/sn-index-bar/sn-index-bar.vue';
import SnIndexAnchor from '@snui/uni-src/components/sn-index-bar/sn-index-anchor.vue';
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Search } from '@snui/uni-src/components/sn-icon/sn-icon-set';

interface Contact {
  name: string;
  note: string;
}

interface ContactGroup {
  index: string;
  contacts: Contact[];
}

const groups: ContactGroup[] = [
  {
    index: 'A',
    contacts: [
      { name: 'Alice', note: '产品' },
      { name: 'Amy', note: '设计' },
      { name: 'Aaron', note: '测试' },
    ],
  },
  {
    index: 'B',
    contacts: [
      { name: 'Bob', note: '研发' },
      { name: 'Bella', note: '运营' },
      { name: 'Ben', note: '研发' },
    ],
  },
  {
    index: 'C',
    contacts: [
      { name: 'Carl', note: '市场' },
      { name: 'Cindy', note: '财务' },
    ],
  },
  {
    index: 'D',
    contacts: [{ name: 'Dora', note: '法务' }],
  },
  {
    index: 'L',
    contacts: [
      { name: 'Leo', note: '研发' },
      { name: 'Lily', note: '设计' },
    ],
  },
  {
    index: 'W',
    contacts: [
      { name: '王伟', note: '研发' },
      { name: '吴敏', note: '客服' },
    ],
  },
  {
    index: 'Z',
    contacts: [
      { name: '张涛', note: '产品' },
      { name: '赵敏', note: '运营' },
    ],
  },
];

/** 头像底色轮转池：全部取自 token，暗色下自动适配。 */
const AVATAR_COLORS = [
  'var(--sn-mp-color-action-primary)',
  'var(--sn-mp-color-feedback-success)',
  'var(--sn-mp-color-feedback-warning)',
  'var(--sn-mp-color-purple)',
  'var(--sn-mp-color-cyan)',
  'var(--sn-mp-color-pink)',
  'var(--sn-mp-color-volcano)',
  'var(--sn-mp-color-lightblue)',
];

/** 姓名 → 稳定颜色（同一联系人每次渲染同色）。 */
function colorOf(seed: string): string {
  let sum = 0;
  for (let i = 0; i < seed.length; i += 1) sum += seed.charCodeAt(i);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]!;
}

const query = ref('');

/** 按关键字过滤；空组直接丢弃，索引栏随分组联动。 */
const filtered = computed<ContactGroup[]>(() => {
  const keyword = query.value.trim().toLowerCase();
  return groups
    .map((group) => ({
      index: group.index,
      contacts: group.contacts.filter((c) => c.name.toLowerCase().includes(keyword)),
    }))
    .filter((group) => group.contacts.length > 0);
});
</script>

<template>
  <view class="sn-demo sn-demo--contacts">
    <view class="sn-demo__topbar">
      <text class="sn-demo__title">通讯录</text>
      <view class="sn-demo__search">
        <SnIcon :icon="Search" size="36rpx" class="sn-demo__search-icon" />
        <input
          v-model="query"
          class="sn-demo__search-input"
          placeholder="搜索联系人"
          placeholder-style="color: var(--sn-mp-color-input-placeholder);"
        />
      </view>
    </view>

    <view class="sn-demo__list">
      <SnIndexBar custom-class="sn-demo__bar" sticky show-indicator>
        <SnIndexAnchor
          v-for="group in filtered"
          :key="group.index"
          :index="group.index"
          :anchor-id="`contact-group-${group.index}`"
        >
          <view v-for="contact in group.contacts" :key="contact.name" class="sn-demo__contact">
            <SnAvatar :text="contact.name.slice(0, 2)" :bg-color="colorOf(contact.name)" />
            <view class="sn-demo__contact-main">
              <text class="sn-demo__contact-name">{{ contact.name }}</text>
              <text class="sn-demo__contact-note">{{ contact.note }}</text>
            </view>
          </view>
        </SnIndexAnchor>
      </SnIndexBar>

      <view v-if="filtered.length === 0" class="sn-demo__empty">
        <text class="sn-demo__empty-text">未找到联系人</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--contacts {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 960rpx;
  overflow: hidden;
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-mp-color-background-surface);
}

.sn-demo__topbar {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-3);
  background-color: var(--sn-mp-color-background-soft);
}

.sn-demo__title {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.sn-demo__search {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  padding: 0 var(--sn-mp-spacing-3);
  height: 72rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-input-bg);
}

.sn-demo__search-icon {
  color: var(--sn-mp-color-text-tertiary);
}

.sn-demo__search-input {
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
  color: var(--sn-mp-color-input-text);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-demo__list {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
}

/* custom-class 落在 sn-index-bar 根节点上，需要 :deep 穿透组件边界。 */
.sn-demo :deep(.sn-demo__bar) {
  height: 100%;
}

.sn-demo__contact {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-demo__contact-main {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  min-width: 0;
}

.sn-demo__contact-name {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
}

.sn-demo__contact-note {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}

.sn-demo__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.sn-demo__empty-text {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-sm);
}
</style>
