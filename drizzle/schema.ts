import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, date } from "drizzle-orm/mysql-core";

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
 * Student levels (Beginner, Elementary, Pre-Intermediate, etc.)
 */
export const levels = mysqlTable("levels", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  color: varchar("color", { length: 20 }).default("#1a6b6b"),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Level = typeof levels.$inferSelect;
export type InsertLevel = typeof levels.$inferInsert;

/**
 * Students with auto-generated credentials
 */
export const students = mysqlTable("students", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordPlain: varchar("passwordPlain", { length: 100 }).notNull(), // Stored for admin recovery
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  levelId: int("levelId").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  lastLogin: timestamp("lastLogin"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;

/**
 * Classes/Lessons uploaded by professors
 */
export const classes = mysqlTable("classes", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  levelId: int("levelId").notNull(),
  classDate: date("classDate").notNull(),
  videoUrl: text("videoUrl"),
  videoKey: varchar("videoKey", { length: 255 }),
  homeworkPdfUrl: text("homeworkPdfUrl"),
  homeworkPdfKey: varchar("homeworkPdfKey", { length: 255 }),
  homeworkDescription: text("homeworkDescription"),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Class = typeof classes.$inferSelect;
export type InsertClass = typeof classes.$inferInsert;

/**
 * Standalone homework/tasks (not attached to a class)
 */
export const homeworks = mysqlTable("homeworks", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  levelId: int("levelId").notNull(),
  dueDate: date("dueDate"),
  pdfUrl: text("pdfUrl"),
  pdfKey: varchar("pdfKey", { length: 255 }),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Homework = typeof homeworks.$inferSelect;
export type InsertHomework = typeof homeworks.$inferInsert;

/**
 * Track which classes students have viewed
 */
export const classViews = mysqlTable("class_views", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  classId: int("classId").notNull(),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});

export type ClassView = typeof classViews.$inferSelect;
export type InsertClassView = typeof classViews.$inferInsert;

/**
 * Track homework completion by students
 */
export const homeworkCompletions = mysqlTable("homework_completions", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  homeworkId: int("homeworkId"),
  classId: int("classId"), // For class-attached homework
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type HomeworkCompletion = typeof homeworkCompletions.$inferSelect;
export type InsertHomeworkCompletion = typeof homeworkCompletions.$inferInsert;

/**
 * Contact form submissions from potential students
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

/**
 * Site settings for dynamic content
 */
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 100 }).notNull().unique(),
  settingValue: text("settingValue"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;
