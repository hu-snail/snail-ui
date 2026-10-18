<script setup lang="ts">
/** Demo: SnTable — small / medium / large size scale. */
</script>

<template>
  <div class="sn-demo">
    <SnTable size="small">
      <thead>
        <tr><th>small</th><th>列 B</th></tr>
      </thead>
      <tbody>
        <tr><td>内容</td><td>内容</td></tr>
      </tbody>
    </SnTable>

    <SnTable size="medium">
      <thead>
        <tr><th>medium（默认）</th><th>列 B</th></tr>
      </thead>
      <tbody>
        <tr><td>内容</td><td>内容</td></tr>
      </tbody>
    </SnTable>

    <SnTable size="large">
      <thead>
        <tr><th>large</th><th>列 B</th></tr>
      </thead>
      <tbody>
        <tr><td>内容</td><td>内容</td></tr>
      </tbody>
    </SnTable>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 560px;
}
</style>
