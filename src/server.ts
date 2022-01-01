import * as Schema from './schemas'
import * as Sys from './system/runtime'
import { logger } from './system/logger'
import { routes } from './routes'

// @ts-ignore
process.env.port = 3001
// @ts-ignore
process.env.db = 'postgresql://postgres:postgres@localhost:5432/btc_wallet'

export const system = Sys.createSystem<Schema.Config, typeof Schema.Config>(routes, Schema.Config)

async function main() {
  const { config, interfaces: { Db, WebServer } } = system

  try {
    await Db.connect()
    await Db.migrate()
    await WebServer.start()
    logger.info(`server listening at http://localhost:${config.port}`)
  } catch (err) {
    logger.error(err)
    process.exit(-1)
  }
}

main()
