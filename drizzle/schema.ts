import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Contact form submissions from potential students and companies
 */
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  age: varchar("age", { length: 50 }),
  currentLevel: varchar("currentLevel", { length: 100 }),
  courseInterest: varchar("courseInterest", { length: 255 }),
  message: text("message"),
  contactType: mysqlEnum("contactType", ["individual", "empresa"]).default("individual").notNull(),
  companyName: varchar("companyName", { length: 255 }),
  employeeCount: varchar("employeeCount", { length: 50 }),
  source: varchar("source", { length: 100 }).default("website"),
  status: mysqlEnum("status", ["nuevo", "contactado", "en_proceso", "cerrado", "no_interesado"]).default("nuevo").notNull(),
  notes: text("notes"),
  emailSent: boolean("emailSent").default(false).notNull(),
  lastContactedAt: timestamp("lastContactedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

/**
 * Testimonials from students and parents
 */
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  authorRole: varchar("authorRole", { length: 100 }),
  content: text("content").notNull(),
  rating: int("rating").default(5),
  isActive: boolean("isActive").default(true).notNull(),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

/**
 * FAQ entries for the chatbot
 */
export const chatbotFaqs = mysqlTable("chatbot_faqs", {
  id: int("id").autoincrement().primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  keywords: text("keywords"),
  category: varchar("category", { length: 100 }),
  isActive: boolean("isActive").default(true).notNull(),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatbotFaq = typeof chatbotFaqs.$inferSelect;
export type InsertChatbotFaq = typeof chatbotFaqs.$inferInsert;
