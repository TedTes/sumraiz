// lib/polar.js
import { Polar } from '@polar-sh/sdk'

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN
})

export async function createCheckout(productId, customerId) {
  return await polar.checkouts.create({
    productId,
    customerId,
    successUrl: `${process.env.NEXT_PUBLIC_URL}/success`,
    cancelUrl: `${process.env.NEXT_PUBLIC_URL}/cancel`
  })
}