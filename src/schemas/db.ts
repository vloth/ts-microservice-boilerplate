import * as z from 'zod'

export const DbWalletTransaction = z.object({
  id: z.string().uuid(),
  btc_amount: z.number(),
  usd_amount_at: z.number(),
  created_at: z.date()
})

export type DbWalletTransaction = z.infer<typeof DbWalletTransaction>
