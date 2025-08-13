import nodemailer from 'nodemailer'
import { render, toPlainText } from '@react-email/components'
import VerificationEmail from '@/components/emails/verification-email'
import PasswordResetEmail from '@/components/emails/reset-email'

async function createTransporter() {
  return nodemailer.createTransport(
    {
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE === 'true' || false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    },
    {
      from: {
        name: process.env.MAIL_FROM_NAME as string,
        address: process.env.MAIL_FROM_ADDRESS as string,
      },
    }
  )
}

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendMail(options: EmailOptions) {
  const transporter = await createTransporter()

  try {
    await transporter.sendMail({
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })
  } catch (error) {
    console.error('❌ Failed to sent email: ', error)
    throw error
  }
}

export async function sendVerificationEmail(
  userName: string,
  email: string,
  url: string
) {
  const subject = 'Verify your email address'

  const html = await render(
    VerificationEmail({
      userName,
      verificationUrl: url,
    })
  )

  const text = toPlainText(html)

  await sendMail({
    to: email,
    subject,
    html,
    text,
  })
}

export async function sendResetPasswordEmail(
  userName: string,
  email: string,
  url: string,
  requestTime: string
) {
  const subject = 'Reset your password'

  const html = await render(
    PasswordResetEmail({
      userName,
      resetUrl: url,
      requestTime,
    })
  )

  const text = toPlainText(html)

  await sendMail({
    to: email,
    subject,
    html,
    text,
  })
}
