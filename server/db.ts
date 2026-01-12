import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  contacts, InsertContact, Contact, 
  testimonials, InsertTestimonial, Testimonial, 
  chatbotFaqs, InsertChatbotFaq, ChatbotFaq,
  appointments, InsertAppointment, Appointment,
  dailyMetrics, InsertDailyMetric, DailyMetric
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ==================== USER FUNCTIONS ====================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ==================== CONTACT FUNCTIONS ====================

export async function createContact(data: InsertContact): Promise<Contact> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(contacts).values(data);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(contacts).where(eq(contacts.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function getAllContacts(filters?: { 
  status?: string; 
  contactType?: string;
  search?: string;
}): Promise<Contact[]> {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(contacts);
  
  // Apply filters if provided
  const conditions = [];
  if (filters?.status) {
    conditions.push(eq(contacts.status, filters.status as any));
  }
  if (filters?.contactType) {
    conditions.push(eq(contacts.contactType, filters.contactType as any));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  const result = await query.orderBy(desc(contacts.createdAt));
  return result;
}

export async function getContactById(id: number): Promise<Contact | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
  return result[0];
}

export async function updateContact(id: number, data: Partial<InsertContact>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(contacts).set(data).where(eq(contacts.id, id));
}

export async function deleteContact(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(contacts).where(eq(contacts.id, id));
}

// ==================== TESTIMONIAL FUNCTIONS ====================

export async function createTestimonial(data: InsertTestimonial): Promise<Testimonial> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(testimonials).values(data);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(testimonials).where(eq(testimonials.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(testimonials).orderBy(desc(testimonials.displayOrder), desc(testimonials.createdAt));
}

export async function getActiveTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(testimonials)
    .where(eq(testimonials.isActive, true))
    .orderBy(desc(testimonials.displayOrder), desc(testimonials.createdAt));
}

export async function updateTestimonial(id: number, data: Partial<InsertTestimonial>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(testimonials).set(data).where(eq(testimonials.id, id));
}

export async function deleteTestimonial(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(testimonials).where(eq(testimonials.id, id));
}

// ==================== CHATBOT FAQ FUNCTIONS ====================

export async function createFaq(data: InsertChatbotFaq): Promise<ChatbotFaq> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(chatbotFaqs).values(data);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(chatbotFaqs).where(eq(chatbotFaqs.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function getAllFaqs(): Promise<ChatbotFaq[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(chatbotFaqs).orderBy(desc(chatbotFaqs.displayOrder), desc(chatbotFaqs.createdAt));
}

export async function getActiveFaqs(): Promise<ChatbotFaq[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(chatbotFaqs)
    .where(eq(chatbotFaqs.isActive, true))
    .orderBy(desc(chatbotFaqs.displayOrder), desc(chatbotFaqs.createdAt));
}

export async function updateFaq(id: number, data: Partial<InsertChatbotFaq>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(chatbotFaqs).set(data).where(eq(chatbotFaqs.id, id));
}

export async function deleteFaq(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(chatbotFaqs).where(eq(chatbotFaqs.id, id));
}

// ==================== APPOINTMENT FUNCTIONS ====================

export async function createAppointment(data: InsertAppointment): Promise<Appointment> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(appointments).values(data);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(appointments).where(eq(appointments.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function getAllAppointments(): Promise<Appointment[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(appointments).orderBy(desc(appointments.appointmentDate));
}

export async function updateAppointment(id: number, data: Partial<InsertAppointment>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(appointments).set(data).where(eq(appointments.id, id));
}

export async function checkAppointmentAvailability(date: Date): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db.select().from(appointments)
    .where(and(
      eq(appointments.appointmentDate, date),
      eq(appointments.status, 'pendiente')
    )).limit(1);
  
  const confirmed = await db.select().from(appointments)
    .where(and(
      eq(appointments.appointmentDate, date),
      eq(appointments.status, 'confirmada')
    )).limit(1);

  return result.length === 0 && confirmed.length === 0;
}

// ==================== METRICS FUNCTIONS ====================

export async function trackMetric(type: 'pageViews' | 'contactSubmissions' | 'appointmentBookings' | 'chatbotInteractions'): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const existing = await db.select().from(dailyMetrics).where(eq(dailyMetrics.date, today)).limit(1);
    
    if (existing.length > 0) {
      const updateData: any = {};
      updateData[type] = existing[0][type] + 1;
      await db.update(dailyMetrics).set(updateData).where(eq(dailyMetrics.id, existing[0].id));
    } else {
      const newData: any = { date: today };
      newData[type] = 1;
      await db.insert(dailyMetrics).values(newData);
    }
  } catch (error) {
    console.error("[Database] Failed to track metric:", error);
  }
}

export async function getRecentMetrics(days: number = 7): Promise<DailyMetric[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(dailyMetrics).orderBy(desc(dailyMetrics.date)).limit(days);
}
