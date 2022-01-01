// @ts-ignore
import Router from 'koa-router'
import { merge, pick, fromPairs } from 'lodash'

// non exhaustive http methods
const methods = ['get', 'post', 'put', 'delete']
const ismethod = (key: string) => methods.includes(key)

function classifyKeys(keys: Array<string>) {
  const methods = keys.filter(ismethod)
  const nestedRoutes =  keys.filter(key => key.startsWith('/'))
  const rest = methods.concat(nestedRoutes)

  return {
    methods,
    nestedRoutes,
    meta: keys.filter(key => !rest.includes(key))
  }
}

export function flat(routemap: Record<string, unknown>, prefix = '') {
  let routeFlat = {} as Record<string, unknown>

  for (const [key, value] of Object.entries(routemap)) {
    const ckeys = classifyKeys(Object.keys(value as Record<string, unknown>))
    const metaobj = pick(value, ckeys.meta)

    if (ckeys.methods.length) {
      const metaMethod = fromPairs(ckeys.methods.map(m => [m, metaobj]))
      routeFlat[prefix + key] = merge(pick(value, methods), metaMethod)
    }

    if (ckeys.nestedRoutes.length) {
      const metaInput = fromPairs(ckeys.nestedRoutes.map(k => [k, metaobj]))
      const input = merge(pick(value, ckeys.nestedRoutes), metaInput)
      routeFlat = { ...routeFlat, ...flat(input, prefix + key) }
    }
  }

  return routeFlat
}

export function mount(flatroutes: Record<string, unknown>) {
  const router = new Router()

  const routes = Object.entries(flatroutes)
  routes.forEach(([path, definition]: any) => {
    Object.entries(definition).forEach(([method, def]: any) => {
      if (ismethod(method)) router[method](path, def.handler)
    })
  })

  return router
}
