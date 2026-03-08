import Stripe from "stripe";
import express from "express";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { notifyOwner } from "./_core/notification";
import {
  createSalon,
  createSubscription,
  getActiveSubscriptionByUserId,
  getAllSalons,
  getAllSubscriptions,
  getAllUsers,
  getFreeSimulationsCount,
  getSalonByUserId,
  getSubscriptionByUserId,
  incrementFreeSimulations,
  updateSalon,
  updateSubscriptionByStripeId,
} from "./db";
import { SUBSCRIPTION_PRICE } from "./stripe/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-02-25.clover",
});

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito a administradores" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  salon: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return (await getSalonByUserId(ctx.user.id)) ?? null;
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(2),
        phone: z.string().optional(),
        address: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const existing = await getSalonByUserId(ctx.user.id);
        if (existing) throw new TRPCError({ code: "CONFLICT", message: "Salão já existe" });
        return createSalon({ userId: ctx.user.id, ...input });
      }),
    update: protectedProcedure
      .input(z.object({
        name: z.string().min(2).optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const salon = await getSalonByUserId(ctx.user.id);
        if (!salon) throw new TRPCError({ code: "NOT_FOUND", message: "Salão não encontrado" });
        await updateSalon(salon.id, input);
        return getSalonByUserId(ctx.user.id);
      }),
  }),

  subscription: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === "admin") return { status: "active", isAdmin: true };
      const sub = await getSubscriptionByUserId(ctx.user.id);
      return sub || null;
    }),
    hasAccess: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === "admin") return true;
      const sub = await getActiveSubscriptionByUserId(ctx.user.id);
      return !!sub;
    }),
    createCheckout: protectedProcedure
      .input(z.object({ origin: z.string() }))
      .mutation(async ({ ctx, input }) => {
        let customerId: string | undefined;
        const salon = await getSalonByUserId(ctx.user.id);
        if (salon?.stripeCustomerId) {
          customerId = salon.stripeCustomerId;
        } else {
          const customer = await stripe.customers.create({
            email: ctx.user.email || undefined,
            name: ctx.user.name || undefined,
            metadata: { userId: ctx.user.id.toString() },
          });
          customerId = customer.id;
          if (salon) await updateSalon(salon.id, { stripeCustomerId: customerId });
        }

        let priceId = process.env.STRIPE_PRICE_ID;
        if (!priceId) {
          const product = await stripe.products.create({
            name: SUBSCRIPTION_PRICE.name,
            description: SUBSCRIPTION_PRICE.description,
          });
          const price = await stripe.prices.create({
            product: product.id,
            unit_amount: SUBSCRIPTION_PRICE.amount,
            currency: SUBSCRIPTION_PRICE.currency,
            recurring: { interval: SUBSCRIPTION_PRICE.interval },
          });
          priceId = price.id;
        }

        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          mode: "subscription",
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: `${input.origin}/dashboard?subscription=success`,
          cancel_url: `${input.origin}/subscribe?canceled=true`,
          allow_promotion_codes: true,
          client_reference_id: ctx.user.id.toString(),
          subscription_data: {
            trial_period_days: 7,
          },
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
          },
        });
        return { url: session.url };
      }),
    createPortal: protectedProcedure
      .input(z.object({ origin: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const salon = await getSalonByUserId(ctx.user.id);
        if (!salon?.stripeCustomerId) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Cliente Stripe não encontrado" });
        }
        const session = await stripe.billingPortal.sessions.create({
          customer: salon.stripeCustomerId,
          return_url: `${input.origin}/dashboard`,
        });
        return { url: session.url };
      }),
  }),

  simulation: router({
    getStatus: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === 'admin') return { canSimulate: true, freeUsed: 0, freeLimit: 2, hasSubscription: true };
      const [sub, freeUsed] = await Promise.all([
        getActiveSubscriptionByUserId(ctx.user.id),
        getFreeSimulationsCount(ctx.user.id),
      ]);
      const hasSubscription = !!sub;
      const canSimulate = hasSubscription || freeUsed < 2;
      return { canSimulate, freeUsed, freeLimit: 2, hasSubscription };
    }),
    recordUsage: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role === 'admin') return { freeUsed: 0, freeLimit: 2, hasSubscription: true };
      const sub = await getActiveSubscriptionByUserId(ctx.user.id);
      if (sub) return { freeUsed: 0, freeLimit: 2, hasSubscription: true };
      const freeUsed = await getFreeSimulationsCount(ctx.user.id);
      if (freeUsed >= 2) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Limite de simulações gratuitas atingido. Subscreva para continuar.' });
      }
      const newCount = await incrementFreeSimulations(ctx.user.id);
      // Quando atinge a 2ª simulação gratuita, notificar o owner
      if (newCount >= 2) {
        try {
          await notifyOwner({
            title: `📊 Utilizador atingiu limite gratuito`,
            content: `O utilizador **${ctx.user.name || ctx.user.email}** (${ctx.user.email}) usou as 2 simulações gratuitas.\n\nEste é o momento ideal para fazer follow-up e converter em subscrição de 29€/mês.`,
          });
        } catch (e) {
          console.warn('[Simulation] Falha ao notificar owner:', e);
        }
      }
      return { freeUsed: newCount, freeLimit: 2, hasSubscription: false };
    }),
  }),

  admin: router({
    getStats: adminProcedure.query(async () => {
      const [allUsers, allSalons, allSubs] = await Promise.all([
        getAllUsers(), getAllSalons(), getAllSubscriptions(),
      ]);
      const activeSubs = allSubs.filter((s) => s.status === "active");
      return {
        totalUsers: allUsers.length,
        totalSalons: allSalons.length,
        activeSubscriptions: activeSubs.length,
        monthlyRevenue: activeSubs.length * 29,
        canceledSubscriptions: allSubs.filter((s) => s.status === "canceled").length,
      };
    }),
    getClients: adminProcedure.query(async () => {
      const [allUsers, allSalons, allSubs] = await Promise.all([
        getAllUsers(), getAllSalons(), getAllSubscriptions(),
      ]);
      return allUsers
        .filter((u) => u.role !== "admin")
        .map((user) => ({
          user,
          salon: allSalons.find((s) => s.userId === user.id) || null,
          subscription: allSubs.find((s) => s.userId === user.id) || null,
        }));
    }),
  }),
});

