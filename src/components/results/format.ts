import type { PlanMessage } from '../../lib/fueling'
import type { MessageKey, TranslateFn } from '../../lib/i18n'

export const makeFormatters = (locale: string) => ({
  fmt: (n: number) => Math.round(n).toLocaleString(locale),
  fmt1: (n: number) => (Math.round(n * 10) / 10).toLocaleString(locale),
  liters: (l: number) => l.toLocaleString(locale, { maximumFractionDigits: 2 }),
})

export const messageText = (t: TranslateFn, message: PlanMessage) => {
  const prefix = message.leg ? `${t(`leg.${message.leg}`)}: ` : ''
  return prefix + t(message.key as MessageKey, message.params)
}
