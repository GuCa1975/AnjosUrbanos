import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  getSalonByUserId: vi.fn(),
  getSubscriptionByUserId: vi.fn(),
  getActiveSubscriptionByUserId: vi.fn(),
  getAllUsers: vi.fn().mockResolvedValue([]),
  getAllSalons: vi.fn().mockResolvedValue([]),
  getAllSubscriptions: vi.fn().mockResolvedValue([]),
  createSalon: vi.fn(),
  updateSalon: vi.fn(),
  createSubscription: vi.fn(),
  updateSubscriptionByStripeId: vi.fn(),
}));

// Mock Stripe
vi.mock("stripe", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      customers: { create: vi.fn() },
      products: { create: vi.fn() },
      prices: { create: vi.fn() },
      checkout: { sessions: { create: vi.fn() } },
      billingPortal: { sessions: { create: vi.fn() } },
      subscriptions: { retrieve: vi.fn() },
      webhooks: { constructEvent: vi.fn() },
    })),
  };
});

import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createUserContext(role: "user" | "admin" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("subscription.hasAccess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns true for admin users without checking subscription", async () => {
    const ctx = createUserContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.subscription.hasAccess();
    expect(result).toBe(true);
    // Should NOT query the database for admin
    expect(db.getActiveSubscriptionByUserId).not.toHaveBeenCalled();
  });

  it("returns true for users with active subscription", async () => {
    vi.mocked(db.getActiveSubscriptionByUserId).mockResolvedValue({
      id: 1,
      userId: 1,
      salonId: null,
      stripeSubscriptionId: "sub_test",
      stripeCustomerId: "cus_test",
      stripePriceId: "price_test",
      status: "active",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(),
      cancelAtPeriodEnd: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const ctx = createUserContext("user");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.subscription.hasAccess();
    expect(result).toBe(true);
    expect(db.getActiveSubscriptionByUserId).toHaveBeenCalledWith(1);
  });

  it("returns false for users without active subscription", async () => {
    vi.mocked(db.getActiveSubscriptionByUserId).mockResolvedValue(undefined);

    const ctx = createUserContext("user");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.subscription.hasAccess();
    expect(result).toBe(false);
  });
});

describe("subscription.get", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns admin status object for admin users", async () => {
    const ctx = createUserContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.subscription.get();
    expect(result).toEqual({ status: "active", isAdmin: true });
  });

  it("returns null when user has no subscription", async () => {
    vi.mocked(db.getSubscriptionByUserId).mockResolvedValue(undefined);

    const ctx = createUserContext("user");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.subscription.get();
    expect(result).toBeNull();
  });
});

describe("admin.getStats", () => {
  it("throws FORBIDDEN for non-admin users", async () => {
    const ctx = createUserContext("user");
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.getStats()).rejects.toThrow("Acesso restrito a administradores");
  });

  it("returns stats for admin users", async () => {
    vi.mocked(db.getAllUsers).mockResolvedValue([
      { id: 1, openId: "u1", name: "User 1", email: null, loginMethod: null, role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    ]);
    vi.mocked(db.getAllSalons).mockResolvedValue([]);
    vi.mocked(db.getAllSubscriptions).mockResolvedValue([]);

    const ctx = createUserContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.getStats();
    expect(result).toMatchObject({
      totalUsers: 1,
      totalSalons: 0,
      activeSubscriptions: 0,
      monthlyRevenue: 0,
    });
  });
});

describe("auth.me", () => {
  it("returns null for unauthenticated requests", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user for authenticated requests", async () => {
    const ctx = createUserContext("user");
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toMatchObject({ email: "test@example.com", role: "user" });
  });
});
