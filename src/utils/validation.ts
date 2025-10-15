import type { DraftAccount } from '@/types'
import { Consts } from '@/utils/consts.ts'

export type FieldErrors = Partial<Record<'labels' | 'type' | 'login' | 'password', string>>

export function validateDraft(d: DraftAccount): { valid: boolean; errors: FieldErrors } {
  const errors: FieldErrors = {}

  if (d.labelsInput.trim().length > 0) {
    const tooLong = d.labelsInput
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => s.length > Consts.MAX_LABEL_LEN)

    if (tooLong.length > 0) {
      errors.labels = `Каждая метка не более ${Consts.MAX_LABEL_LEN} символов. Нарушения: ${tooLong.join(', ')}`
    }
  }

  if (d.type !== 'LDAP' && d.type !== 'Локальная') {
    errors.type = 'Выберите тип записи.'
  }

  const login = d.login.trim()
  if (!login) {
    errors.login = 'Логин обязателен.'
  } else if (login.length > Consts.MAX_LOGIN_LEN) {
    errors.login = `Не более ${Consts.MAX_LOGIN_LEN} символов.`
  }

  if (d.type === 'Локальная') {
    const pass = d.password.trim()
    if (!pass) {
      errors.password = 'Пароль обязателен.'
    } else if (pass.length > Consts.MAX_PASS_LEN) {
      errors.password = `Не более ${Consts.MAX_PASS_LEN} символов.`
    }
  }

  return { valid: Object.keys(errors).length === 0, errors }
}
