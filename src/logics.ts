import { v5 as uuid } from 'uuid'
import * as Schema from './schemas'

// uuid v5 private namespace
const namespace = '266ff8e6-4a1b-4508-a39a-f67f5042bb02'

export function uuidFromDateAmount(date: Date, amount: number) {
  return uuid(`${date.toISOString()}${amount}`, namespace)
}

export function WalletTransaction(created: Date, amount: number, usdAmountAt: number)
  : Schema.WalletTransaction {
  return {
    id: uuidFromDateAmount(created, amount),
    btcAmount: amount,
    usdAmountAt: (usdAmountAt * amount),
    createdAt: created
  }
}

export function canWithdraw(total: number, withdrawValue: Schema.WalletWithdraw) {
  return total + withdrawValue.btc < 0
}
