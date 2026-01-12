import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";
import { invokeLLM } from "./_core/llm";

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
          await db.trackMetric('contactSubmissions');
          const isEmpresa = input.contactType === "empresa";
          await notifyOwner({
            title: `Nuevo contacto ${isEmpresa ? "EMPRESARIAL" : ""}: ${input.fullName}`,
            content: `
📋 **Nuevo Formulario de Contacto**

**Tipo:** ${isEmpresa ? "🏢 Empresa" : "👤 Individual"}
${isEmpresa ? `**Empresa:** ${input.companyName || "No especificada"}\n**Empleados a capacitar:** ${input.employeeCount || "No especificado"}` : ""}

**Nombre:** ${input.fullName}
**Email:** ${input.email}
**Teléfono:** ${input.phone || "No proporcionado"}
${!isEmpresa ? `**Edad:** ${input.age || "No especificada"}` : ""}
**Nivel actual:** ${input.currentLevel || "No especificado"}
**Curso de interés:** ${input.courseInterest || "No especificado"}

**Mensaje:**
${input.message || "Sin mensaje adicional"}

---
Contactar a la brevedad.
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
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllContacts(input);
      }),

    // Admin: Get contact by ID
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getContactById(input.id);
      }),

    // Admin: Update contact
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["nuevo", "contactado", "en_proceso", "cerrado", "no_interesado"]).optional(),
        notes: z.string().optional(),
        lastContactedAt: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateContact(id, data);
        return { success: true };
      }),

    // Admin: Delete contact
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteContact(input.id);
        return { success: true };
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
        await db.updateTestimonial(id, data);
        return { success: true };
      }),

    // Admin: Delete testimonial
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteTestimonial(input.id);
        return { success: true };
      }),
  }),

  // ==================== CHATBOT ROUTES ====================
  // ==================== APPOINTMENT ROUTES ====================
  appointments: router({
    // Public: Book an appointment
    book: publicProcedure
      .input(z.object({
        fullName: z.string().min(2),
        email: z.string().email(),
        phone: z.string().min(8),
        appointmentDate: z.date(),
        appointmentType: z.enum(["entrevista_nivel", "consulta_general", "empresa"]).default("entrevista_nivel"),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Validar horario laboral (Lunes a Viernes 9-21, Sábados 9-13)
        const date = new Date(input.appointmentDate);
        const day = date.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
        const hour = date.getHours();
        
        let isWorkingHour = false;
        if (day >= 1 && day <= 4) { // Lunes a Jueves
          if (hour >= 10 && hour < 20) isWorkingHour = true;
        }

        if (!isWorkingHour) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'El horario seleccionado está fuera de la jornada laboral (Lunes a Jueves de 10 a 20hs).' 
          });
        }

        // Validar intervalos de 1 hora (minutos deben ser 00)
        if (date.getMinutes() !== 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Las citas solo pueden agendarse en intervalos de 1 hora (ej: 10:00, 11:00).'
          });
        }

        // Verificar disponibilidad
        const isAvailable = await db.checkAppointmentAvailability(date);
        if (!isAvailable) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'El horario seleccionado ya está ocupado. Por favor, elegí otro horario disponible.'
          });
        }

        const appointment = await db.createAppointment(input);
        await db.trackMetric('appointmentBookings');
        
        await notifyOwner({
          title: `Nueva Reserva: ${input.fullName}`,
          content: `
📅 **Nueva Cita Agendada**

**Tipo:** ${input.appointmentType}
**Fecha:** ${input.appointmentDate.toLocaleString()}
**Nombre:** ${input.fullName}
**Email:** ${input.email}
**Teléfono:** ${input.phone}
**Notas:** ${input.notes || "Sin notas"}
          `,
        });

        return { success: true, appointment };
      }),

    // Admin: List all appointments
    list: adminProcedure.query(async () => {
      return await db.getAllAppointments();
    }),

    // Admin: Update appointment status
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pendiente", "confirmada", "cancelada", "completada"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateAppointment(input.id, { status: input.status });
        return { success: true };
      }),
  }),

  // ==================== METRICS ROUTES ====================
  metrics: router({
    // Admin: Get recent metrics
    getRecent: adminProcedure
      .input(z.object({ days: z.number().default(7) }))
      .query(async ({ input }) => {
        return await db.getRecentMetrics(input.days);
      }),
    
    // Public: Track page view (simple)
    trackPageView: publicProcedure.mutation(async () => {
      await db.trackMetric('pageViews');
      return { success: true };
    }),
  }),

  chatbot: router({
    // Public: Get active FAQs
    faqs: publicProcedure.query(async () => {
      return await db.getActiveFaqs();
    }),

    // Public: Chat with bot
    chat: publicProcedure
      .input(z.object({ message: z.string().min(1) }))
      .mutation(async ({ input }) => {
        await db.trackMetric('chatbotInteractions');
        const faqs = await db.getActiveFaqs();
        
        const faqContext = faqs.length > 0 
          ? faqs.map(faq => `P: ${faq.question}\nR: ${faq.answer}`).join('\n\n')
          : "No hay preguntas frecuentes cargadas actualmente.";

        const systemPrompt = `Sos el asistente virtual de NewSwindon, un instituto de inglés con 35 años de trayectoria en Carapachay, Buenos Aires.

INFORMACIÓN DE LA ACADEMIA:
- 35 años de experiencia formando estudiantes.
- Cursos para todas las edades (desde 3 años).
- Grupos reducidos con atención personalizada.
- Beneficio exclusivo: NO se cobra matrícula ni derecho de examen.
- Preparación para exámenes Cambridge (First Certificate, Proficiency).
- Material multimedia incluido (revistas, DVDs, videos, CDs).
- Profesores especializados y taller de conversación.
- Preparación para ingreso a profesorado y traductorado.
- 30+ años brindando capacitación a empresas líderes.
- Ubicación: Carapachay, Buenos Aires.
- Contacto: 15 3070-7350 | swindoncollege2@gmail.com

PREGUNTAS FRECUENTES DEL ADMIN:
${faqContext}

INSTRUCCIONES:
- Responde siempre en español de Argentina (usá el "voseo": vos, tenés, vení).
- Sé amable, profesional y muy conciso.
- Si el usuario pregunta algo que está en las PREGUNTAS FRECUENTES, usá esa información.
- Si no conocés la respuesta exacta, sugerí contactar por WhatsApp (15 3070-7350).
- Máximo 3 oraciones por respuesta.`;

        try {
          // Fallback local si la pregunta es muy simple y coincide con una FAQ
          const lowerMsg = input.message.toLowerCase();
          const quickMatch = faqs.find(f => lowerMsg.includes(f.question.toLowerCase()) || f.question.toLowerCase().includes(lowerMsg));
          
          if (quickMatch) {
            return { response: quickMatch.answer };
          }

          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: input.message },
            ],
          });

          const messageContent = response.choices[0]?.message?.content;
          return { 
            response: typeof messageContent === 'string' ? messageContent : "¡Hola! Para darte una respuesta precisa sobre ese tema, te sugiero consultarnos directamente por WhatsApp al 15 3070-7350. ¡Te esperamos!" 
          };
        } catch (error) {
          console.error("Chatbot error:", error);
          return { 
            response: "¡Hola! Justo ahora tengo mucha gente consultando. Para no hacerte esperar, ¿podrías escribirnos al WhatsApp 15 3070-7350? Te respondemos al toque." 
          };
        }
      }),

    // Admin: Get all FAQs
    listAll: adminProcedure.query(async () => {
      return await db.getAllFaqs();
    }),

    // Admin: Create FAQ
    createFaq: adminProcedure
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
    updateFaq: adminProcedure
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
        await db.updateFaq(id, data);
        return { success: true };
      }),

    // Admin: Delete FAQ
    deleteFaq: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteFaq(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
