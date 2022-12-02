import assert from 'assert'

export function fine<T>(value: null | undefined | false | T, message?: string | Error): T {
  assert.ok(value, message)
  return value
}

export function vals<T, S extends keyof T>(record: T, ...keys: Array<S>) {
  return keys.map(key => record[key])
}

export type Result<T, E = undefined> =
	| { ok: true; value: T }
	| { ok: false; error: E }

export function ok<T>(data: T): Result<T, never>
export function ok(): Result<undefined, never>
export function ok<T>(data?: T) {
    return { ok: true, value: data } as Result<T, never>
}

export function err<E>(error: E): Result<never, E> {
    return { ok: false, error }
}

export function unwrap<T, E>(result: Result<T, E>): T {
    if (!result.ok)
        throw Error(`Expected result to be ok,\n\t"${result.error}"`)
    return result.value
}

export function flat<T, E>(results: Result<T, E>[]): Result<T[], E[]> {
    const collectedErrors = results.map(r => !r.ok && r.error).filter(Boolean) as E[]

    if (collectedErrors.length)
        return err(collectedErrors)

    return ok(results.map(r => r.ok && r.value).filter(Boolean) as T[])
}
