import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  test('user should create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New automated test transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  test('list all users transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New automated test transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookie = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie)
      .expect(200)

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New automated test transaction',
        amount: 5000,
      }),
    ])
  })

  test('get a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New automated test transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookie = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie)
      .expect(200)

    const transactionId = listTransactionResponse.body.transactions[0].id

    const singleTransaction = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookie)
      .expect(200)

    expect(singleTransaction.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New automated test transaction',
        amount: 5000,
      }),
    )
  })

  test('get the summary', async () => {
    const creditResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New credit transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookie = creditResponse.get('Set-Cookie')

    await request(app.server).post('/transactions').set('Cookie', cookie).send({
      title: 'New debit transaction',
      amount: 2000,
      type: 'debit',
    })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookie)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual(
      expect.objectContaining({
        summary: 3000,
      }),
    )
  })
})
