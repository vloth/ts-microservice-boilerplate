import { restoreStubs } from './helper'
import { db, Db as DbClient } from '@app/system/db/client'
import { fine } from '@app/utils'
import { WebServer } from '@app/system'
import { routes } from '@app/routes'
import { AddressInfo } from 'net'

const isIntegration = process.argv.some(arg => arg.includes('integration'))

async function truncateTables() {
  return db.query('TRUNCATE TABLE wallet CASCADE;')
}

before(async function() {
  console.log('before running ...')
  if (!isIntegration) {
    return
  }

  await DbClient.new(fine(process.env.db)).migrate()
  this.webserver = WebServer.new(routes)
  const server = await this.webserver.start()
  const { address, port } = <AddressInfo>server.address()
  this.base = `http://${address}:${port}`
})

afterEach(async function() {
  if (isIntegration) {
    await truncateTables()
  }

  restoreStubs()
})

after(async function() {
  if (!isIntegration) {
    return
  }

  await Promise.all([
    DbClient.stop(),
    this.webserver.stop()
  ])
})