export type AppRouter = typeof appRouter;



export function registerStripeWebhook(app: import('express').Express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: any, res: any) => {
      const sig = req.headers["stripe-signature"];
      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
      } catch (err: any) {
        console.error("[Webhook] Signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected");
        return res.json({ verified: true });
      }
      console.log(`[Webhook] ${event.type} | ${event.id}`);
      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = parseInt(session.metadata?.user_id || "0");
            if (userId && session.subscription) {
              const stripeSub = await stripe.subscriptions.retrieve(session.subscription as string);
              const stripeSubAny = stripeSub as any;
              await createSubscription({
                userId,
                stripeSubscriptionId: stripeSub.id,
                stripeCustomerId: stripeSub.customer as string,
                stripePriceId: stripeSub.items.data[0]?.price.id,
                status: stripeSub.status as any,
                currentPeriodStart: stripeSubAny.current_period_start ? new Date(stripeSubAny.current_period_start * 1000) : undefined,
                currentPeriodEnd: stripeSubAny.current_period_end ? new Date(stripeSubAny.current_period_end * 1000) : undefined,
                cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
              });
            }
            break;
          }
          case "customer.subscription.updated": {
            const sub = event.data.object as Stripe.Subscription;
            const subAny = sub as any;
            await updateSubscriptionByStripeId(sub.id, {
              status: sub.status as any,
              currentPeriodStart: subAny.current_period_start ? new Date(subAny.current_period_start * 1000) : undefined,
              currentPeriodEnd: subAny.current_period_end ? new Date(subAny.current_period_end * 1000) : undefined,
              cancelAtPeriodEnd: sub.cancel_at_period_end,
            });
            break;
          }
          case "customer.subscription.deleted": {
            const sub = event.data.object as Stripe.Subscription;
            await updateSubscriptionByStripeId(sub.id, { status: "canceled" });
            break;
          }
          case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            const invoiceAny = invoice as any;
            if (invoiceAny.subscription) {
              await updateSubscriptionByStripeId(invoiceAny.subscription as string, { status: "past_due" });
            }
            break;
          }
        }
      } catch (err) {
        console.error("[Webhook] Error processing event:", err);
      }
      res.json({ received: true });
    }
  );
}
