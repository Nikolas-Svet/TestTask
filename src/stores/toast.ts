import { defineStore } from 'pinia'

export type ToastLevel = 'success' | 'info' | 'warning' | 'error'

export interface ToastItem {
  id: string
  text: string
  level: ToastLevel
  timeout?: number
  open: boolean
}

function uid() {
  return 't_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    list: [] as ToastItem[],
  }),
  actions: {
    show(text: string, level: ToastLevel = 'info', timeout = 2500) {
      const item: ToastItem = { id: uid(), text, level, timeout, open: true }
      this.list.push(item)
      return item.id
    },
    success(text: string, timeout = 2500) {
      return this.show(text, 'success', timeout)
    },
    info(text: string, timeout = 2500) {
      return this.show(text, 'info', timeout)
    },
    warning(text: string, timeout = 2500) {
      return this.show(text, 'warning', timeout)
    },
    error(text: string, timeout = 3000) {
      return this.show(text, 'error', timeout)
    },

    close(id: string) {
      const t = this.list.find((x) => x.id === id)
      if (t) t.open = false
    },
    remove(id: string) {
      this.list = this.list.filter((x) => x.id !== id)
    },
  },
})
