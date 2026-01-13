import { drizzle } from "drizzle-orm/mysql2";
import { eq, desc, sql, and, gte, lte, inArray } from "drizzle-orm";
import { 
  InsertUser, users, 
  contacts, InsertContact, Contact, 
  testimonials, InsertTestimonial, Testimonial, 
  chatbotFaqs, InsertChatbotFaq, ChatbotFaq,
  appointments, InsertAppointment, Appointment,
  dailyMetrics, InsertDailyMetric, DailyMetric,
  auditLogs, InsertAuditLog, AuditLog,
  gallery, InsertGalleryImage, GalleryImage,
  settings, InsertSetting, Setting,
  contentBlocks, InsertContentBlock, ContentBlock
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

/**
 * Inicializa y retorna la instancia de la base de datos (Singleton).
 * @returns {Promise<ReturnType<typeof drizzle> | null>} Instancia de Drizzle ORM.
 * @throws {Error} Si la conexión falla.
 */
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.error("[Database] Connection Error:", error);
      throw new Error("No se pudo conectar a la base de datos");
    }
  }
  return _db;
}

/**
 * Wrapper genérico para ejecutar consultas con manejo de errores y logging centralizado.
 * @template T - El tipo de retorno de la consulta.
 * @param {(db: any) => Promise<T>} fn - Función que contiene la lógica de la consulta.
 * @returns {Promise<T>} El resultado de la consulta.
 */
async function runQuery<T>(fn: (db: NonNullable<ReturnType<typeof drizzle>>) => Promise<T>): Promise<T> {
  const db = await getDb();
  if (!db) throw new Error("Base de datos no disponible");
  try {
    return await fn(db as any);
  } catch (error) {
    console.error("[Database Query Error]:", error);
    throw error;
  }
}

// ==================== USER FUNCTIONS ====================

/**
 * Crea o actualiza un usuario basado en su openId.
 * @param {InsertUser} user - Datos del usuario a insertar o actualizar.
 */
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

/**
 * Busca un usuario por su identificador único de plataforma (openId).
 * @param {string} openId - El ID único del usuario.
 * @returns {Promise<User | undefined>} El usuario encontrado o undefined.
 */
export async function getUserByOpenId(openId: string) {
  return runQuery(async (db) => {
    const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
    return result[0];
  });
}

export async function getUserByEmail(email: string) {
  return runQuery(async (db) => {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  });
}

export async function getAllUsers() {
  return runQuery(async (db) => {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  });
}

export async function deleteUser(id: number) {
  return runQuery(async (db) => {
    await db.delete(users).where(eq(users.id, id));
  });
}

export async function createUser(user: InsertUser): Promise<void> {
  return runQuery(async (db) => {
    await db.insert(users).values({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    });
  });
}

export async function updateUser(id: number, data: Partial<InsertUser>): Promise<void> {
  return runQuery(async (db) => {
    await db.update(users).set({
      ...data,
      updatedAt: new Date(),
    }).where(eq(users.id, id));
  });
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

export async function getAppointmentById(id: number): Promise<Appointment | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
  return result[0];
}

export async function updateAppointment(id: number, data: Partial<InsertAppointment>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(appointments).set(data).where(eq(appointments.id, id));
}

export async function deleteAppointment(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(appointments).where(eq(appointments.id, id));
}

export async function checkAppointmentAvailability(date: Date): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  // Get all appointments (pending and confirmed)
  const allAppointments = await db.select().from(appointments)
    .where(inArray(appointments.status, ['pendiente' as const, 'confirmada' as const]));

  // Check if any appointment is at the exact same hour
  // We compare: same year, month, day, and hour
  for (const apt of allAppointments) {
    const aptDate = apt.appointmentDate instanceof Date ? apt.appointmentDate : new Date(apt.appointmentDate);
    const isSameDateTime = 
      date.getFullYear() === aptDate.getFullYear() &&
      date.getMonth() === aptDate.getMonth() &&
      date.getDate() === aptDate.getDate() &&
      date.getHours() === aptDate.getHours();
    
    if (isSameDateTime) {
      return false; // Slot is occupied
    }
  }

  return true; // Slot is available
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

// ==================== AUDIT LOG FUNCTIONS ====================

/**
 * Registra una acción administrativa en el log de auditoría.
 * @param {InsertAuditLog} data - Datos de la acción realizada.
 */
export async function createAuditLog(data: InsertAuditLog): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(auditLogs).values(data);
  } catch (error) {
    console.error("[Database] Failed to create audit log:", error);
  }
}

