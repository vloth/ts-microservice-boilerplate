import { generateSchema } from '@anatine/zod-openapi'
import { mapValues, map } from 'lodash/fp'
import { ZodSchema } from 'zod'

export type DocsInfo = {
  version: string,
  title: string,
  description: string,
  flatroutes: Record<string, unknown>
}

function getParameterSchema(p: Record<string, unknown>) {
    return ({
        in: p.in,
        name: p.name,
        schema: generateSchema(p.schema as ZodSchema<any>)
    })
}

function getSchema(schema: ZodSchema<any>) {
    const genertedSchema = generateSchema(schema as ZodSchema<any>)
    const type = (genertedSchema.type === 'string') ? 'text/plain' : 'application/json'
    return { content: { [type]: { schema: genertedSchema } } }
}

const build = mapValues((entry: Record<string, any>) => ({
  ...entry,
  responses: mapValues(getSchema, entry.responses),
  parameters: map(getParameterSchema, entry.parameters || []),
  ...(entry.requestBody && { requestBody: getSchema(entry.requestBody) })
}))

export function gendocs(info: DocsInfo) {
  return {
    info,
    openapi: '3.0.1',
    consumes: ['application/json'],
    paths: mapValues(build, info.flatroutes)
  }
}
