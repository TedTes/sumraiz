import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { Polar } from '@polar-sh/sdk';

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
});

export async function POST(request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId } = await request.json();

    // Create checkout session with Polar
    const checkout = await polar.checkouts.create({
      productPriceId: priceId,
      customerId: userId, // Use Clerk user ID as customer ID
      successUrl: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_URL}/cancel`,
      metadata: {
        userId: userId,
        plan: 'pro'
      }
    });

    return NextResponse.json({ 
      checkoutUrl: checkout.url,
      checkoutId: checkout.id 
    });

  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' }, 
      { status: 500 }
    );
  }
}