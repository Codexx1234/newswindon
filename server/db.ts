import { eq, desc, asc, and, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  contacts, InsertContact, Contact, 
  testimonials, InsertTestimonial, Testimonial, 
  chatbotFaqs, InsertChatbotFaq, ChatbotFaq, 
  siteSettings,
  levels, InsertLevel, Level,
  students, InsertStudent, Student,
  classes, InsertClass, Class,
  homeworks, InsertHomework, Homework,
  classViews, InsertClassView,
  homeworkCompletions, InsertHomeworkCompletion
} from "../drizzle/schema";
import { ENV } from './_core/env';
import * as crypto from 'crypto';

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

// Simple hash function for passwords
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
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

// ==================== LEVEL FUNCTIONS ====================

export async function createLevel(level: InsertLevel): Promise<Level | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(levels).values(level);
  const insertId = result[0].insertId;
  
  const newLevel = await db.select().from(levels).where(eq(levels.id, insertId)).limit(1);
  return newLevel[0] || null;
}

export async function getAllLevels(): Promise<Level[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(levels).orderBy(asc(levels.displayOrder));
}

export async function getActiveLevels(): Promise<Level[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(levels)
    .where(eq(levels.isActive, true))
    .orderBy(asc(levels.displayOrder));
}

export async function getLevelById(id: number): Promise<Level | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(levels).where(eq(levels.id, id)).limit(1);
  return result[0] || null;
}

export async function updateLevel(id: number, data: Partial<InsertLevel>): Promise<Level | null> {
  const db = await getDb();
  if (!db) return null;

  await db.update(levels).set(data).where(eq(levels.id, id));
  return await getLevelById(id);
}

export async function deleteLevel(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.delete(levels).where(eq(levels.id, id));
  return true;
}

// ==================== STUDENT FUNCTIONS ====================

export async function generateStudentCredentials(firstName: string, lastName: string): Promise<{ username: string; password: string }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Normalize names: lowercase, remove accents, replace spaces with dots
  const normalizedFirst = firstName.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '');
  const normalizedLast = lastName.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '');

  const baseUsername = `${normalizedFirst}.${normalizedLast}`;
  
  // Count existing students to generate unique number
  const allStudents = await db.select().from(students);
  const existingCount = allStudents.filter(s => 
    s.username.startsWith(baseUsername)
  ).length;
  
  const number = existingCount + 1;
  const username = baseUsername;
  const password = `${baseUsername}${number}`;

  return { username, password };
}

export async function createStudent(data: {
  firstName: string;
  lastName: string;
  levelId: number;
  email?: string;
  phone?: string;
  createdBy?: number;
}): Promise<Student | null> {
  const db = await getDb();
  if (!db) return null;

  const { username, password } = await generateStudentCredentials(data.firstName, data.lastName);
  
  const studentData: InsertStudent = {
    firstName: data.firstName,
    lastName: data.lastName,
    username,
    passwordPlain: password,
    passwordHash: hashPassword(password),
    levelId: data.levelId,
    email: data.email,
    phone: data.phone,
    createdBy: data.createdBy,
  };

  const result = await db.insert(students).values(studentData);
  const insertId = result[0].insertId;
  
  const newStudent = await db.select().from(students).where(eq(students.id, insertId)).limit(1);
  return newStudent[0] || null;
}

export async function getStudentByUsername(username: string): Promise<Student | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(students).where(eq(students.username, username)).limit(1);
  return result[0] || null;
}

export async function getStudentById(id: number): Promise<Student | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(students).where(eq(students.id, id)).limit(1);
  return result[0] || null;
}

export async function verifyStudentPassword(username: string, password: string): Promise<Student | null> {
  const db = await getDb();
  if (!db) return null;

  const student = await getStudentByUsername(username);
  if (!student || !student.isActive) return null;

  const passwordHash = hashPassword(password);
  if (student.passwordHash !== passwordHash) return null;

  // Update last login
  await db.update(students).set({ lastLogin: new Date() }).where(eq(students.id, student.id));

  return student;
}

