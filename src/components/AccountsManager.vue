<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import { useToastStore } from '@/stores/toast'
import type { Account, DraftAccount } from '@/types'
import { joinLabels } from '@/utils/labels'
import { generateId } from '@/utils/id'
import AccountRow from './AccountRow.vue'

const store = useAccountsStore()
const toast = useToastStore()

const drafts = reactive<DraftAccount[]>([])

onMounted(() => {
  drafts.splice(0, drafts.length, ...store.accounts.map(toDraft))
})

function toDraft(a: Account): DraftAccount {
  return {
    id: a.id,
    labelsInput: joinLabels(a.labels),
    type: a.type,
    login: a.login,
    password: a.password ?? '',
  }
}

function addRow() {
  drafts.push({ id: generateId(), labelsInput: '', type: 'LDAP', login: '', password: '' })
}

function onSave(account: Account) {
  const existed = store.accounts.some((a) => a.id === account.id)
  store.upsertAccount(account)
  const idx = drafts.findIndex((d) => d.id === account.id)
  if (idx >= 0) drafts[idx] = toDraft(account)

  if (!existed) toast.success('Учетная запись добавлена')
  else toast.info('Учетная запись обновлена')
}

function onDelete(id: string) {
  const existed = store.accounts.some((a) => a.id === id)
  const i = drafts.findIndex((d) => d.id === id)
  if (i >= 0) drafts.splice(i, 1)
  store.removeAccount(id)

  toast.warning(existed ? 'Учетная запись удалена' : 'Строка удалена')
}
</script>

<template>
  <v-container class="py-6" fluid>
    <div class="d-flex align-center justify-start mb-3 ga-3">
      <h1 class="text-h5 font-weight-semibold mb-0">Учетные записи</h1>
      <v-btn
        class="square-btn"
        color="primary"
        min-width="0"
        prepend-icon="mdi-plus"
        size="large"
        @click="addRow"
      ></v-btn>
    </div>

    <v-alert
      border="start"
      class="mb-4"
      density="comfortable"
      prepend-icon="mdi-help-circle-outline"
      type="info"
      variant="tonal"
    >
      Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
    </v-alert>

    <div class="d-none d-md-grid mb-2" style="grid-template-columns: 1.2fr 0.9fr 1fr 1fr 40px">
      <div class="text-subtitle-2 text-medium-emphasis">Метки</div>
      <div class="text-subtitle-2 text-medium-emphasis">Тип записи</div>
      <div class="text-subtitle-2 text-medium-emphasis">Логин</div>
      <div class="text-subtitle-2 text-medium-emphasis">Пароль</div>
      <div></div>
    </div>

    <AccountRow v-for="d in drafts" :key="d.id" :draft="d" @delete="onDelete" @save="onSave" />
  </v-container>
</template>

<style lang="scss" scoped>
.square-btn {
  aspect-ratio: 1/1;

  :deep(.v-btn__prepend) {
    margin: 0;
  }
}
</style>
