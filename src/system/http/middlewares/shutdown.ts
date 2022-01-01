import { Server } from 'http'
import { Next } from 'koa'
import { Context } from 'vm'

export function shutdown(server: Server) {
  const timeout = 10e3
  let shuttingDown = false

  function gracefulExit() {
    if (shuttingDown) {
      return
    } else {
      shuttingDown = true
    }

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      return process.exit(0)
    }

    setTimeout(() => process.exit(1), timeout)
    server.close(() => process.exit(0))
  }

  process
    .once('SIGUSR2', gracefulExit) // nodemon signal
    .once('SIGTERM', gracefulExit) // kill signal
    .once('SIGINT', gracefulExit)  // ctrl^c signal

  return function shutdown(ctx: Context, next: Next) {
    if (shuttingDown) {
      ctx.status = 503
      ctx.set('Connection', 'close')
      ctx.body = 'Server is in the process of shutting down'
    } else {
      return next()
    }
  }
}
