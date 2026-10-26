<script setup lang="ts">
/** Demo: SnTable — bordered frame vs borderless with bottom border. */
import { SnTable } from '@snui/vue-web'
</script>

<template>
  <div class="sn-demo">
    <SnTable bordered>
      <thead>
        <tr>
          <th>Outer border (bordered)</th>
          <th>Col B</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Content</td><td>Content</td></tr>
        <tr><td>Content</td><td>Content</td></tr>
      </tbody>
    </SnTable>

    <SnTable :bordered="false">
      <thead>
        <tr>
          <th>No outer border (row lines kept)</th>
          <th>Col B</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Content</td><td>Content</td></tr>
        <tr><td>Content</td><td>Content</td></tr>
      </tbody>
    </SnTable>

    <SnTable :bordered="false" :bottom-bordered="false">
      <thead>
        <tr>
          <th>No outer border + no row lines</th>
          <th>Col B</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Content</td><td>Content</td></tr>
        <tr><td>Content</td><td>Content</td></tr>
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
