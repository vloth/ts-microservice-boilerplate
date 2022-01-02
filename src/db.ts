import * as Schema from './schemas'
import { db } from './system/db/client'
import { vals } from './utils'

export async function getWallet() {
  const result = await db.query<Schema.DbWalletTransaction>('select * from wallet')
  return result.rows
}

export async function getWalletTotal() {
  const result = await db.query<{ sum: number }>('select sum(btc_amount) from wallet')
  return result.rows[0].sum ?? 0
}

export async function insertWalletTransaction(transaction: Schema.DbWalletTransaction) {
  const result = await db.query<Schema.DbWalletTransaction>({
    text: `insert into wallet(id, btc_amount, usd_amount_at, created_at)
           values ($1, $2, $3, $4)
           returning *`,

    values: vals(transaction, 'id', 'btc_amount', 'usd_amount_at', 'created_at')
  })

  return result.rows[0]
}
