import { Knex } from 'knex'

// up is what the knex will do
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary()
    table.text('title').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

// down is used for rollbacks, and should do the inverse of the up
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions')
}