export async function getAllStudents(filters?: { levelId?: number; search?: string }): Promise<Student[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (filters?.levelId) {
    conditions.push(eq(students.levelId, filters.levelId));
  }
  if (filters?.search) {
    conditions.push(
      sql`(${students.firstName} LIKE ${`%${filters.search}%`} OR ${students.lastName} LIKE ${`%${filters.search}%`} OR ${students.username} LIKE ${`%${filters.search}%`})`
    );
  }

  if (conditions.length > 0) {
    return await db.select().from(students).where(and(...conditions)).orderBy(desc(students.createdAt));
  }

  return await db.select().from(students).orderBy(desc(students.createdAt));
}

export async function updateStudent(id: number, data: Partial<InsertStudent>): Promise<Student | null> {
  const db = await getDb();
  if (!db) return null;

  // If password is being updated, hash it
  if (data.passwordPlain) {
    data.passwordHash = hashPassword(data.passwordPlain);
  }

  await db.update(students).set(data).where(eq(students.id, id));
  return await getStudentById(id);
}

export async function deleteStudent(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.delete(students).where(eq(students.id, id));
  return true;
}

export async function getStudentsByLevel(levelId: number): Promise<Student[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(students)
    .where(eq(students.levelId, levelId))
    .orderBy(asc(students.lastName));
}

// ==================== CLASS FUNCTIONS ====================

export async function createClass(classData: InsertClass): Promise<Class | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(classes).values(classData);
  const insertId = result[0].insertId;
  
  const newClass = await db.select().from(classes).where(eq(classes.id, insertId)).limit(1);
  return newClass[0] || null;
}

export async function getClassById(id: number): Promise<Class | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(classes).where(eq(classes.id, id)).limit(1);
  return result[0] || null;
}

export async function getClassesByLevel(levelId: number): Promise<Class[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(classes)
    .where(and(eq(classes.levelId, levelId), eq(classes.isPublished, true)))
    .orderBy(desc(classes.classDate));
}

export async function getAllClasses(filters?: { levelId?: number; search?: string }): Promise<Class[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (filters?.levelId) {
    conditions.push(eq(classes.levelId, filters.levelId));
  }
  if (filters?.search) {
    conditions.push(
      sql`(${classes.title} LIKE ${`%${filters.search}%`} OR ${classes.description} LIKE ${`%${filters.search}%`})`
    );
  }

  if (conditions.length > 0) {
    return await db.select().from(classes).where(and(...conditions)).orderBy(desc(classes.classDate));
  }

  return await db.select().from(classes).orderBy(desc(classes.classDate));
}

export async function updateClass(id: number, data: Partial<InsertClass>): Promise<Class | null> {
  const db = await getDb();
  if (!db) return null;

  await db.update(classes).set(data).where(eq(classes.id, id));
  return await getClassById(id);
}

export async function deleteClass(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.delete(classes).where(eq(classes.id, id));
  return true;
}

// ==================== HOMEWORK FUNCTIONS ====================

export async function createHomework(homeworkData: InsertHomework): Promise<Homework | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(homeworks).values(homeworkData);
  const insertId = result[0].insertId;
  
  const newHomework = await db.select().from(homeworks).where(eq(homeworks.id, insertId)).limit(1);
  return newHomework[0] || null;
}

export async function getHomeworkById(id: number): Promise<Homework | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(homeworks).where(eq(homeworks.id, id)).limit(1);
  return result[0] || null;
}

export async function getHomeworksByLevel(levelId: number): Promise<Homework[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(homeworks)
    .where(and(eq(homeworks.levelId, levelId), eq(homeworks.isPublished, true)))
    .orderBy(desc(homeworks.createdAt));
}

export async function getAllHomeworks(filters?: { levelId?: number }): Promise<Homework[]> {
  const db = await getDb();
  if (!db) return [];

  if (filters?.levelId) {
    return await db.select().from(homeworks)
      .where(eq(homeworks.levelId, filters.levelId))
      .orderBy(desc(homeworks.createdAt));
  }

  return await db.select().from(homeworks).orderBy(desc(homeworks.createdAt));
}

export async function updateHomework(id: number, data: Partial<InsertHomework>): Promise<Homework | null> {
  const db = await getDb();
  if (!db) return null;

  await db.update(homeworks).set(data).where(eq(homeworks.id, id));
  return await getHomeworkById(id);
}

export async function deleteHomework(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.delete(homeworks).where(eq(homeworks.id, id));
  return true;
}

// ==================== CLASS VIEW TRACKING ====================

