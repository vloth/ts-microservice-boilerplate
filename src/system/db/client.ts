import { join } from 'path'
import { Pool, PoolClient, types } from 'pg'
import { migrate } from 'postgres-migrations'
export type Queryable = Pool | PoolClient

export let db = null as unknown as Pool
let NUMERIC_TYPE = 1700

function fixParser() {
  types.setTypeParser(NUMERIC_TYPE, val => parseFloat(val))
}

export const Db = {
  new(connectionString: string) {
    fixParser()
    db = new Pool({ connectionString })
    return Db
  },

  async migrate() {
    return migrate({ client: db }, join(__dirname, '../../..', 'resources/migrations'))

  },

  stop() {
    return db.end()
  }
}

