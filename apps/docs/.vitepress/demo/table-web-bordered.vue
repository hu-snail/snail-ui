<script setup lang="ts">
/** Demo: SnTable — bordered frame vs borderless with bottom border. */
import { SnTable } from '@snui/vue-web'
</script>

<template>
  <div class="sn-demo">
    <SnTable bordered>
      <thead>
        <tr>
          <th>带外框（bordered）</th>
          <th>列 B</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>内容</td><td>内容</td></tr>
        <tr><td>内容</td><td>内容</td></tr>
      </tbody>
    </SnTable>

    <SnTable :bordered="false">
      <thead>
        <tr>
          <th>无外框（保留底线）</th>
          <th>列 B</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>内容</td><td>内容</td></tr>
        <tr><td>内容</td><td>内容</td></tr>
      </tbody>
    </SnTable>

    <SnTable :bordered="false" :bottom-bordered="false">
      <thead>
        <tr>
          <th>无外框 + 无底线</th>
          <th>列 B</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>内容</td><td>内容</td></tr>
        <tr><td>内容</td><td>内容</td></tr>
      </tbody>
    </SnTable>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;

  overflow-x: auto;
}
</style>
