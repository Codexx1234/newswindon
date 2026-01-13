import { COOKIE_NAME, SPAM_DETECTED_ERR_MSG } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";
import { invokeLLM } from "./_core/llm";
import { sendEmail } from './_core/email';
import { CalendarService } from './_core/calendar';
import { sdk } from './_core/sdk';

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin' && ctx.user.role !== 'super_admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Acceso denegado. Solo administradores.' });
  }
  return next({ ctx });
});

/**
 * Definición principal del router de tRPC.
 * Organizado por módulos funcionales para facilitar la extensibilidad y legibilidad por IA.
 */
export const appRouter = router({
  // Rutas básicas de salud y estado del sistema
  system: systemRouter,
  
  // ==================== AUTH ROUTES ====================
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const user = await db.getUserByEmail(input.email);
        if (!user || !user.password) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Credenciales inválidas' });
        }

        const { verifyPassword } = await import('./passwordUtils');
        const isValid = verifyPassword(input.password, user.password);
        
        if (!isValid) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Credenciales inválidas' });
        }

        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name || user.email || "Admin",
        });

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });

        return { success: true, user };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    // Superadmin only: User management
    listUsers: protectedProcedure.use(({ ctx, next }) => {
      if (ctx.user.role !== 'super_admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo el superadmin puede ver usuarios.' });
      }
      return next({ ctx });
    }).query(async () => {
      return await db.getAllUsers();
    }),
    createUser: protectedProcedure.use(({ ctx, next }) => {
      if (ctx.user.role !== 'super_admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo el superadmin puede crear usuarios.' });
      }
      return next({ ctx });
    })
    .input(z.object({
      email: z.string().email(),
      name: z.string(),
      password: z.string().min(6),
      role: z.enum(['admin', 'super_admin']).default('admin'),
    }))
    .mutation(async ({ input }) => {
      const existing = await db.getUserByEmail(input.email);
      if (existing) {
        throw new TRPCError({ code: 'CONFLICT', message: 'El email ya está registrado.' });
      }

      const { hashPassword } = await import('./passwordUtils');
      const hashedPassword = hashPassword(input.password);

      await db.createUser({
        openId: `local_${Date.now()}`,
        email: input.email,
        name: input.name,
        password: hashedPassword,
        role: input.role,
        loginMethod: 'local',
      });

      return { success: true };
    }),
    deleteUser: protectedProcedure.use(({ ctx, next }) => {
      if (ctx.user.role !== 'super_admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo el superadmin puede eliminar usuarios.' });
      }
      return next({ ctx });
    })
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteUser(input.id);
      return { success: true };
    }),
  }),

  // ==================== CONTACT ROUTES ====================
  contacts: router({
    // Public: Submit contact form
    submit: publicProcedure
      .input(z.object({
        fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
        email: z.string().email("Email inválido"),
        phone: z.string().max(20).optional(),
        age: z.string().max(50).optional(),
        currentLevel: z.string().max(100).optional(),
        courseInterest: z.string().max(255).optional(),
        message: z.string().max(1000).optional(),
        contactType: z.enum(["individual", "empresa"]).default("individual"),
        companyName: z.string().max(255).optional(),
        employeeCount: z.string().max(50).optional(),
        honeypot: z.string().optional(),
        source: z.string().optional(),
        utmSource: z.string().optional(),
        utmMedium: z.string().optional(),
        utmCampaign: z.string().optional(),
        referrer: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (input.honeypot) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: SPAM_DETECTED_ERR_MSG });
        }
        const { honeypot, ...cleanInput } = input;

        const contact = await db.createContact({
          ...cleanInput,
          emailSent: false,
        });

        if (contact) {
          await sendEmail({
            to: input.email,
            subject: "¡Gracias por tu interés en NewSwindon!",
            template: "student-confirmation",
            context: {
              fullName: input.fullName,
            },
          });

          const isEmpresa = input.contactType === "empresa";
          await sendEmail({
            to: process.env.ADMIN_EMAIL || "admin@newswindon.com",
            subject: `Nuevo Contacto ${isEmpresa ? "Empresarial" : "Individual"}: ${input.fullName}`,
            template: "admin-notification",
            context: {
              fullName: input.fullName,
              email: input.email,
              phone: input.phone || "No proporcionado",
              contactType: isEmpresa ? "Empresa" : "Individual",
              companyName: input.companyName || "N/A",
              employeeCount: input.employeeCount || "N/A",
              age: input.age || "N/A",
              currentLevel: input.currentLevel || "N/A",
              courseInterest: input.courseInterest || "N/A",
              message: input.message || "Sin mensaje adicional",
            },
          });

          await db.updateContact(contact.id, { emailSent: true });
        }

        await db.trackMetric('contactSubmissions');
        return { 
          success: true, 
          message: "¡Gracias por contactarnos! Te responderemos a la brevedad.",
          contact 
        };
      }),

    list: adminProcedure
      .input(z.object({
        status: z.enum(["nuevo", "contactado", "en_proceso", "cerrado", "no_interesado"]).optional(),
        contactType: z.enum(["individual", "empresa"]).optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllContacts(input);
      }),

    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getContactById(input.id);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        fullName: z.string().min(2).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        age: z.string().optional(),
        currentLevel: z.string().optional(),
        courseInterest: z.string().optional(),
        message: z.string().optional(),
        companyName: z.string().optional(),
        employeeCount: z.string().optional(),
        status: z.enum(["nuevo", "contactado", "en_proceso", "cerrado", "no_interesado"]).optional(),
        notes: z.string().optional(),
        lastContactedAt: z.date().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        await db.updateContact(id, data);
        
        await db.createAuditLog({
          userId: ctx.user.id,
          action: 'UPDATE_CONTACT',
          entityType: 'contact',
          entityId: id,
          details: JSON.stringify(data),
          ipAddress: ctx.req.ip,
        });

        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.deleteContact(input.id);
        
        await db.createAuditLog({
          userId: ctx.user.id,
          action: 'DELETE_CONTACT',
          entityType: 'contact',
          entityId: input.id,
          ipAddress: ctx.req.ip,
        });

        return { success: true };
      }),
  }),

  // ==================== TESTIMONIAL ROUTES ====================
  testimonials: router({
    list: publicProcedure.query(async () => {
      return await db.getActiveTestimonials();
    }),

    listAll: adminProcedure.query(async () => {
      return await db.getAllTestimonials();
    }),

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

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteTestimonial(input.id);
        return { success: true };
      }),
  }),

  // ==================== APPOINTMENT ROUTES ====================
  appointments: router({
    book: publicProcedure
      .input(z.object({
        fullName: z.string().min(2, "Nombre demasiado corto").max(100),
        email: z.string().email("Email inválido"),
        phone: z.string().min(8).max(20),
        appointmentDate: z.date(),
        appointmentType: z.enum(["entrevista_nivel", "consulta_general", "empresa"]).default("entrevista_nivel"),
        notes: z.string().max(500).optional(),
      }))
      .mutation(async ({ input }) => {
        const date = new Date(input.appointmentDate);
        const day = date.getDay();
        const hour = date.getHours();
        
        let isWorkingHour = false;
        if (day >= 1 && day <= 4) {
          if (hour >= 10 && hour < 20) isWorkingHour = true;
        }

        if (!isWorkingHour) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'El horario seleccionado está fuera de la jornada laboral (Lunes a Jueves de 10 a 20hs).' 
          });
        }

        if (date.getMinutes() !== 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Las citas solo pueden agendarse en intervalos de 1 hora.'
          });
        }

        const isAvailable = await db.checkAppointmentAvailability(date);
        if (!isAvailable) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'El horario seleccionado ya está ocupado.'
          });
        }

        const appointment = await db.createAppointment(input);
        await db.trackMetric('appointmentBookings');
        
        await sendEmail({
          to: input.email,
          subject: "Confirmación de tu cita en NewSwindon",
          template: "appointment-confirmation",
          context: {
            fullName: input.fullName,
            appointmentDate: input.appointmentDate.toLocaleString('es-AR'),
            appointmentType: input.appointmentType,
            phone: input.phone,
          },
        });

        await sendEmail({
          to: process.env.ADMIN_EMAIL || "admin@newswindon.com",
          subject: `Nueva Cita Agendada: ${input.fullName}`,
          template: "admin-notification",
          context: {
            fullName: input.fullName,
            email: input.email,
            phone: input.phone,
            contactType: "Cita / Reserva",
            message: `Tipo de cita: ${input.appointmentType}. Fecha: ${input.appointmentDate.toLocaleString('es-AR')}. Notas: ${input.notes || "Sin notas"}`,
          },
        });

        await CalendarService.createEvent({
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          appointmentType: input.appointmentType,
          date: input.appointmentDate,
          hour: `${input.appointmentDate.getHours()}:00`,
          appointmentId: appointment.id,
        });

        return { success: true, appointment };
      }),

    list: adminProcedure.query(async () => {
      return await db.getAllAppointments();
    }),

    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pendiente", "confirmada", "cancelada", "completada"]),
      }))
      .mutation(async ({ input, ctx }) => {
        const appointment = await db.getAppointmentById(input.id);
        if (!appointment) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Cita no encontrada' });
        }

        await db.updateAppointment(input.id, { status: input.status });

        await db.createAuditLog({
          userId: ctx.user.id,
          action: 'UPDATE_APPOINTMENT_STATUS',
          entityType: 'appointment',
          entityId: input.id,
          details: `Status changed to ${input.status}`,
          ipAddress: ctx.req.ip,
        });

        if (input.status === 'cancelada') {
          await CalendarService.deleteEvent(input.id, (appointment as any).googleCalendarEventId);
          await sendEmail({
            to: appointment.email,
            subject: "Tu cita en NewSwindon ha sido cancelada",
            template: "appointment-confirmation", // Fallback or specific cancellation template
            context: {
              fullName: appointment.fullName,
              isCancellation: true
            }
          });
        }

        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const appointment = await db.getAppointmentById(input.id);
        if (!appointment) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Cita no encontrada' });
        }

        await db.deleteAppointment(input.id);
        
        await db.createAuditLog({
          userId: ctx.user.id,
          action: 'DELETE_APPOINTMENT',
          entityType: 'appointment',
          entityId: input.id,
          ipAddress: ctx.req.ip,
        });

        return { success: true };
      }),
  }),

  // ==================== GALLERY ROUTES ====================
  gallery: router({
    list: publicProcedure.query(async () => {
      return await db.getActiveGalleryImages();
    }),

    listAll: adminProcedure.query(async () => {
      return await db.getAllGalleryImages();
    }),

    create: adminProcedure
      .input(z.object({
        url: z.string().url(),
        caption: z.string().optional(),
        displayOrder: z.number().default(0),
        isActive: z.boolean().default(true),
      }))
      .mutation(async ({ input }) => {
        return await db.createGalleryImage(input);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        url: z.string().url().optional(),
        caption: z.string().optional(),
        displayOrder: z.number().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateGalleryImage(id, data);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteGalleryImage(input.id);
        return { success: true };
      }),
  }),

  // ==================== SETTINGS ROUTES ====================
  settings: router({
    get: publicProcedure
      .input(z.object({ key: z.string() }))
      .query(async ({ input }) => {
        return await db.getSetting(input.key);
      }),

    set: adminProcedure
      .input(z.object({ key: z.string(), value: z.string() }))
      .mutation(async ({ input }) => {
        await db.setSetting(input.key, input.value);
        return { success: true };
      }),
  }),

  // ==================== METRICS ROUTES ====================
  metrics: router({
    getRecent: adminProcedure
      .input(z.object({ days: z.number().default(7) }))
      .query(async ({ input }) => {
        return await db.getRecentMetrics(input.days);
      }),
    trackPageView: publicProcedure.mutation(async () => {
      await db.trackMetric('pageViews');
      return { success: true };
    }),
    trackWhatsAppClick: publicProcedure.mutation(async () => {
      await db.trackMetric('whatsappClicks' as any);
      return { success: true };
    }),
    getAuditLogs: adminProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ input }) => {
        return await db.getAuditLogs(input.limit);
      }),
  }),

  // ==================== CHATBOT ROUTES ====================
  chatbot: router({
    ask: publicProcedure
      .input(z.object({ message: z.string().min(1).max(500) }))
      .mutation(async ({ input }) => {
        const faqs = await db.getActiveFaqs();
        const faqContext = faqs.length > 0 
          ? faqs.map(f => `P: ${f.question}\nR: ${f.answer}`).join("\n\n")
          : "No hay preguntas frecuentes cargadas actualmente.";

        const systemPrompt = `Sos el asistente virtual de NewSwindon, un instituto de inglés con 35 años de trayectoria en Carapachay, Buenos Aires.
        
        INSTRUCCIONES:
        - Responde siempre en español de Argentina (usá el "voseo": vos, tenés, vení).
        - Sé amable, profesional y muy conciso.
        - Si el usuario pregunta algo que está en las PREGUNTAS FRECUENTES, usá esa información.
        - Si no conocés la respuesta exacta, sugerí contactar por WhatsApp (15 3070-7350).
        - Máximo 3 oraciones por respuesta.`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: input.message },
            ],
          });

          const messageContent = response.choices[0]?.message?.content;
          return { 
            response: typeof messageContent === 'string' ? messageContent : "¡Hola! Consultanos por WhatsApp al 15 3070-7350." 
          };
        } catch (error) {
          return { response: "¡Hola! Por favor escribinos al WhatsApp 15 3070-7350." };
        }
      }),

    listAll: adminProcedure.query(async () => {
      return await db.getAllFaqs();
    }),

    createFaq: adminProcedure
      .input(z.object({
        question: z.string().min(5),
        answer: z.string().min(10),
        category: z.string().optional(),
        isActive: z.boolean().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createFaq(input);
      }),

    updateFaq: adminProcedure
      .input(z.object({
        id: z.number(),
        question: z.string().min(5).optional(),
        answer: z.string().min(10).optional(),
        category: z.string().optional(),
        isActive: z.boolean().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateFaq(id, data);
        return { success: true };
      }),

    deleteFaq: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteFaq(input.id);
        return { success: true };
      }),
  }),

  // ==================== CONTENT ROUTES ====================
  content: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllContentBlocks();
    }),

    getByKey: publicProcedure
      .input(z.object({ key: z.string() }))
      .query(async ({ input }) => {
        const block = await db.getContentBlockByKey(input.key);
        return block ? (block.value || block.defaultValue) : undefined;
      }),

    update: protectedProcedure
      .use(({ ctx, next }) => {
        if (ctx.user.role !== 'super_admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo super_admin puede editar contenidos' });
        }
        return next({ ctx });
      })
      .input(z.object({
        key: z.string(),
        value: z.string(),
      }))
      .mutation(async ({ input }) => {
        await db.updateContentBlock(input.key, input.value);
        return { success: true };
      }),

    reset: protectedProcedure
      .use(({ ctx, next }) => {
        if (ctx.user.role !== 'super_admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Solo super_admin puede resetear contenidos' });
        }
        return next({ ctx });
      })
      .input(z.object({ key: z.string() }))
      .mutation(async ({ input }) => {
        await db.resetContentBlock(input.key);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
