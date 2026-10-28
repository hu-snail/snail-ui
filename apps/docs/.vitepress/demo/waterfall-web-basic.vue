<script setup lang="ts">
/**
 * waterfall-web-basic — SnWaterfall 基础用法：默认 3 列。
 *
 * 卡片由 `v-for` 数据驱动（组件会递归展开 slot 里的 Fragment），高度各不
 * 相同；按最短列优先放置，每一列各自打包，矮列不会在旁边留出空洞。
 *
 * 卡片图使用真实网络图片（picsum.photos）：`seed` 固定，同一张图稳定复现。
 */
import { SnWaterfall } from '@snui/vue-web';

interface Tile {
  id: number;
  title: string;
  height: number;
  seed: string;
}

const tiles: Tile[] = [
  { id: 1, title: '登录页', height: 120, seed: 'aui-login' },
  { id: 2, title: '数据看板', height: 190, seed: 'aui-dashboard' },
  { id: 3, title: '表单', height: 96, seed: 'aui-form' },
  { id: 4, title: '消息流', height: 210, seed: 'aui-feed' },
  { id: 5, title: '个人中心', height: 140, seed: 'aui-profile' },
  { id: 6, title: '设置', height: 104, seed: 'aui-settings' },
  { id: 7, title: '订单列表', height: 168, seed: 'aui-orders' },
  { id: 8, title: '详情页', height: 132, seed: 'aui-detail' },
];

/** 按卡片的目标比例取图（占位宽 300px），`object-fit: cover` 再兜底裁切。 */
function photo(seed: string, height: number, width = 300): string {
  const w = 600;
  return `https://picsum.photos/seed/${seed}/${w}/${Math.round((height / width) * w)}`;
}
</script>

<template>
  <SnWaterfall class="waterfall-basic">
    <div
      v-for="tile in tiles"
      :key="tile.id"
      class="waterfall-basic__tile"
      :style="{ height: `${tile.height}px` }"
    >
      <img
        class="waterfall-basic__img"
        :src="photo(tile.seed, tile.height)"
        :alt="tile.title"
        loading="lazy"
      />
      <div class="waterfall-basic__overlay" aria-hidden="true">
        <span class="waterfall-basic__label">{{ tile.title }}</span>
        <span class="waterfall-basic__size">{{ tile.height }}px</span>
      </div>
    </div>
  </SnWaterfall>
</template>

<style scoped>
.waterfall-basic {
  width: 100%;
}

.waterfall-basic__tile {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.waterfall-basic__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 底部压暗，保证白色文字在任意照片上都可读。 */
.waterfall-basic__overlay {
  position: absolute;
  inset: auto 0 0 0;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding: 24px 12px 10px;
  color: #ffffff;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0));
  font-size: 13px;
}

.waterfall-basic__label {
  font-size: 14px;
  font-weight: 500;
}

.waterfall-basic__size {
  opacity: 0.85;
  font-size: 12px;
}
</style>
