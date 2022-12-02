import { sumBy } from 'lodash'
import { equals, fc, gen } from '@test/helper'
import * as Adapters from '@app/adapters'

suite('adapters')

test('tx<->db', function() {
  fc.assert(
    fc.property(gen.WalletTransaction, (tx) => {
      const dtx = Adapters.toDbWalletTransaction(tx)
      equals(tx, Adapters.toWalletTransaction(dtx))
    }))
})

test('tx history', function() {
  const genEntries = fc.array(gen.DbWalletTransaction)

  fc.assert(
    fc.property(genEntries, gen.NonNegative, (entries, amount) => {
      const history = Adapters.toWalletHistory(entries, amount)
      const total = sumBy(history.entries, e => e.btcAmount)

      equals(entries.length, history.entries.length)
      equals(history.totalCurrentUsd, amount * total)
    }))
})
