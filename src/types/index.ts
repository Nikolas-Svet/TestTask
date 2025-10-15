export type AccountType = 'LDAP' | 'Локальная'

export interface Label {
  text: string
}

export interface Account {
  id: string
  labels: Label[]
  type: AccountType
  login: string
  password: string | null
}

export interface DraftAccount {
  id: string
  labelsInput: string
  type: AccountType
  login: string
  password: string
}
