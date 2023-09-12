import fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'

const app = fastify()

app.register(cookie)

app.register(transactionsRoutes, {
  // this allows me to specify the name of the route once, instead of writing it in every transactionsRoutes
  prefix: 'transactions',
})

app.listen({
  port: env.PORT,
})
