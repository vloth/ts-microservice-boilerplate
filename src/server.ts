import { Db, WebServer, logger } from '@app/system'
import { routes } from '@app/routes'
import { fine } from '@app/utils'

async function main() {
  const port = parseInt(fine(process.env.port), 10)
  const db = fine(process.env.db)

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
