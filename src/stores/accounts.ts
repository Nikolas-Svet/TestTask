import { defineStore } from 'pinia'
import type { Account } from '@/types'

interface AccountsState {
  accounts: Account[]
}

const STORAGE_KEY = 'accounts:v1'

function load(): Account[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Account[]) : []
  } catch {
    return []
  }
}

function save(list: Account[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export const useAccountsStore = defineStore('accounts', {
  state: (): AccountsState => ({
    accounts: load(),
  }),

  actions: {
    upsertAccount(account: Account) {
      const i = this.accounts.findIndex((a) => a.id === account.id)
      if (i >= 0) this.accounts[i] = account
      else this.accounts.push(account)
      save(this.accounts)
    },

    removeAccount(id: string) {
      this.accounts = this.accounts.filter((a) => a.id !== id)
      save(this.accounts)
    },
  },
})