export async function recordClassView(studentId: number, classId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  // Check if already viewed
  const existing = await db.select().from(classViews)
    .where(and(eq(classViews.studentId, studentId), eq(classViews.classId, classId)))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(classViews).values({ studentId, classId });
  }
}

export async function getStudentClassViews(studentId: number): Promise<number[]> {
  const db = await getDb();
  if (!db) return [];

  const views = await db.select().from(classViews).where(eq(classViews.studentId, studentId));
  return views.map(v => v.classId);
}

export async function getClassViewStats(classId: number): Promise<{ viewCount: number; studentIds: number[] }> {
  const db = await getDb();
  if (!db) return { viewCount: 0, studentIds: [] };

  const views = await db.select().from(classViews).where(eq(classViews.classId, classId));
  return {
    viewCount: views.length,
    studentIds: views.map(v => v.studentId),
  };
}

// ==================== HOMEWORK COMPLETION TRACKING ====================

export async function markHomeworkComplete(studentId: number, homeworkId?: number, classId?: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(homeworkCompletions).values({ studentId, homeworkId, classId });
}

export async function getStudentHomeworkCompletions(studentId: number): Promise<{ homeworkIds: number[]; classIds: number[] }> {
  const db = await getDb();
  if (!db) return { homeworkIds: [], classIds: [] };

  const completions = await db.select().from(homeworkCompletions).where(eq(homeworkCompletions.studentId, studentId));
  return {
    homeworkIds: completions.filter(c => c.homeworkId).map(c => c.homeworkId!),
    classIds: completions.filter(c => c.classId).map(c => c.classId!),
  };
}

// ==================== CONTACT FUNCTIONS ====================

export async function createContact(contact: InsertContact): Promise<Contact | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(contacts).values(contact);
  const insertId = result[0].insertId;
  
  const newContact = await db.select().from(contacts).where(eq(contacts.id, insertId)).limit(1);
  return newContact[0] || null;
}

export async function getAllContacts(filters?: {
  status?: Contact["status"];
  contactType?: Contact["contactType"];
  age?: string;
  currentLevel?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (filters?.status) {
    conditions.push(eq(contacts.status, filters.status));
  }
  if (filters?.contactType) {
    conditions.push(eq(contacts.contactType, filters.contactType));
  }
  if (filters?.age) {
    conditions.push(eq(contacts.age, filters.age));
  }
  if (filters?.currentLevel) {
    conditions.push(eq(contacts.currentLevel, filters.currentLevel));
  }
  if (filters?.startDate) {
    conditions.push(gte(contacts.createdAt, filters.startDate));
  }
  if (filters?.endDate) {
    conditions.push(lte(contacts.createdAt, filters.endDate));
  }
  if (filters?.search) {
    conditions.push(
      sql`(${contacts.fullName} LIKE ${`%${filters.search}%`} OR ${contacts.email} LIKE ${`%${filters.search}%`} OR ${contacts.companyName} LIKE ${`%${filters.search}%`})`
    );
  }

  if (conditions.length > 0) {
    return await db.select().from(contacts).where(and(...conditions)).orderBy(desc(contacts.createdAt));
  }

  return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
}

export async function getContactById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
  return result[0] || null;
}

export async function updateContact(id: number, data: Partial<InsertContact>) {
  const db = await getDb();
  if (!db) return null;

  await db.update(contacts).set(data).where(eq(contacts.id, id));
  return await getContactById(id);
}

export async function updateContactStatus(id: number, status: Contact["status"]) {
  const db = await getDb();
  if (!db) return null;

  await db.update(contacts).set({ status }).where(eq(contacts.id, id));
  return await getContactById(id);
}

export async function deleteContact(id: number) {
  const db = await getDb();
  if (!db) return false;

  await db.delete(contacts).where(eq(contacts.id, id));
  return true;
}

export async function getContactStats() {
  const db = await getDb();
  if (!db) return { total: 0, nuevo: 0, contactado: 0, en_proceso: 0, cerrado: 0, no_interesado: 0, empresas: 0, individuales: 0 };

  const allContacts = await db.select().from(contacts);
  
  return {
    total: allContacts.length,
    nuevo: allContacts.filter(c => c.status === "nuevo").length,
    contactado: allContacts.filter(c => c.status === "contactado").length,
    en_proceso: allContacts.filter(c => c.status === "en_proceso").length,
    cerrado: allContacts.filter(c => c.status === "cerrado").length,
    no_interesado: allContacts.filter(c => c.status === "no_interesado").length,
    empresas: allContacts.filter(c => c.contactType === "empresa").length,
    individuales: allContacts.filter(c => c.contactType === "individual").length,
  };
}

