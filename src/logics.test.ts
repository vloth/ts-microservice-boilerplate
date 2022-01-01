import { ok, equals, fc, gen } from './test/helper'
import * as Logics from './logics'
import * as Schema from './schemas'

suite('logics')

test('generate uuid from date amount', function() {
  equals(Logics.uuidFromDateAmount(new Date(2022, 1, 1), 1), '51fad4e4-7a46-5c9c-a026-4c298afb33d4')
})

test('can withdraw', function() {
  fc.assert(
    fc.property(gen.NonNegative, gen.WalletWithdraw, (total, withdraw) => {
      const canWithdraw = Logics.canWithdraw(total, withdraw)
      const amount = Math.abs(withdraw.btc)
      equals(canWithdraw, amount >= total, `Cannot withdraw ${amount} from ${total}`)
    }))
})

test('WalletTransaction', function() {
  fc.assert(
    fc.property(gen.Date, gen.Number, gen.NonNegative, (created, amount, usdAmount) => {
      const tx = Logics.WalletTransaction(created, amount, usdAmount)
      ok(Schema.WalletTransaction.parse(tx))
      equals(tx.usdAmountAt, amount * usdAmount)
    }))
})
