import fetch from 'node-fetch'
import * as Schema from '../schemas'
import * as Adpaters from '../adapters'

export async function getUsdBtcPrice() {
  const res = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
  const body = await res.json()
  const usdBtcPrice = Schema.UsdBtcPrice.parse(body)
  return Adpaters.toUsdAmount(usdBtcPrice)
}
