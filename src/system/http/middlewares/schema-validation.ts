import { Context, Next } from 'koa'
import { ZodError } from 'zod'

function format(err: ZodError) {
  return Object.entries(err.flatten().fieldErrors)
    .map(([path, error]) => `${path}: ${error}`).join('\n')
}

export async function schemaValidationMiddleware(ctx: Context, next: Next) {
  return next().catch(err => {
    if (err instanceof ZodError) {
      ctx.status = 400
      ctx.body = format(err) 
      return Promise.resolve()
    }

    return Promise.reject(err)
  })
}
