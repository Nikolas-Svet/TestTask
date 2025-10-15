<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
const { list } = storeToRefs(toast)

function mapColor(level: 'success' | 'info' | 'warning' | 'error') {
  switch (level) {
    case 'success':
      return 'success'
    case 'warning':
      return 'warning'
    case 'error':
      return 'error'
    default:
      return 'info'
  }
}
</script>

<template>
  <div class="toast-stack">
    <v-snackbar
      v-for="t in list"
      :key="t.id"
      v-model="t.open"
      :color="mapColor(t.level)"
      :timeout="t.timeout ?? 2500"
      location="top right"
      rounded="lg"
      variant="elevated"
      @update:model-value="
        (val) => {
          if (!val) toast.remove(t.id)
        }
      "
    >
      {{ t.text }}
      <template #actions>
        <v-btn icon="mdi-close" variant="text" @click="toast.remove(t.id)" />
      </template>
    </v-snackbar>
  </div>
</template>

<style lang="scss" scoped>
.toast-stack {
  pointer-events: none;

  :deep(.v-snackbar) {
    pointer-events: all;
    margin-top: 8px;
  }
}
</style>
