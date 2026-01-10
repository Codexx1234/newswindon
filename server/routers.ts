import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Acceso denegado. Solo administradores.' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ==================== LEVEL ROUTES ====================
  levels: router({
    // Public: Get active levels
    list: publicProcedure.query(async () => {
      return await db.getActiveLevels();
    }),

    // Admin: Get all levels
    listAll: adminProcedure.query(async () => {
      return await db.getAllLevels();
    }),

    // Admin: Create level
    create: adminProcedure
      .input(z.object({
        name: z.string().min(2),
        description: z.string().optional(),
        color: z.string().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createLevel(input);
      }),

    // Admin: Update level
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(2).optional(),
        description: z.string().optional(),
        color: z.string().optional(),
        displayOrder: z.number().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateLevel(id, data);
      }),

    // Admin: Delete level
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteLevel(input.id);
      }),
  }),

  // ==================== STUDENT ROUTES ====================
  students: router({
    // Student login
    login: publicProcedure
      .input(z.object({
        username: z.string(),
        password: z.string(),
      }))
      .mutation(async ({ input }) => {
        const student = await db.verifyStudentPassword(input.username, input.password);
        if (!student) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Usuario o contraseña incorrectos' });
        }
        return { success: true, student };
      }),

    // Admin: Get all students
    list: adminProcedure
      .input(z.object({
        levelId: z.number().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllStudents(input);
      }),

    // Admin: Get students by level
    byLevel: adminProcedure
      .input(z.object({ levelId: z.number() }))
      .query(async ({ input }) => {
        return await db.getStudentsByLevel(input.levelId);
      }),

    // Admin: Get single student
    get: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getStudentById(input.id);
      }),

    // Admin: Create student (auto-generates credentials)
    create: adminProcedure
      .input(z.object({
        firstName: z.string().min(2),
        lastName: z.string().min(2),
        levelId: z.number(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const student = await db.createStudent({
          ...input,
          createdBy: ctx.user?.id,
        });
        return student;
      }),

    // Admin: Update student
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        firstName: z.string().min(2).optional(),
        lastName: z.string().min(2).optional(),
        levelId: z.number().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        isActive: z.boolean().optional(),
        passwordPlain: z.string().optional(), // For password reset
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateStudent(id, data);
      }),

    // Admin: Delete student
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteStudent(input.id);
      }),

    // Admin: Export students (returns all with passwords visible)
    export: adminProcedure
      .input(z.object({ levelId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        const students = await db.getAllStudents(input);
        return students.map(s => ({
          nombre: s.firstName,
          apellido: s.lastName,
          usuario: s.username,
          contraseña: s.passwordPlain,
          email: s.email,
          telefono: s.phone,
          nivel: s.levelId,
          activo: s.isActive,
        }));
      }),
  }),

  // ==================== CLASS ROUTES ====================
  classes: router({
    // Student: Get classes for their level
    forStudent: publicProcedure
      .input(z.object({ levelId: z.number() }))
      .query(async ({ input }) => {
        return await db.getClassesByLevel(input.levelId);
      }),

    // Student: Get single class
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getClassById(input.id);
      }),

    // Student: Record view
    recordView: publicProcedure
      .input(z.object({ studentId: z.number(), classId: z.number() }))
      .mutation(async ({ input }) => {
        await db.recordClassView(input.studentId, input.classId);
        return { success: true };
      }),

    // Student: Get viewed classes
    getViews: publicProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ input }) => {
        return await db.getStudentClassViews(input.studentId);
      }),

    // Admin: Get all classes
    list: adminProcedure
      .input(z.object({
        levelId: z.number().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllClasses(input);
      }),

    // Admin: Create class
    create: adminProcedure
      .input(z.object({
        title: z.string().min(3),
        description: z.string().optional(),
        levelId: z.number(),
        classDate: z.string(),
        videoUrl: z.string().optional(),
        homeworkPdfUrl: z.string().optional(),
        homeworkDescription: z.string().optional(),
        isPublished: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { classDate, ...rest } = input;
        const data: any = {
          ...rest,
          classDate: classDate,
          createdBy: ctx.user?.id,
        };
        return await db.createClass(data);
      }),

    // Admin: Update class
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(3).optional(),
        description: z.string().optional(),
        levelId: z.number().optional(),
        classDate: z.string().optional(),
        videoUrl: z.string().optional(),
        homeworkPdfUrl: z.string().optional(),
        homeworkDescription: z.string().optional(),
        isPublished: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, classDate, ...rest } = input;
        const data: any = { ...rest };
        if (classDate) data.classDate = classDate;
        return await db.updateClass(id, data);
      }),

    // Admin: Delete class
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteClass(input.id);
      }),

    // Admin: Get view stats for a class
    viewStats: adminProcedure
      .input(z.object({ classId: z.number() }))
      .query(async ({ input }) => {
        return await db.getClassViewStats(input.classId);
      }),
  }),

  // ==================== HOMEWORK ROUTES ====================
  homeworks: router({
    // Student: Get homeworks for their level
    forStudent: publicProcedure
      .input(z.object({ levelId: z.number() }))
      .query(async ({ input }) => {
        return await db.getHomeworksByLevel(input.levelId);
      }),

    // Student: Get single homework
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getHomeworkById(input.id);
      }),

    // Student: Mark homework complete
    markComplete: publicProcedure
      .input(z.object({
        studentId: z.number(),
        homeworkId: z.number().optional(),
        classId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.markHomeworkComplete(input.studentId, input.homeworkId, input.classId);
        return { success: true };
      }),

    // Student: Get completions
    getCompletions: publicProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ input }) => {
        return await db.getStudentHomeworkCompletions(input.studentId);
      }),

    // Admin: Get all homeworks
    list: adminProcedure
      .input(z.object({ levelId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getAllHomeworks(input);
      }),

    // Admin: Create homework
    create: adminProcedure
      .input(z.object({
        title: z.string().min(3),
        description: z.string().optional(),
        levelId: z.number(),
        dueDate: z.string().optional(),
        pdfUrl: z.string().optional(),
        isPublished: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { dueDate, ...rest } = input;
        const data: any = {
          ...rest,
          createdBy: ctx.user?.id,
        };
        if (dueDate) data.dueDate = dueDate;
        return await db.createHomework(data);
      }),

    // Admin: Update homework
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(3).optional(),
        description: z.string().optional(),
        levelId: z.number().optional(),
        dueDate: z.string().optional(),
        pdfUrl: z.string().optional(),
        isPublished: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, dueDate, ...rest } = input;
        const data: any = { ...rest };
        if (dueDate) data.dueDate = dueDate;
        return await db.updateHomework(id, data);
      }),

    // Admin: Delete homework
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteHomework(input.id);
      }),
  }),

  // ==================== FILE UPLOAD ROUTE ====================
  upload: router({
    // Admin: Upload file to S3
    file: adminProcedure
      .input(z.object({
        fileName: z.string(),
        fileData: z.string(), // Base64 encoded
        contentType: z.string(),
        folder: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.fileData, 'base64');
        const folder = input.folder || 'uploads';
        const timestamp = Date.now();
        const fileKey = `${folder}/${timestamp}-${input.fileName}`;
        
        const result = await storagePut(fileKey, buffer, input.contentType);
        return result;
      }),
  }),

  // ==================== CONTACT ROUTES ====================
  contacts: router({
    // Public: Submit contact form
    submit: publicProcedure
      .input(z.object({
        fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
        email: z.string().email("Email inválido"),
        phone: z.string().optional(),
        age: z.string().optional(),
        currentLevel: z.string().optional(),
        courseInterest: z.string().optional(),
        message: z.string().optional(),
        contactType: z.enum(["individual", "empresa"]).default("individual"),
        companyName: z.string().optional(),
        employeeCount: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const contact = await db.createContact({
          ...input,
          emailSent: true,
        });

        if (contact) {
          await notifyOwner({
            title: `Nuevo contacto: ${input.fullName}`,
            content: `
              Tipo: ${input.contactType === "empresa" ? "Empresa" : "Individual"}
              Nombre: ${input.fullName}
              Email: ${input.email}
              Teléfono: ${input.phone || "No proporcionado"}
              Interés: ${input.courseInterest || "No especificado"}
              Mensaje: ${input.message || "Sin mensaje"}
            `,
          });
        }

        return { 
          success: true, 
          message: "¡Gracias por contactarnos! Te responderemos a la brevedad.",
          contact 
        };
      }),

    // Admin: Get all contacts with filters
    list: adminProcedure
      .input(z.object({
        status: z.enum(["nuevo", "contactado", "en_proceso", "cerrado", "no_interesado"]).optional(),
        contactType: z.enum(["individual", "empresa"]).optional(),
        age: z.string().optional(),
        currentLevel: z.string().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllContacts(input);
      }),

    // Admin: Get contact stats
    stats: adminProcedure.query(async () => {
      return await db.getContactStats();
    }),

    // Admin: Get contacts by month
    byMonth: adminProcedure.query(async () => {
      return await db.getContactsByMonth();
    }),

    // Admin: Get contacts by source
    bySource: adminProcedure.query(async () => {
      return await db.getContactsBySource();
    }),

    // Admin: Get single contact
    get: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getContactById(input.id);
      }),

    // Admin: Update contact status
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["nuevo", "contactado", "en_proceso", "cerrado", "no_interesado"]),
      }))
      .mutation(async ({ input }) => {
        return await db.updateContactStatus(input.id, input.status);
      }),
