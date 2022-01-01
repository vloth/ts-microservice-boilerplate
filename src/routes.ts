import * as Schema from './schemas'
import * as HttpIn from './ports/http-in'

export const routes = {
  title: 'btc-wallet',
  description: 'small sample using the microservice-boilerplate',

  routes: {
    '/wallet': {
      ags: ['wallet'],

      '/history': {
        get: {
          summary: 'get all wallet entries and current total',
          handler: HttpIn.getHistory,
          responses: {
            200: Schema.WalletHistory,
            500: Schema.Str
          }
        },
      },

      '/deposit': {
        post: {
          summary: 'do a deposit in btc in the wallet',
          handler: HttpIn.doDeposit,
          requestBody: Schema.WalletDeposit,
          responses: {
            201: Schema.WalletTransaction,
            400: Schema.Str,
            500: Schema.Str
          }
        }
      },

      '/withdraw': {
        post: {
          summary: 'do a withdraw in btc in the wallet if possible',
          handler: HttpIn.doWithdraw,
          requestBody: Schema.WalletWithdraw,
          responses: {
            201: Schema.WalletTransaction,
            400: Schema.Str,
            500: Schema.Str
          }
        }
      }
    }
  }
}
