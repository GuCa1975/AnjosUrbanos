// Stripe Products & Prices for Anjos Urbanos Virtual
// Monthly subscription: 29€/month per salon

export const SUBSCRIPTION_PRICE = {
  amount: 2900, // 29.00 EUR in cents
  currency: "eur",
  interval: "month" as const,
  name: "Anjos Urbanos Virtual - Subscrição Mensal",
  description: "Acesso completo à plataforma de simulação de penteados com IA para o seu salão",
};

// This price ID will be created dynamically on first checkout if not set
// Or set it here after creating in Stripe Dashboard
export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || null;
