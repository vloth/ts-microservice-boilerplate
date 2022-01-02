import assert from 'assert'

export function oki<T>(value: null | undefined | false | T, message?: string | Error): T {
  assert.ok(value, message)
  return value
}

export function vals<T, S extends keyof T>(record: T, ...keys: Array<S>) {
  return keys.map(key => record[key])
}

export type Success<T> = { success: true; detail: T }
export type Fail = { success: false; reason: string; detail?: Record<string, unknown> | Error }
export type Result<T> = Success<T> | Fail

interface ResultUtils<T> {
  success(t: T): Result<T>
  failure(reason: string): Result<T>
  failure(reason: string, detail: Record<string, unknown>): Result<T>
  failure(error: Error): Result<T>
}

export function Result<T>() {
  const utils: ResultUtils<T> = {
    success: detail => ({ success: true, detail }),
    failure: (reason: string | Error, detail?: Fail['detail']): Result<T> =>
      typeof reason === 'string'
        ? { success: false, reason, detail }
        : { success: false, reason: String(reason), detail },
  }
  return utils
}

