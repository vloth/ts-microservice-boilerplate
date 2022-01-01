import * as z from 'zod'

export const Config = z.object({
  port: z.preprocess(
    (n) => parseInt(z.string().parse(n), 10),
    z.number().positive()
  ),
  db: z.string().nonempty()
})

export type Config = z.infer<typeof Config>
