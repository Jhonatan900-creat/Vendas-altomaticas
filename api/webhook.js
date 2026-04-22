import Stripe from 'stripe';
import { buffer } from 'micro';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const emailCliente = event.data.object.customer_details.email;
    const linkDownload = 'https://SEU_LINK_DO_ARQUIVO_AQUI';
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailCliente,
      subject: "Seu download está pronto",
      html: `<p>Valeu! Baixa aqui: <a href="${linkDownload}">Link do produto</a></p>`
    });
  }
  res.json({ received: true });
      }
