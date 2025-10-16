<script lang="ts" setup>
import { reactive, watch } from 'vue'
import type { Account, DraftAccount } from '@/types'
import { type FieldErrors, validateDraft } from '@/utils/validation'
import { parseLabels } from '@/utils/labels'
import { Consts } from '@/utils/consts'

const props = defineProps<{ draft: DraftAccount }>()
const emit = defineEmits<{
  (e: 'save', account: Account): void
  (e: 'delete', id: string): void
}>()
const errors = reactive<FieldErrors>({})
const state = reactive({ showPwd: false })
const local = reactive<DraftAccount>({ ...props.draft })

watch(
  () => props.draft,
  (d) => {
    Object.assign(local, d)
  },
  { immediate: true },
)

function trySave() {
  const { valid, errors: fieldErrors } = validateDraft(local)
  Object.assign(errors, fieldErrors)
  if (!valid) return

  const labels = parseLabels(local.labelsInput)
  const login = local.login.trim()
  const isLDAP = local.type === 'LDAP'

  const account: Account = {
    id: local.id,
    labels,
    type: local.type,
    login,
    password: isLDAP ? null : local.password.trim(),
  }
  emit('save', account)
}

watch(
  () => local.type,
  (t) => {
    if (t === 'LDAP') local.password = ''
    trySave()
  },
)

function onBlur() {
  trySave()
}
function onDelete() {
  emit('delete', local.id)
}
</script>

<template>
  <div :class="['row-grid', local.type === 'Локальная' ? 'cols-5' : 'cols-4', 'mb-3']">
    <v-text-field
      v-model="local.labelsInput"
      :error="!!errors.labels"
      :error-messages="errors.labels ? [errors.labels] : []"
      density="comfortable"
      hide-details="auto"
      label="Метки"
      placeholder="Значение"
      variant="outlined"
      @blur="onBlur"
    />

    <v-select
      v-model="local.type"
      :error="!!errors.type"
      :error-messages="errors.type ? [errors.type] : []"
      :items="[
        { value: 'LDAP', title: 'LDAP' },
        { value: 'Локальная', title: 'Локальная' },
      ]"
      density="comfortable"
      hide-details="auto"
      label="Тип записи"
      variant="outlined"
    />

    <v-text-field
      v-model="local.login"
      :counter="Consts.MAX_LOGIN_LEN"
      :error="!!errors.login"
      :error-messages="errors.login ? [errors.login] : []"
      :maxlength="Consts.MAX_LOGIN_LEN"
      density="comfortable"
      hide-details="auto"
      label="Логин"
      placeholder="Значение"
      variant="outlined"
      @blur="onBlur"
    />

    <template v-if="local.type === 'Локальная'">
      <v-text-field
        v-model="local.password"
        :append-inner-icon="state.showPwd ? 'mdi-eye-off' : 'mdi-eye'"
        :counter="Consts.MAX_PASS_LEN"
        :error="!!errors.password"
        :error-messages="errors.password ? [errors.password] : []"
        :maxlength="Consts.MAX_PASS_LEN"
        :type="state.showPwd ? 'text' : 'password'"
        density="comfortable"
        hide-details="auto"
        label="Пароль"
        placeholder="Значение"
        variant="outlined"
        @blur="onBlur"
        @click:append-inner="state.showPwd = !state.showPwd"
      />
    </template>

    <div class="d-flex align-center">
      <v-btn :aria-label="`Удалить`" color="error" icon variant="text" @click="onDelete">
        <v-icon icon="mdi-delete" />
      </v-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$row-gap: 12px;
$message-h: 20px;

.row-grid {
  display: grid;
  gap: $row-gap;
  align-items: start;

  &.cols-4 {
    grid-template-columns: 1.2fr 0.9fr 1fr 40px;
  }
  &.cols-5 {
    grid-template-columns: 1.2fr 0.9fr 1fr 1fr 40px;
  }

  :deep(.v-input) {
    position: relative;
    padding-bottom: $message-h;
  }

  :deep(.v-input__details) {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -20px;
    height: $message-h;
    margin: 0;
    overflow: hidden;
  }

  :deep(.v-messages__message) {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
