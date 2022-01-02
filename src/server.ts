import { Db, WebServer, logger } from './system'
import { routes } from './routes'

async function main() {
  const port = 3001
  const db = 'postgresql://postgres:postgres@localhost:5432/btc_wallet'

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
