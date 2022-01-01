import * as Schema from './schemas'
import { system } from './server'
import { vals } from './utils'

export async function getWallet() {
  const result = await system.db.query<Schema.DbWalletTransaction>('select * from wallet')
  return result.rows
}

export async function getWalletTotal() {
  const result = await system.db.query<{ sum: number }>('select sum(btc_amount) from wallet')
  return result.rows[0].sum
}

export async function insertWalletTransaction(transaction: Schema.DbWalletTransaction) {
  const result = await system.db.query<Schema.DbWalletTransaction>({
    text: `insert into wallet(id, btc_amount, usd_amount_at, created_at)
           values ($1, $2, $3, $4)
           returning *`,

    values: vals(transaction, 'id', 'btc_amount', 'usd_amount_at', 'created_at')
  })

  return result.rows[0]
}
