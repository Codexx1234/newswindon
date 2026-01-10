import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database module
vi.mock("./db", () => ({
  createContact: vi.fn().mockResolvedValue({
    id: 1,
    fullName: "Test User",
    email: "test@example.com",
    phone: "123456789",
    contactType: "individual",
    status: "nuevo",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  getAllContacts: vi.fn().mockResolvedValue([
    {
      id: 1,
      fullName: "Test User",
      email: "test@example.com",
      phone: "123456789",
      contactType: "individual",
      status: "nuevo",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getContactStats: vi.fn().mockResolvedValue({
    total: 10,
    nuevo: 5,
    contactado: 3,
    en_proceso: 1,
    cerrado: 1,
  }),
  updateContactStatus: vi.fn().mockResolvedValue(undefined),
  deleteContact: vi.fn().mockResolvedValue(undefined),
  getActiveTestimonials: vi.fn().mockResolvedValue([
    {
      id: 1,
      authorName: "María González",
      authorRole: "Mamá de Sofía",
      content: "Excelente academia",
      rating: 5,
      isActive: true,
    },
  ]),
  getAllTestimonials: vi.fn().mockResolvedValue([]),
  createTestimonial: vi.fn().mockResolvedValue({ id: 1 }),
  updateTestimonial: vi.fn().mockResolvedValue(undefined),
  deleteTestimonial: vi.fn().mockResolvedValue(undefined),
  getActiveFaqs: vi.fn().mockResolvedValue([
    {
      id: 1,
      question: "¿Qué cursos ofrecen?",
      answer: "Ofrecemos cursos para todas las edades",
      category: "cursos",
      isActive: true,
    },
  ]),
  getAllFaqs: vi.fn().mockResolvedValue([]),
  createFaq: vi.fn().mockResolvedValue({ id: 1 }),
  updateFaq: vi.fn().mockResolvedValue(undefined),
  deleteFaq: vi.fn().mockResolvedValue(undefined),
}));

// Mock notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock LLM module
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: "Esta es una respuesta de prueba del chatbot.",
        },
      },
    ],
  }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("contacts.submit", () => {
  it("should create a contact successfully", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contacts.submit({
      fullName: "Test User",
      email: "test@example.com",
      phone: "123456789",
      contactType: "individual",
    });

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("contact");
    expect(result.contact).toHaveProperty("id");
  });

  it("should reject invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contacts.submit({
        fullName: "Test User",
        email: "invalid-email",
        contactType: "individual",
      })
    ).rejects.toThrow();
  });

  it("should reject short names", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contacts.submit({
        fullName: "A",
        email: "test@example.com",
        contactType: "individual",
      })
    ).rejects.toThrow();
  });
});

describe("contacts.list (admin)", () => {
  it("should return contacts for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contacts.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("fullName");
    expect(result[0]).toHaveProperty("email");
  });

  it("should reject non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.contacts.list()).rejects.toThrow("Acceso denegado");
  });
});

describe("contacts.stats (admin)", () => {
  it("should return contact statistics for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contacts.stats();

    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("nuevo");
    expect(result).toHaveProperty("contactado");
    expect(typeof result.total).toBe("number");
  });
});

describe("testimonials.list", () => {
  it("should return active testimonials for public users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.testimonials.list();

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("chatbot.chat", () => {
  it("should return a response for a user message", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chatbot.chat({
      message: "¿Qué cursos ofrecen?",
    });

    expect(result).toHaveProperty("response");
    expect(typeof result.response).toBe("string");
  });
});
