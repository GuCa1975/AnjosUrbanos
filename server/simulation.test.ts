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
  getFreeSimulationsCount: vi.fn().mockResolvedValue(0),
  incrementFreeSimulations: vi.fn().mockResolvedValue(1),
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

function createUserContext(role: "user" | "admin" = "user", id = 1, isPartner = false): TrpcContext {
  const user: AuthenticatedUser = {
    id,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    freeSimulations: 0,
    isPartner,
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("simulation.getStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns canSimulate=true for admin without checking DB", async () => {
    const ctx = createUserContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulation.getStatus();
    expect(result.canSimulate).toBe(true);
    expect(result.hasSubscription).toBe(true);
    expect(db.getActiveSubscriptionByUserId).not.toHaveBeenCalled();
    expect(db.getFreeSimulationsCount).not.toHaveBeenCalled();
  });

  it("returns canSimulate=true for partner without checking DB", async () => {
    const ctx = createUserContext("user", 1, true);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulation.getStatus();
    expect(result.canSimulate).toBe(true);
    expect(result.hasSubscription).toBe(true);
    expect(db.getActiveSubscriptionByUserId).not.toHaveBeenCalled();
    expect(db.getFreeSimulationsCount).not.toHaveBeenCalled();
  });

  it("returns canSimulate=true for user with 0 free simulations used", async () => {
    vi.mocked(db.getActiveSubscriptionByUserId).mockResolvedValue(undefined);
    vi.mocked(db.getFreeSimulationsCount).mockResolvedValue(0);

    const ctx = createUserContext("user");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulation.getStatus();
    expect(result.canSimulate).toBe(true);
    expect(result.freeUsed).toBe(0);
    expect(result.freeLimit).toBe(5);
    expect(result.hasSubscription).toBe(false);
  });

  it("returns canSimulate=true for user with 1 free simulation used", async () => {
    vi.mocked(db.getActiveSubscriptionByUserId).mockResolvedValue(undefined);
    vi.mocked(db.getFreeSimulationsCount).mockResolvedValue(1);

    const ctx = createUserContext("user");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulation.getStatus();
    expect(result.canSimulate).toBe(true);
    expect(result.freeUsed).toBe(1);
  });

  it("returns canSimulate=false for user who used all 5 free simulations", async () => {
    vi.mocked(db.getActiveSubscriptionByUserId).mockResolvedValue(undefined);
    vi.mocked(db.getFreeSimulationsCount).mockResolvedValue(5);

    const ctx = createUserContext("user");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulation.getStatus();
    expect(result.canSimulate).toBe(false);
    expect(result.freeUsed).toBe(5);
  });

  it("returns canSimulate=true for user with active subscription regardless of free count", async () => {
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
    vi.mocked(db.getFreeSimulationsCount).mockResolvedValue(99);

    const ctx = createUserContext("user");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulation.getStatus();
    expect(result.canSimulate).toBe(true);
    expect(result.hasSubscription).toBe(true);
  });
});

describe("simulation.recordUsage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success for admin without incrementing DB", async () => {
    const ctx = createUserContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulation.recordUsage();
    expect(result.hasSubscription).toBe(true);
    expect(db.incrementFreeSimulations).not.toHaveBeenCalled();
  });

  it("returns success for partner without incrementing DB", async () => {
    const ctx = createUserContext("user", 1, true);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulation.recordUsage();
    expect(result.hasSubscription).toBe(true);
    expect(db.incrementFreeSimulations).not.toHaveBeenCalled();
  });

  it("returns current free count for user with 0 used (no increment — counting done by /api/simulation/record)", async () => {
    vi.mocked(db.getActiveSubscriptionByUserId).mockResolvedValue(undefined);
    vi.mocked(db.getFreeSimulationsCount).mockResolvedValue(0);

    const ctx = createUserContext("user");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulation.recordUsage();
    // recordUsage only checks access, does NOT increment (counting is done by /api/simulation/record)
    expect(db.incrementFreeSimulations).not.toHaveBeenCalled();
    expect(result.freeUsed).toBe(0);
    expect(result.hasSubscription).toBe(false);
  });

  it("returns current free count for user with 1 used (no increment)", async () => {
    vi.mocked(db.getActiveSubscriptionByUserId).mockResolvedValue(undefined);
    vi.mocked(db.getFreeSimulationsCount).mockResolvedValue(1);

    const ctx = createUserContext("user");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulation.recordUsage();
    expect(db.incrementFreeSimulations).not.toHaveBeenCalled();
    expect(result.freeUsed).toBe(1);
  });

  it("throws FORBIDDEN when user has used all 5 free simulations", async () => {
    vi.mocked(db.getActiveSubscriptionByUserId).mockResolvedValue(undefined);
    vi.mocked(db.getFreeSimulationsCount).mockResolvedValue(5);

    const ctx = createUserContext("user");
    const caller = appRouter.createCaller(ctx);

    await expect(caller.simulation.recordUsage()).rejects.toThrow(
      "Limite de simulações gratuitas atingido"
    );
    expect(db.incrementFreeSimulations).not.toHaveBeenCalled();
  });

  it("does not increment for subscribed user", async () => {
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

    const result = await caller.simulation.recordUsage();
    expect(db.incrementFreeSimulations).not.toHaveBeenCalled();
    expect(result.hasSubscription).toBe(true);
  });
});
