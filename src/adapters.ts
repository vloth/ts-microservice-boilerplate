import { sumBy } from 'lodash'
import * as Schema from '@app/schemas'

export function toWalletTransaction(tx: Schema.DbWalletTransaction): Schema.WalletTransaction {
  return {
    id: tx.id,
    btcAmount: tx.btc_amount,
    usdAmountAt: tx.usd_amount_at,
    createdAt: tx.created_at,
  }
}

export function toWalletHistory(
  dbEntries: Array<Schema.DbWalletTransaction>,
  usdAmount: number
): Schema.WalletHistory {
  const entries = dbEntries.map(toWalletTransaction)
  const totalBtc = sumBy(entries, x => x.btcAmount)

  return {
    entries,
    totalBtc,
    totalCurrentUsd: totalBtc * usdAmount,
  }
}

export function toUsdAmount(usdBtcPrice: Schema.UsdBtcPrice) {
  return usdBtcPrice.bpi.USD.rate_float
}

export function toDbWalletTransaction(tx: Schema.WalletTransaction): Schema.DbWalletTransaction {
  return {
    id: tx.id,
    created_at: tx.createdAt,
    btc_amount: tx.btcAmount,
    usd_amount_at: tx.usdAmountAt
  }
}
