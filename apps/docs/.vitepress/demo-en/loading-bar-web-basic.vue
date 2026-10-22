<script setup lang="ts">
/**
 * loading-bar-web-basic — <SnLoadingBarProvider> + useLoadingBar():
 * start (auto-finish after a delay), manual finish, and the error state.
 * The API must be captured inside a descendant of the provider, so the
 * trigger lives in an inline child component.
 */
import { defineComponent, h, onBeforeUnmount } from 'vue'
import { SnButton, SnLoadingBarProvider, useLoadingBar } from '@snui/vue-web'

const LoadingBarTrigger = defineComponent({
  name: 'LoadingBarTrigger',
  setup() {
    const loadingBar = useLoadingBar()
    let timer: ReturnType<typeof setTimeout> | undefined

    const startLoading = (): void => {
      loadingBar.start()
      timer = setTimeout(() => loadingBar.finish(), 2000)
    }

    const finishNow = (): void => {
      clearTimeout(timer)
      loadingBar.finish()
    }

    const startFailing = (): void => {
      loadingBar.start()
      timer = setTimeout(() => loadingBar.error(), 1200)
    }

    onBeforeUnmount(() => clearTimeout(timer))

    return () =>
      h('div', { class: 'loading-bar-basic__row' }, [
        h(SnButton, { type: 'primary', onClick: startLoading }, () => 'Start loading'),
        h(SnButton, { onClick: finishNow }, () => 'Finish now'),
        h(SnButton, { onClick: startFailing }, () => 'Simulate error'),
      ])
  },
})
</script>

<template>
  <div class="loading-bar-basic">
    <SnLoadingBarProvider>
      <LoadingBarTrigger />
    </SnLoadingBarProvider>
  </div>
</template>

<style scoped>
.loading-bar-basic {
  width: 100%;
}

.loading-bar-basic__row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
