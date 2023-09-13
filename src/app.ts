import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)

app.register(transactionsRoutes, {
  // this allows me to specify the name of the route once, instead of writing it in every transactionsRoutes
  prefix: 'transactions',
})
