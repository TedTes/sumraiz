import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/database/prisma';
import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';

export async function POST(request) {
  try {
    const body = await request.text();
    const headersList = headers();
    
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
    

    // Convert headers to a format Polar SDK expects
    const headersObject = {};
    headersList.forEach((value, key) => {
        headersObject[key] = value;
    });

      // Verify webhook signature using Polar SDK
      let event;
      try {
        event = validateEvent(
          body,
          headersObject,
          webhookSecret
        );
      } catch (error) {
        if (error instanceof WebhookVerificationError) {
          console.error('❌ Webhook signature verification failed:', error.message);
          return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
        }
        throw error;
      }

    
    // Log webhook for debugging
    await prisma.webhook.create({
      data: {
        eventType: event.type,
        eventId: event.id,
        data: event,
        processed: false
      }
    });
    
    // Handle different event types
    switch (event.type) {
      case 'checkout.created':
        await handleCheckoutCreated(event);
        break;
        
      case 'subscription.created':
        await handleSubscriptionCreated(event);
        break;
        
      case 'subscription.updated':
        await handleSubscriptionUpdated(event);
        break;
        
      case 'subscription.canceled':
        await handleSubscriptionCanceled(event);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    // Mark webhook as processed
    await prisma.webhook.update({
      where: { eventId: event.id },
      data: { 
        processed: true,
        processedAt: new Date()
      }
    });
    
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    
    // Try to log the error if we have event data
    try {
      const event = JSON.parse(await request.text());
      await prisma.webhook.update({
        where: { eventId: event.id },
        data: { 
          processingError: error.message,
          processedAt: new Date()
        }
      });
    } catch (logError) {
      console.error('Failed to log webhook error:', logError);
    }
    
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Handle successful checkout
async function handleCheckoutCreated(event) {
  const { metadata, customer_id } = event.data;
  const clerkUserId = metadata?.userId;
  const plan = metadata.plan;
  if (!clerkUserId) {
    throw new Error('No userId in checkout metadata');
  }
  
  // Find or create user
  let user = await prisma.user.upsert({
    where: { clerkUserId },
    update: { plan: plan },
    create: {
      clerkUserId,
      plan: plan
    }
  });
  
  // Update usage limits for pro/starter plan
  await prisma.usage.upsert({
    where: { userId: user.id },
    update: { limit: plan==='starter'?15:50 }, // Unlimited for pro
    create: {
      userId: user.id,
      count: 0,
      limit: plan === 'starter' ? 15 : 50,
      resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });
  
  console.log(`✅ Checkout completed for user: ${clerkUserId}`);
}

// Handle subscription creation
async function handleSubscriptionCreated(event) {
  const subscription = event.data;
  const {userId,plan} = subscription.metadata;
  if (!userId) return;
  
  const user = await prisma.user.findUnique({
    where: { userId }
  });
  
  if (!user) return;
  
  // Create subscription record
  await prisma.subscription.create({
    data: {
      userId: user.id,
      polarSubscriptionId: subscription.id,
      polarCustomerId: subscription.customer_id,
      status: subscription.status,
      plan: plan,
      features: plan === 'starter' 
        ? ['single_model', 'basic_export'] 
        : ['multi_model', 'priority_processing', 'advanced_export'],
      currentPeriodStart: new Date(subscription.current_period_start),
      currentPeriodEnd: new Date(subscription.current_period_end),
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false
    }
  });
  
  console.log(`✅ Subscription created for user: ${userId}`);
}

// Handle subscription updates
async function handleSubscriptionUpdated(event) {
  const subscription = event.data;
  
  await prisma.subscription.update({
    where: { polarSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start),
      currentPeriodEnd: new Date(subscription.current_period_end),
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false
    }
  });
  
  // If subscription is canceled/expired, downgrade user
  if (['canceled', 'past_due', 'unpaid'].includes(subscription.status)) {
    const sub = await prisma.subscription.findUnique({
      where: { polarSubscriptionId: subscription.id },
      include: { user: true }
    });
    
    if (sub) {
      await prisma.user.update({
        where: { id: sub.userId },
        data: { plan: 'free' }
      });
      
      // Reset usage limits
      await prisma.usage.update({
        where: { userId: sub.userId },
        data: { limit: 3 }
      });
    }
  }
  
  console.log(`✅ Subscription updated: ${subscription.id}`);
}

// Handle subscription cancellation
async function handleSubscriptionCanceled(event) {
  const subscription = event.data;
  
  const sub = await prisma.subscription.update({
    where: { polarSubscriptionId: subscription.id },
    data: { status: 'canceled' },
    include: { user: true }
  });
  
  // Downgrade user to free plan
  await prisma.user.update({
    where: { id: sub.userId },
    data: { plan: 'free' }
  });
  
  // Reset usage limits
  await prisma.usage.update({
    where: { userId: sub.userId },
    data: { limit: 3 }
  });
  
  console.log(`✅ Subscription canceled for user: ${sub.user.clerkUserId}`);
}