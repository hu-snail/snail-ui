---
layout: false
title: uni preview
---

<script setup>
// Standalone uni demo preview route (`/preview-mp`), rendered inside iframes
// by Demo.vue / DemoDock.vue and reachable from the component overview.
// `layout: false` keeps the docs chrome (nav / sidebar) out of the iframe.
import MpPreview from './.vitepress/components/MpPreview.vue'
</script>

<MpPreview />
