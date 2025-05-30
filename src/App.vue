<template>
  <NConfigProvider>
    <Home v-show="mode === EMode.LIST" v-model:mode="mode" />
    <Config v-show="mode !== EMode.LIST" v-model:mode="mode" />
  </NConfigProvider>
</template>

<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import Home from './views/home/index.vue'
import Config from './views/config/index.vue'
import { ref } from 'vue'
import { EMode } from './types'

const mode = ref<EMode>(EMode.LIST)
</script>
