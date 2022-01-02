import { restoreStubs } from './helper'
import { db, Db as DbClient } from '../system/db/client'
import { oki } from '../utils'

const isIntegration = process.argv.some(arg => arg.includes('integration'))

async function truncateTables() {
  return db.query('TRUNCATE TABLE wallet CASCADE;')
}

afterEach(async function() {
  if (isIntegration) {
    await truncateTables()
  }

  restoreStubs()
})

before(async function() {
  if (!isIntegration) {
    return
  }

  await DbClient.new(oki(process.env.db)).migrate()
})

after(async function() {
  if (!isIntegration) {
    return
  }

  await DbClient.stop()
})
