import { ok, equals, stub } from './test/helper'
import * as Db from './db'
import * as Controller from './controller'
import * as HttpOut from './ports/http-out'

suite('controller')

test('withdraw > total in wallet', async function() {
  const db = stub(Db)
  db.getWalletTotal.resolves(10)
  const r = await Controller.withdraw({ btc: -11 })

  ok(!r.success)
  equals(r.reason, 'withdraw amount bigger than the total in the wallet.')
})

test('withdraw <= total in wallet', async function() {
  stub(HttpOut)
  const db = stub(Db)

  db.getWalletTotal.resolves(10)

  const rless = await Controller.withdraw({ btc: -5 })
  ok(rless.success)

  const reql = await Controller.withdraw({ btc: -10 })
  ok(reql.success)
})
