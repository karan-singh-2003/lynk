import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { priceIdToPlan } from '@/lib/stripePlanMap'

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature') || ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error(' Webhook signature verification failed:', err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      // ✅ Recommended: React to successful invoice payments
      case 'invoice.payment_succeeded': {
        console.log(' Invoice payment succeeded event received')
        const invoice = event.data.object as Stripe.Invoice

        const email = invoice.customer_email
        const subId =
          invoice.subscription ||
          invoice?.parent?.subscription_details?.subscription
        const priceId = invoice.lines.data?.[0]?.pricing?.price_details?.price

        if (!email || !subId || !priceId) {
          console.warn('⚠️ Missing email, subscription ID, or price ID')
          break
        }

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          console.error('❌ User not found for email:', email)
          break
        }

        const plan =
          priceIdToPlan[priceId as keyof typeof priceIdToPlan] || 'FREE'

        await prisma.$transaction([
          prisma.user.update({
            where: { email },
            data: { currentPlan: plan },
          }),
          prisma.subscription.upsert({
            where: { providerId: subId },
            create: {
              userId: user.id,
              plan,
              status: 'active',
              provider: 'STRIPE',
              providerId: subId,
              startedAt: new Date(invoice.period_start * 1000),
              currentPeriodEnd: new Date(invoice.period_end * 1000),
              cancelAtPeriodEnd: false, // You can adjust this later
            },
            update: {
              plan,
              status: 'active',
              currentPeriodEnd: new Date(invoice.period_end * 1000),
              cancelAtPeriodEnd: false,
            },
          }),
        ])

        console.log(`✅ ${email} paid successfully for ${plan} plan`)
        break
      }

      // Optional: Keep these for future use
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription

        const existing = await prisma.subscription.findUnique({
          where: { providerId: sub.id },
          include: { user: true },
        })

        if (!existing) break

        const plan =
          priceIdToPlan[
            sub.items.data[0].price.id as keyof typeof priceIdToPlan
          ] || 'FREE'

        await prisma.$transaction([
          prisma.user.update({
            where: { id: existing.userId },
            data: { currentPlan: plan },
          }),
          prisma.subscription.update({
            where: { providerId: sub.id },
            data: {
              plan,
              status: sub.status,
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
              cancelAtPeriodEnd: sub.cancel_at_period_end,
            },
          }),
        ])

        console.log(`🔁 Subscription updated for ${existing.user.email}`)
        break
      }

      default:
        console.log(`🔔 Unhandled event type: ${event.type}`)
    }

    return new NextResponse('Webhook handled successfully', { status: 200 })
  } catch (err) {
    console.error('⚠️ Webhook handler error:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
