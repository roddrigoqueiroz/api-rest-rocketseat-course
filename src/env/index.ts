import 'dotenv/config'
import { z } from 'zod'

const eventSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'testing', 'production'])
    .default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})

const _env = eventSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variable', _env.error.format())

  throw new Error('Invalid environment variable')
}

export const env = _env.data