/**
 * Obtiene los registros de auditoría más recientes.
 * @param {number} limit - Cantidad máxima de registros a retornar.
 * @returns {Promise<AuditLog[]>} Lista de registros de auditoría.
 */
export async function getRecentAuditLogs(limit: number = 50): Promise<AuditLog[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
}

// Alias para compatibilidad con routers
export const getAuditLogs = getRecentAuditLogs;

// ==================== GALLERY FUNCTIONS ====================

export async function createGalleryImage(data: InsertGalleryImage): Promise<GalleryImage> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(gallery).values(data);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(gallery).where(eq(gallery.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function getAllGalleryImages(): Promise<GalleryImage[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(gallery).orderBy(desc(gallery.displayOrder), desc(gallery.createdAt));
}

export async function getActiveGalleryImages(): Promise<GalleryImage[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(gallery)
    .where(eq(gallery.isActive, true))
    .orderBy(desc(gallery.displayOrder), desc(gallery.createdAt));
}

export async function updateGalleryImage(id: number, data: Partial<InsertGalleryImage>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(gallery).set(data).where(eq(gallery.id, id));
}

export async function deleteGalleryImage(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(gallery).where(eq(gallery.id, id));
}

// ==================== SETTINGS FUNCTIONS ====================

// Default values for settings
const DEFAULT_SETTINGS: Record<string, string> = {
  site_phone: '15 3070-7350',
  site_email: 'swindoncollege2@gmail.com',
  site_address: 'Carapachay, Buenos Aires',
  site_hours: 'Lunes a Viernes: 9:00 - 20:00',
  feature_inscriptions: 'true',
  feature_chatbot: 'true',
};

export async function getSetting(key: string): Promise<string> {
  const db = await getDb();
  if (!db) return DEFAULT_SETTINGS[key] || '';

  try {
    const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
    return result.length > 0 ? result[0].value : (DEFAULT_SETTINGS[key] || '');
  } catch (error) {
    console.error(`[Database] Failed to get setting ${key}:`, error);
    return DEFAULT_SETTINGS[key] || '';
  }
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.insert(settings).values({ key, value }).onDuplicateKeyUpdate({
      set: { value, updatedAt: new Date() }
    });
    console.log(`[Settings] Updated ${key} = ${value}`);
  } catch (error) {
    console.error(`[Database] Failed to set setting ${key}:`, error);
    throw error;
  }
}

// ==================== MIGRATION FUNCTIONS ====================

export async function runMigrations(): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available for migrations");

  console.log("[Database] Running auto-migrations (ensuring tables exist)...");
  
  try {
    const tables = [
      `CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        \`key\` VARCHAR(100) NOT NULL UNIQUE,
        value TEXT NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        url TEXT NOT NULL,
        caption VARCHAR(255),
        displayOrder INT DEFAULT 0,
        isActive BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(255),
        action VARCHAR(100) NOT NULL,
        entityType VARCHAR(50),
        entityId INT,
        details TEXT,
        ipAddress VARCHAR(45),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `ALTER TABLE contacts ADD COLUMN IF NOT EXISTS utmSource VARCHAR(100)`,
      `ALTER TABLE contacts ADD COLUMN IF NOT EXISTS utmMedium VARCHAR(100)`,
      `ALTER TABLE contacts ADD COLUMN IF NOT EXISTS utmCampaign VARCHAR(100)`,
      `ALTER TABLE contacts ADD COLUMN IF NOT EXISTS referrer TEXT`
    ];

    for (const sqlQuery of tables) {
      await db.execute(sql.raw(sqlQuery));
    }
    
    console.log("[Database] Auto-migrations completed successfully.");
  } catch (error) {
    console.error("[Database] Migration error:", error);
  }
}



// ==================== CONTENT BLOCKS FUNCTIONS ====================

export async function getAllContentBlocks() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(contentBlocks).orderBy(contentBlocks.page, contentBlocks.section);
}

export async function getContentBlockByKey(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(contentBlocks).where(eq(contentBlocks.key, key)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getContentBlockValue(key: string): Promise<string | undefined> {
  const block = await getContentBlockByKey(key);
  if (!block) return undefined;
  // Return edited value if exists, otherwise return default value
  return block.value || block.defaultValue;
}

export async function updateContentBlock(key: string, value: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contentBlocks).set({ value }).where(eq(contentBlocks.key, key));
}

export async function resetContentBlock(key: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contentBlocks).set({ value: null }).where(eq(contentBlocks.key, key));
}

export async function seedContentBlocks(blocks: InsertContentBlock[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  for (const block of blocks) {
    const existing = await getContentBlockByKey(block.key);
    if (!existing) {
      await db.insert(contentBlocks).values(block);
    }
  }
}
