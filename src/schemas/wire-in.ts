import * as z from 'zod'
import { NegativeNumber } from './primitives'

export const WalletTransaction = z.object({
  id: z.string().uuid(),
  btcAmount: z.number(),
  usdAmountAt: z.number(),
  createdAt: z.date()
})

export const WalletHistory = z.object({
  entries: z.array(WalletTransaction),
  totalBtc: z.number(),
  totalCurrentUsd: z.number()
})

export const WalletDeposit = z.object({
  btc: z.number().nonnegative()
})

export const WalletWithdraw = z.object({
  btc: NegativeNumber
})

export type WalletTransaction = z.infer<typeof WalletTransaction>
export type WalletHistory = z.infer<typeof WalletHistory>
export type WalletWithdraw = z.infer<typeof WalletWithdraw>
export type WalletDeposit = z.infer<typeof WalletDeposit>
