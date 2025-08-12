import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

import * as schema from '@/db/schema'

const connection = await mysql.createConnection({
  uri: process.env.DATABASE_URL,
})

export const db = drizzle({
  client: connection,
  mode: 'default',
  casing: 'snake_case',
  schema,
})