// Admin: Update contact notes
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.updateContact(input.id, { notes: input.notes });     }),

    // Admin: Delete contact
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteContact(input.id);
      }),
  }),

  // ==================== TESTIMONIAL ROUTES ====================
  testimonials: router({
    // Public: Get active testimonials
    list: publicProcedure.query(async () => {
      return await db.getActiveTestimonials();
    }),

    // Admin: Get all testimonials
    listAll: adminProcedure.query(async () => {
      return await db.getAllTestimonials();
    }),

    // Admin: Create testimonial
    create: adminProcedure
      .input(z.object({
        authorName: z.string().min(2),
        authorRole: z.string().optional(),
        content: z.string().min(10),
        rating: z.number().min(1).max(5).optional(),
        isActive: z.boolean().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createTestimonial(input);
      }),

    // Admin: Update testimonial
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        authorName: z.string().min(2).optional(),
        authorRole: z.string().optional(),
        content: z.string().min(10).optional(),
        rating: z.number().min(1).max(5).optional(),
        isActive: z.boolean().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateTestimonial(id, data);
      }),

    // Admin: Delete testimonial
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteTestimonial(input.id);
      }),
  }),

  // ==================== CHATBOT FAQ ROUTES ====================
  chatbot: router({
    // Public: Get active FAQs
    faqs: publicProcedure.query(async () => {
      return await db.getActiveFaqs();
    }),

    // Public: Chat with AI using FAQs as context
    chat: publicProcedure
      .input(z.object({
        message: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const faqs = await db.getActiveFaqs();      
        const faqContext = faqs.map(f => `P: ${f.question}\nR: ${f.answer}`).join("\n\n");
        
        const systemPrompt = `Eres el asistente virtual de NewSwindon, una academia de inglés con 35 años de trayectoria en Carapachay, Buenos Aires.

INFORMACIÓN DE LA ACADEMIA:
- Nombre: NewSwindon (antes Swindon College)
- Ubicación: Carapachay, Buenos Aires, Argentina
- Trayectoria: 35 años enseñando inglés
- Teléfono: 15 3070-7350
- Email: swindoncollege2@gmail.com
- Logro destacado: 30 años de relación continua con empresas brindando capacitación

SERVICIOS:
- Clases para todas las edades (desde 3 años)
- Grupos reducidos
- Preparación para exámenes Cambridge (First Certificate, Proficiency)
- Recursos multimedios (revistas, DVDs, videos, CDs)
- Ingreso a profesorado y traductorado
- Taller de conversación
- Capacitación corporativa para empresas

BENEFICIOS:
- No se cobra matrícula
- No se cobra derecho de examen

PREGUNTAS FRECUENTES CONFIGURADAS:
${faqContext}

INSTRUCCIONES:
- Responde siempre en español de Argentina (vos, tenés, etc.)
- Sé amable, profesional y conciso
- Si no conocés la respuesta exacta, sugiere contactar por WhatsApp o email
- Promociona los beneficios de la academia
- Máximo 3-4 oraciones por respuesta`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: input.message },
            ],
          });

          const aiResponse = response.choices[0]?.message?.content || 
            "Disculpá, no pude procesar tu consulta. Por favor contactanos por WhatsApp al 15 3070-7350.";

          return { response: aiResponse };
        } catch (error) {
          console.error("Chatbot error:", error);
          return { 
            response: "¡Hola! Gracias por tu consulta. Para más información, contactanos por WhatsApp al 15 3070-7350 o por email a swindoncollege2@gmail.com." 
          };
        }
      }),

    // Admin: Get all FAQs
    listAll: adminProcedure.query(async () => {
      return await db.getAllFaqs();
    }),

    // Admin: Create FAQ
    create: adminProcedure
      .input(z.object({
        question: z.string().min(5),
        answer: z.string().min(10),
        keywords: z.string().optional(),
        category: z.string().optional(),
        isActive: z.boolean().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createFaq(input);
      }),

    // Admin: Update FAQ
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        question: z.string().min(5).optional(),
        answer: z.string().min(10).optional(),
        keywords: z.string().optional(),
        category: z.string().optional(),
        isActive: z.boolean().optional(),
        displayOrder: z.number().optional(),
      }))
.mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateFaq(id, data);
      }),

    // Admin: Delete FAQ
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteFaq(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
