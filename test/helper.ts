import fc from 'fast-check'
import { ZodFastCheck } from 'zod-fast-check'
import * as sinon from 'ts-sinon'
import * as assert from 'assert'
import * as Schema from '@app/schemas'

export function ok(value: unknown, message?: string | Error): asserts value {
  assert.ok(value, message)
}

export function equals<T>(actual: unknown, expected: T, message?: string | Error)
  : asserts actual is T {
  assert.deepStrictEqual(actual, expected, message)
}

export const restoreStubs = sinon.default.restore

export function stub<T>(t: T) {
  for (const method in t) sinon.default.stub(t, method)
  return t as sinon.StubbedInstance<T>
}

export { fc }

const Negative = fc.double({ noDefaultInfinity: true, noNaN: true, max: -0.0001 })

const zfc = ZodFastCheck()
  .override(Schema.NegativeNumber, Negative)

export const gen = {
  Negative,
  Number: fc.double({ noDefaultInfinity: true, noNaN: true }),
  NonNegative: fc.double({ noDefaultInfinity: true, noNaN: true, min: 0 }),
  Date: fc.date(),
  WalletWithdraw: zfc.inputOf(Schema.WalletWithdraw),
  WalletTransaction: zfc.inputOf(Schema.WalletTransaction),
  DbWalletTransaction: zfc.inputOf(Schema.DbWalletTransaction)
}
