<script setup lang="ts">
/** Demo: SnTable — striped zebra rows. */
import { SnTable } from '@snui/vue-web'
</script>

<template>
  <div class="sn-demo">
    <SnTable striped>
      <thead>
        <tr>
          <th>Name</th>
          <th>Plays</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Wonderwall</td><td>1,024,398</td></tr>
        <tr><td>Don't Look Back in Anger</td><td>936,005</td></tr>
        <tr><td>Champagne Supernova</td><td>802,114</td></tr>
        <tr><td>Live Forever</td><td>745,220</td></tr>
      </tbody>
    </SnTable>
  </div>
</template>

<style scoped>
.sn-demo { overflow-x: auto; }
</style>
