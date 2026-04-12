import { boolean, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 312 }).notNull().unique(),
    password: text('password').notNull(),
    isVerified: boolean('is_verified').default(false),
    salt: text('salt').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const tokens = pgTable('tokens', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    refreshToken: text('refresh_token'),
    verifyToken: text('verify_token'),
    forgotPasswordToken: text('forgot_password_token'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    verifyExpiredAt: timestamp('verified_expired_at'),
    forgotPasswordExpiredAt: timestamp('forgot_password_expired_at'),
    expiredAt: timestamp('expired_at'),
});


// Inferred types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Token = typeof tokens.$inferSelect
export type NewToken = typeof tokens.$inferInsert