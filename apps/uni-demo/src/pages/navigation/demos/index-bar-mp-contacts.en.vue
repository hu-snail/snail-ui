<script setup lang="ts">
/**
 * Demo: sn-index-bar — full-page contacts directory.
 *
 * A search bar filters the list on top; the body is a grouped contact list and
 * the right-hand `sn-index-bar` jumps to a group on tap. Avatars use
 * `sn-avatar` text avatars (the colour maps stably from a name hash onto a
 * token palette). The search box uses the built-in `Search` icon.
 *
 * Capabilities on display:
 *   - `show-indicator` echoes the current index in the middle of the list
 *     (additive, see the component description)
 *   - `anchor-id` gives each group a stable DOM id (additive) for deep links
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
      { name: 'Alice', note: 'Product' },
      { name: 'Amy', note: 'Design' },
      { name: 'Aaron', note: 'QA' },
    ],
  },
  {
    index: 'B',
    contacts: [
      { name: 'Bob', note: 'Engineering' },
      { name: 'Bella', note: 'Ops' },
      { name: 'Ben', note: 'Engineering' },
    ],
  },
  {
    index: 'C',
    contacts: [
      { name: 'Carl', note: 'Marketing' },
      { name: 'Cindy', note: 'Finance' },
    ],
  },
  {
    index: 'D',
    contacts: [{ name: 'Dora', note: 'Legal' }],
  },
  {
    index: 'L',
    contacts: [
      { name: 'Leo', note: 'Engineering' },
      { name: 'Lily', note: 'Design' },
    ],
  },
  {
    index: 'W',
    contacts: [
      { name: 'Wang Wei', note: 'Engineering' },
      { name: 'Wu Min', note: 'Support' },
    ],
  },
  {
    index: 'Z',
    contacts: [
      { name: 'Zhang Tao', note: 'Product' },
      { name: 'Zhao Min', note: 'Ops' },
    ],
  },
];

/** Avatar colour rotation pool: all token-based, adapts under dark mode. */
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

/** Name → stable colour (the same contact renders the same hue every time). */
function colorOf(seed: string): string {
  let sum = 0;
  for (let i = 0; i < seed.length; i += 1) sum += seed.charCodeAt(i);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]!;
}

const query = ref('');

/** Keyword filter; empty groups are dropped so the index bar follows along. */
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
      <text class="sn-demo__title">Contacts</text>
      <view class="sn-demo__search">
        <SnIcon :icon="Search" size="36rpx" class="sn-demo__search-icon" />
        <input
          v-model="query"
          class="sn-demo__search-input"
          placeholder="Search contacts"
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
        <text class="sn-demo__empty-text">No contacts found</text>
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

/* custom-class lands on the sn-index-bar root, so :deep crosses the boundary. */
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