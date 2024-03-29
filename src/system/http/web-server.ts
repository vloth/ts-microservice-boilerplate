import { ok } from 'assert'
import Koa from 'koa'
import http from 'http'
import bodyparser from 'koa-bodyparser'
import { fine } from '@app/utils'
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

export const WebServer = {
  new({ title, description, routes }: WebServerInfo) {
    const flatroutes = flat(routes)

    app = new Koa()
    server = http.createServer(app?.callback())

    const spec = gendocs({
      flatroutes,
      version,
      title,
      description,
    })

    app
      .use(shutdown(server))
      .use(bodyparser())
      .use(swagger({
        hideTopbar: true,
        routePrefix: '/',
        swaggerOptions: { spec, showRequestHeaders: true }
      }))
      .use(schemaValidationMiddleware)
      .use(mount(flatroutes).routes())

    return WebServer
  },

  start(port = 0) {
    return new Promise<http.Server>(resolve => {
      ok(server && app)
      const inst = app.listen(port, '0.0.0.0', () => resolve(fine(inst)))
    })
  },

  stop() {
    return new Promise(resolve => {
      ok(server)
      return server.close(() => resolve(undefined))
    })
  }
}
