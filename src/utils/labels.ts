import type { Label } from '@/types'

export function parseLabels(input: string): Label[] {
  return input
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((text) => ({ text }))
}

export function joinLabels(labels: Label[]): string {
  return labels.map((l) => l.text).join(';')
}
