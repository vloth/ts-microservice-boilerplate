import { sumBy } from 'lodash'
import * as HttpOut from '@app/ports/http-out'
import { wallet } from '@test/integration/aux/http-wallet'
import { equals, stub } from '@test/helper'

suite('wallet')

test('deposit and withdraw btc', async function() {
  const fns = wallet(this.base)

  const httpOut = stub(HttpOut)
  httpOut.getUsdBtcPrice.resolves(1)

  const preHistory = await fns.history()
  equals(preHistory.entries.length, 0)

  await fns.deposit(10)
  await fns.withdraw(-5)

  const history = await fns.history()

  equals(history.entries.length, 2)
  equals(sumBy(history.entries, 'btcAmount'), 5)
})
