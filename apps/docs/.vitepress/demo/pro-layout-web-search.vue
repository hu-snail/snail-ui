<script setup lang="ts">
/**
 * Demo: SnProSearch — 通用菜单检索（跨层级命中、命中路径、键盘可达）。
 *
 * `SnProSearch` 是共享件：classic 风格把它放在内容区顶栏，你也可以单独拿它
 * 做命令面板。检索规则来自纯函数 `searchMenuOptions`（组件内部用的就是它），
 * 所以下面右侧可以直接看到同一份匹配结果。
 */
import { computed, markRaw, ref } from 'vue';
import { FileText, FolderTree, Home, Settings, ShieldCheck, Users } from 'lucide-vue-next';
import { SnProSearch, searchMenuOptions } from '@snui/admin-layout';
import type { SnMenuOption } from '@snui/vue-web';

const menus: SnMenuOption[] = [
  { key: 'home', label: '首页', icon: markRaw(Home) },
  {
    key: 'system',
    label: '系统管理',
    icon: markRaw(Settings),
    children: [
      { key: 'user', label: '用户管理', icon: markRaw(Users) },
      { key: 'role', label: '角色权限', icon: markRaw(ShieldCheck) },
    ],
  },
  {
    key: 'content',
    label: '内容管理',
    icon: markRaw(FolderTree),
    children: [{ key: 'article', label: '文章列表', icon: markRaw(FileText) }],
  },
];

const query = ref('管');
const picked = ref('—');
const log = ref<string[]>([]);

// 纯函数直出同一份命中结果（组件内部即如此匹配）。
const hits = computed(() => searchMenuOptions(menus, query.value, { maxResults: 8 }));

function push(line: string): void {
  log.value = [line, ...log.value].slice(0, 3);
}

function onSearch(text: string): void {
  push(`search("${text}") → 宿主可在此打点 / 拉远端候选`);
}

function onSelect(key: string | number, item: SnMenuOption): void {
  picked.value = `${String(key)}（${item.label}）`;
  push(`select(${String(key)}) → 宿主 router.push →「${item.label}」`);
}
</script>

<template>
  <div class="wrap">
    <div class="box">
      <SnProSearch
        v-model="query"
        :menus="menus"
        placeholder="搜索菜单：试试「管」或「system」"
        :max-results="6"
        @search="onSearch"
        @select="onSelect"
      />
      <p class="hint">↑ / ↓ 移动、Enter 选中、Esc 关闭；命中行显示「父级 / 子级」路径。</p>
      <p class="hint">
        最近动作：<code>{{ picked }}</code>
      </p>
      <ul class="log">
        <li v-for="line in log" :key="line">{{ line }}</li>
      </ul>
    </div>

    <div class="box">
      <p class="hint">
        同一份规则的纯函数输出（<code>searchMenuOptions(menus, "{{ query }}")</code>）：
      </p>
      <ul class="hits">
        <li v-for="hit in hits" :key="hit.key">
          <code>{{ hit.key }}</code>
          <span class="trail">{{ hit.path.map((node) => node.label).join(' / ') }}</span>
        </li>
        <li v-if="hits.length === 0" class="empty">无命中</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 16px;
}

@media (max-width: 720px) {
  .wrap {
    grid-template-columns: minmax(0, 1fr);
  }
}

.box {
  padding: 16px;
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: 8px;
  background-color: var(--sn-web-color-background-elevated);
}

.hint {
  margin: 12px 0 0;
  color: var(--sn-web-color-text-tertiary);
  font-size: 12px;
  line-height: 1.7;
}

.log,
.hits {
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
  font-size: 12px;
  color: var(--sn-web-color-text-secondary);
}

.log li {
  padding: 4px 0;
  border-bottom: 1px dashed var(--sn-web-color-border-subtle);
}

.hits li {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px dashed var(--sn-web-color-border-subtle);
}

.hits .trail {
  color: var(--sn-web-color-text-tertiary);
}

.hits .empty {
  color: var(--sn-web-color-text-tertiary);
}
</style>
