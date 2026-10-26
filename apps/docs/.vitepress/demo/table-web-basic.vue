<script setup lang="ts">
/** Demo: SnTable — basic merged-border grid with authored thead/tbody. */
import { SnTable } from '@snui/vue-web';
</script>

<template>
  <div class="sn-demo">
    <SnTable>
      <thead>
        <tr>
          <th>名称</th>
          <th>播放量</th>
          <th>时长</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Wonderwall</td>
          <td>1,024,398</td>
          <td>4:18</td>
        </tr>
        <tr>
          <td>Don't Look Back in Anger</td>
          <td>936,005</td>
          <td>4:48</td>
        </tr>
        <tr>
          <td>Champagne Supernova</td>
          <td>802,114</td>
          <td>7:27</td>
        </tr>
      </tbody>
    </SnTable>
  </div>
</template>

<style scoped>
.sn-demo {
  overflow-x: auto;
}
</style>
