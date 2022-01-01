import { Pool, PoolClient } from 'pg'
import { ZodSchema } from 'zod'
export type Queryable = Pool | PoolClient

let schema: ZodSchema<any> | null = null
let config: Record<string, any> | null = null

export const Config = {
  create<T>(configSchema: ZodSchema<T>) {
    schema = configSchema
    config = schema.parse(process.env)
    return config as T
  },

  unload() { return config = null }
}

