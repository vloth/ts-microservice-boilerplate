import pino from 'pino'

export const logger = pino({
  serializers: pino.stdSerializers
})
