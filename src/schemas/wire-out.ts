import * as z from 'zod'

export const UsdBtcPrice = z.object({
  bpi: z.object({
    USD: z.object({
      rate_float: z.number()
    })
  })
})

export type UsdBtcPrice = z.infer<typeof UsdBtcPrice>
