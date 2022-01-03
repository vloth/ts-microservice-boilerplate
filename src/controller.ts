import * as Adapters from '@app/adapters'
import * as Schema from '@app/schemas'
import * as HttpOut from '@app/ports/http-out'
import * as Db from '@app/db'
import { Result } from '@app/utils'
import { WalletTransaction, canWithdraw } from '@app/logics'

export async function getWallet() {
  const entries = await Db.getWallet()
  const usdAmount = await HttpOut.getUsdBtcPrice()
  return { entries, usdAmount }
}

export async function deposit(depositValue: Schema.WalletDeposit) {
  const usdAmount = await HttpOut.getUsdBtcPrice()
  const transaction = Adapters.toDbWalletTransaction(
    WalletTransaction(new Date(), depositValue.btc, usdAmount)
  )

  return Db.insertWalletTransaction(transaction)
}

export async function withdraw(withdrawValue: Schema.WalletWithdraw) {
  const r = Result<Schema.DbWalletTransaction>()
  const total = await Db.getWalletTotal()

  if (canWithdraw(total, withdrawValue)) {
    return r.failure('withdraw amount bigger than the total in the wallet.')
  }

  const usdAmount = await HttpOut.getUsdBtcPrice()
  const transaction = Adapters.toDbWalletTransaction(
    WalletTransaction(new Date(), withdrawValue.btc, usdAmount)
  )

  return r.success(await Db.insertWalletTransaction(transaction))
}
