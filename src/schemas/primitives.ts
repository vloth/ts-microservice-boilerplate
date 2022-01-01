import * as z from 'zod'

export const Str = z.string()
export const NonEmptyStr = z.string().nonempty()
export const NegativeNumber = z.number().negative()
