<script setup lang="ts">
/** Demo: SnTable — single-line=false restores column separators. */
</script>

<template>
  <div class="sn-demo">
    <SnTable :single-line="false">
      <thead>
        <tr>
          <th>名称</th>
          <th>播放量</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Wonderwall</td><td>1,024,398</td></tr>
        <tr><td>Don't Look Back in Anger</td><td>936,005</td></tr>
        <tr><td>Champagne Supernova</td><td>802,114</td></tr>
      </tbody>
    </SnTable>
  </div>
</template>

<style scoped>
.sn-demo { overflow-x: auto; }
</style>
