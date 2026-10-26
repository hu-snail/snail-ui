<script setup lang="ts">
/** Demo: SnThing — content-indented 内容缩进到头像旁 + header-extra 槽位。 */
import { SnAvatar, SnThing } from '@snui/vue-web'
</script>

<template>
  <div class="thing-demo">
    <SnThing content-indented>
      <template #avatar>
        <SnAvatar :size="40" circle>SW</SnAvatar>
      </template>
      <template #header>VisualWeaver</template>
      <template #header-extra>v0.4.2</template>
      <template #description>Tauri 2 + Vue 3 desktop dev workbench</template>
      Latest commit: the model adapter layer drops its ClineProvider dependency; tooltip state is now unified in the chrome layer.
    </SnThing>
  </div>
</template>

<style scoped>
.thing-demo {
  width: 100%;
  max-width: 560px;
}
</style>
