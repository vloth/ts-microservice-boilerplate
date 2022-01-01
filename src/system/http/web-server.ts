import { ok } from 'assert'
import Koa from 'koa'
import http from 'http'
import bodyparser from 'koa-bodyparser'
import { koaSwagger as swagger } from 'koa2-swagger-ui'
import { flat, mount } from './router'
import { DocsInfo, gendocs } from './gen-docs'
import { version } from '../../../package.json'
import { schemaValidationMiddleware } from './middlewares/schema-validation'
import { shutdown } from './middlewares/shutdown'

export type WebServerInfo = Pick<DocsInfo, 'title' | 'description'>
  & { routes: Record<string, unknown> }

let app: Koa | null = null
let server: http.Server | null = null
let memport: number | null = null

export const WebServer = {
  create({ title, description, routes }: WebServerInfo, port: number) {
    const flatroutes = flat(routes)

    memport = port
    app = new Koa()
    server = http.createServer(app?.callback())

    const spec = gendocs({
      flatroutes,
      version,
      title,
      description,
    })

    return app
      .use(shutdown(server))
      .use(bodyparser())
      .use(swagger({
        hideTopbar: true,
        routePrefix: '/',
        swaggerOptions: { spec, showRequestHeaders: true }
      }))
      .use(schemaValidationMiddleware)
      .use(mount(flatroutes).routes())
  },

  start() {
    return new Promise(resolve => {
      ok(memport && server && app)
      return app.listen(memport, 'localhost', () => resolve(undefined))
    })
  },

  stop() {
    return new Promise(resolve => {
      ok(server)
      return server.close(() => resolve(undefined))
    })
  }
}
