import { Db, WebServer, logger } from './system'
import { routes } from './routes'
import { oki } from './utils'

async function main() {
  const port = parseInt(oki(process.env.port), 10)
  const db = oki(process.env.db)

  try {
    await Db.new(db).migrate()
    await WebServer.new(routes).start(port)
    logger.info(`server listening at http://localhost:${port}`)
  } catch (err) {
    logger.error(err)
    process.exit(-1)
  }
}

if (require.main === module)
  main()
