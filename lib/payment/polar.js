
import {polar} from "../instances/polar";
export async function createCheckout(productId, customerId) {
  return await polar.checkouts.create({
    productId,
    customerId,
    successUrl: `${process.env.NEXT_PUBLIC_URL}/success`,
    cancelUrl: `${process.env.NEXT_PUBLIC_URL}/cancel`
  })
}