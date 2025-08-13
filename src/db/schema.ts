import { cuid } from '@/lib/cuid2'
import { relations, sql } from 'drizzle-orm'
import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
  int,
} from 'drizzle-orm/mysql-core'

export const user = mysqlTable('user', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const session = mysqlTable('session', {
  id: varchar('id', { length: 36 }).primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = mysqlTable('account', {
  id: varchar('id', { length: 36 }).primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verification = mysqlTable('verification', {
  id: varchar('id', { length: 36 }).primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp('updated_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
})

export const notebooks = mysqlTable('notebooks', {
  id: varchar({ length: 36 })
    .$defaultFn(() => cuid())
    .primaryKey(),
  name: text().notNull(),
  userId: varchar({ length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().onUpdateNow().notNull(),
})

export const notebookRelations = relations(notebooks, ({ many, one }) => ({
  notes: many(notes),
  user: one(user, {
    fields: [notebooks.userId],
    references: [user.id],
  }),
}))

export type Notebook = typeof notebooks.$inferSelect & {
  notes: Note[]
}
export type InsertNotebook = typeof notebooks.$inferInsert

export const notes = mysqlTable('notes', {
  id: varchar({ length: 36 })
    .$defaultFn(() => cuid())
    .primaryKey(),
  title: varchar({ length: 36 }).notNull(),
  content: text().notNull(),
  notebookId: varchar({ length: 36 })
    .notNull()
    .references(() => notebooks.id, { onDelete: 'cascade' }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().onUpdateNow().notNull(),
})

export const noteRelations = relations(notes, ({ one }) => ({
  notebook: one(notebooks, {
    fields: [notes.notebookId],
    references: [notebooks.id],
  }),
}))

export type Note = typeof notes.$inferSelect
export type InsertNote = typeof notes.$inferInsert
