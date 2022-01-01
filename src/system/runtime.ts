import { ZodSchema } from 'zod'
import { WebServer, WebServerInfo } from './http/web-server'
import { Config } from './config/factory'
import { Db } from './db/client'

type MinimalConfig = {
  db: string,
  port: number
}

export function createSystem<S extends MinimalConfig, T extends ZodSchema<S>>(
  webServerInfo: WebServerInfo, configSchema: T
) {
  const config = Config.create(configSchema)

  return {
    config,
    app: WebServer.create(webServerInfo, config.port),
    db: Db.start(config.db),

    interfaces: {
      Db,
      Config,
      WebServer
    }
  }
}
