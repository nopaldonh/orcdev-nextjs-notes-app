import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'
import { nextCookies } from 'better-auth/next-js'
import { sendResetPasswordEmail, sendVerificationEmail } from './email'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'mysql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        await sendResetPasswordEmail(
          user.name,
          user.email,
          url,
          new Date().toLocaleString()
        )
      } catch (error) {
        console.error(error)
      }
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await sendVerificationEmail(user.name, user.email, url)
      } catch (error) {
        console.error(error)
      }
    },
    sendOnSignUp: true,
  },
  plugins: [nextCookies()],
})