export async function getContactsByMonth() {
  const db = await getDb();
  if (!db) return [];

  const allContacts = await db.select().from(contacts).orderBy(asc(contacts.createdAt));
  
  const monthlyData: Record<string, { month: string; total: number; empresas: number; individuales: number }> = {};
  
  allContacts.forEach(contact => {
    const date = new Date(contact.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('es-AR', { month: 'short', year: 'numeric' });
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { month: monthName, total: 0, empresas: 0, individuales: 0 };
    }
    
    monthlyData[monthKey].total++;
    if (contact.contactType === 'empresa') {
      monthlyData[monthKey].empresas++;
    } else {
      monthlyData[monthKey].individuales++;
    }
  });
  
  return Object.values(monthlyData).slice(-12);
}

export async function getContactsBySource() {
  const db = await getDb();
  if (!db) return [];

  const allContacts = await db.select().from(contacts);
  
  const sourceData: Record<string, number> = {};
  
  allContacts.forEach(contact => {
    const source = contact.source || 'website';
    sourceData[source] = (sourceData[source] || 0) + 1;
  });
  
  return Object.entries(sourceData).map(([source, count]) => ({ source, count }));
}

// ==================== TESTIMONIAL FUNCTIONS ====================

export async function createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(testimonials).values(testimonial);
  const insertId = result[0].insertId;
  
  const newTestimonial = await db.select().from(testimonials).where(eq(testimonials.id, insertId)).limit(1);
  return newTestimonial[0] || null;
}

export async function getAllTestimonials() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(testimonials).orderBy(asc(testimonials.displayOrder));
}

export async function getActiveTestimonials() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(testimonials)
    .where(eq(testimonials.isActive, true))
    .orderBy(asc(testimonials.displayOrder));
}

export async function updateTestimonial(id: number, data: Partial<InsertTestimonial>) {
  const db = await getDb();
  if (!db) return null;

  await db.update(testimonials).set(data).where(eq(testimonials.id, id));
  const result = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
  return result[0] || null;
}

export async function deleteTestimonial(id: number) {
  const db = await getDb();
  if (!db) return false;

  await db.delete(testimonials).where(eq(testimonials.id, id));
  return true;
}

// ==================== CHATBOT FAQ FUNCTIONS ====================

export async function createFaq(faq: InsertChatbotFaq): Promise<ChatbotFaq | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(chatbotFaqs).values(faq);
  const insertId = result[0].insertId;
  
  const newFaq = await db.select().from(chatbotFaqs).where(eq(chatbotFaqs.id, insertId)).limit(1);
  return newFaq[0] || null;
}

export async function getAllFaqs() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(chatbotFaqs).orderBy(asc(chatbotFaqs.displayOrder));
}

export async function getActiveFaqs() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(chatbotFaqs)
    .where(eq(chatbotFaqs.isActive, true))
    .orderBy(asc(chatbotFaqs.displayOrder));
}

export async function updateFaq(id: number, data: Partial<InsertChatbotFaq>) {
  const db = await getDb();
  if (!db) return null;

  await db.update(chatbotFaqs).set(data).where(eq(chatbotFaqs.id, id));
  const result = await db.select().from(chatbotFaqs).where(eq(chatbotFaqs.id, id)).limit(1);
  return result[0] || null;
}

export async function deleteFaq(id: number) {
  const db = await getDb();
  if (!db) return false;

  await db.delete(chatbotFaqs).where(eq(chatbotFaqs.id, id));
  return true;
}

// ==================== SITE SETTINGS FUNCTIONS ====================

export async function getSetting(key: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(siteSettings).where(eq(siteSettings.settingKey, key)).limit(1);
  return result[0]?.settingValue || null;
}

export async function setSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) return false;

  await db.insert(siteSettings).values({ settingKey: key, settingValue: value })
    .onDuplicateKeyUpdate({ set: { settingValue: value } });
  return true;
}
