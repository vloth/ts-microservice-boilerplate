import { sumBy } from 'lodash'
import { equals, stub } from '../../test/helper'
import * as HttpOut from '../../ports/http-out'
import * as Controller from '../../controller'

suite('wallet')

test('deposit and withdraw btc', async function() {
  stub(HttpOut)

  const preHistory = await Controller.getWallet()
  equals(preHistory.entries.length, 0)

  await Controller.deposit({ btc: 10 })
  await Controller.withdraw({ btc: -5 })

  const history = await Controller.getWallet()

  equals(history.entries.length, 2)
  equals(sumBy(history.entries, x => x.btc_amount), 5)
})
