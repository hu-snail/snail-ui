<script setup lang="ts">
/**
 * waterfall-web-basic — SnWaterfall 基础用法：默认 3 列。
 *
 * 卡片由 `v-for` 数据驱动（组件会递归展开 slot 里的 Fragment），高度
 * 各不相同；CSS 多列布局让每一列各自打包，矮列不会在旁边留出空洞。
 */
import { SnWaterfall } from '@snui/vue-web'

interface Tile {
  id: number
  title: string
  height: number
  from: string
  to: string
}

const tiles: Tile[] = [
  { id: 1, title: '登录页', height: 120, from: '#1677ff', to: '#69b1ff' },
  { id: 2, title: '数据看板', height: 190, from: '#722ed1', to: '#b37feb' },
  { id: 3, title: '表单', height: 96, from: '#13c2c2', to: '#5cdbd3' },
  { id: 4, title: '消息流', height: 210, from: '#fa8c16', to: '#ffc069' },
  { id: 5, title: '个人中心', height: 140, from: '#eb2f96', to: '#ff85c0' },
  { id: 6, title: '设置', height: 104, from: '#52c41a', to: '#95de64' },
  { id: 7, title: '订单列表', height: 168, from: '#f5222d', to: '#ff7875' },
  { id: 8, title: '详情页', height: 132, from: '#2f54eb', to: '#85a5ff' },
]
</script>

<template>
  <SnWaterfall class="waterfall-basic">
    <div
      v-for="tile in tiles"
      :key="tile.id"
      class="waterfall-basic__tile"
      :style="{
        height: `${tile.height}px`,
        backgroundImage: `linear-gradient(135deg, ${tile.from}, ${tile.to})`,
      }"
    >
      <span class="waterfall-basic__label">{{ tile.title }}</span>
      <span class="waterfall-basic__size">{{ tile.height }}px</span>
    </div>
  </SnWaterfall>
</template>

<style scoped>
.waterfall-basic {
  width: 100%;
}

.waterfall-basic__tile {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 8px;
  color: #ffffff;
  font-size: 13px;
}

.waterfall-basic__label {
  font-size: 14px;
  font-weight: 500;
}

.waterfall-basic__size {
  opacity: 0.8;
  font-size: 12px;
}
</style>