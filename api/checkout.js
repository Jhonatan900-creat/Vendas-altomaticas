import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'pix'],
    line_items: [{
      price_data: {
        currency: 'brl',
        product_data: { name: 'Seu Produto Digital' },
        unit_amount: 4700,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${req.headers.origin}/obrigado.html`,
    cancel_url: `${req.headers.origin}/`,
  });
  res.status(200).json({ id: session.id });
}
