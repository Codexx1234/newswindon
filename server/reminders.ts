import { getDb } from "./db";
import { appointments } from "../drizzle/schema";
import { eq, and, lte, gte, isNull, or } from "drizzle-orm";
import { sendEmail } from "./_core/email";

export async function sendAppointmentReminders() {
  const db = await getDb();
  if (!db) return;

  console.log("[Reminders] Checking for upcoming appointments...");

  // Get appointments in the next 24-26 hours that haven't received a reminder
  const now = new Date();
  const tomorrowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000);
  const tomorrowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);

  try {
    const upcomingAppointments = await db.select().from(appointments).where(
      and(
        eq(appointments.status, "pendiente"),
        eq(appointments.reminderSent, false),
        gte(appointments.appointmentDate, tomorrowStart),
        lte(appointments.appointmentDate, tomorrowEnd)
      )
    );

    console.log(`[Reminders] Found ${upcomingAppointments.length} appointments to remind.`);

    for (const apt of upcomingAppointments) {
      try {
        await sendEmail({
          to: apt.email,
          subject: "Recordatorio: Tu cita en NewSwindon mañana",
          template: "appointment-confirmation", // Reusing confirmation template for now or create a new one
          context: {
            fullName: apt.fullName,
            appointmentDate: apt.appointmentDate.toLocaleString('es-AR'),
            appointmentType: apt.appointmentType,
            isReminder: true
          },
        });

        await db.update(appointments)
          .set({ reminderSent: true })
          .where(eq(appointments.id, apt.id));
          
        console.log(`[Reminders] Sent reminder to ${apt.email} for appointment ${apt.id}`);
      } catch (error) {
        console.error(`[Reminders] Failed to send reminder for appointment ${apt.id}:`, error);
      }
    }
  } catch (error) {
    console.error("[Reminders] Error fetching upcoming appointments:", error);
  }
}
