'use server'

import { mg } from '@/lib/mailgun'
export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string
  subject: string
  text: string
}) {
  if (!process.env.MAILGUN_API_KEY) {
    throw new Error('MAILGUN_API_KEY environment variable is not set')
  }
  if (!process.env.MAILGUN_DOMAIN) {
    throw new Error('MAILGUN_DOMAIN environment variable is not set')
  }
  if (!process.env.EMAIL_FROM) {
    throw new Error('EMAIL_FROM environment variable is not set')
  }

  try {
    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.EMAIL_FROM,
      to: to.toLowerCase().trim(),
      subject: subject.trim(),
      text: text.trim(),
    })

    return {
      success: true,
      messageId: response.id,
    }
  } catch (error) {
    console.error('Error sending email with Mailgun:', error)
    return {
      success: false,
      message: 'Failed to send email. Please try again later.',
    }
  }
}

export const sendInviteEmail = async ({
  to,
  inviteLink,
  workspaceName,
}: {
  to: string
  inviteLink: string
  workspaceName: string
}) => {
  const subject = `You're invited to join ${workspaceName} on Lynk`
  const text = `
Hey there,

You've been invited to join the workspace "${workspaceName}" on Lynk.

Click the link below to accept the invitation:
${inviteLink}

Note: This invite link will expire in 7 days. If you weren't expecting this invite, feel free to ignore it.

Cheers,  
Team Lynk
  `.trim()

  return await sendEmail({ to, subject, text })
}
