import { Context } from 'koa'
import { merge } from 'lodash'
import * as Adapters from '@app/adapters'
import * as Schema from '@app/schemas'
import * as Controller from '@app/controller'

export async function getHistory(ctx: Context) {
  const { entries, usdAmount } = await Controller.getWallet()

  merge(ctx, { body: Adapters.toWalletHistory(entries, usdAmount) })
}

export async function doDeposit(ctx: Context) {
  const deposit = Schema.WalletDeposit.parse(ctx.request.body)
  const transaction = await Controller.deposit(deposit)

  merge(ctx, { body: Adapters.toWalletTransaction(transaction), status: 201 })
}

export async function doWithdraw(ctx: Context) {
  const withdrawal = Schema.WalletWithdraw.parse(ctx.request.body)
  const r = await Controller.withdraw(withdrawal)

  if (!r.ok)
    return merge(ctx, { body: r.error, status: 400 })

  merge(ctx, { body: Adapters.toWalletTransaction(r.value), status: 201 })
}
