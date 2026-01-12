import { google } from 'googleapis';
import { ENV } from './env';
import * as db from '../db';

/**
 * Google Calendar Service
 * Handles event creation and deletion for appointments
 */
export class CalendarService {
  private static auth: any = null;
  private static eventIds: Map<number, string> = new Map(); // Store appointment ID -> Google event ID mapping

  private static async getAuth() {
    if (this.auth) return this.auth;

    // Check if we have the necessary credentials in ENV
    if (!ENV.GOOGLE_CLIENT_EMAIL || !ENV.GOOGLE_PRIVATE_KEY) {
      console.warn('[Calendar] Google credentials not found in ENV. Skipping calendar integration.');
      return null;
    }

    try {
      this.auth = new google.auth.JWT({
        email: ENV.GOOGLE_CLIENT_EMAIL,
        key: ENV.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/calendar']
      });
      return this.auth;
    } catch (error) {
      console.error('[Calendar] Failed to initialize Google Auth:', error);
      return null;
    }
  }

  /**
   * Create a calendar event for an appointment
   */
  static async createEvent(appointment: {
    fullName: string;
    email: string;
    phone: string;
    appointmentType: string;
    date: Date;
    hour: string;
    appointmentId?: number;
  }) {
    const auth = await this.getAuth();
    if (!auth) return;

    // Get the admin email from settings
    const adminEmail = await db.getSetting('google_admin_email');
    if (!adminEmail) {
      console.warn('[Calendar] Admin email not configured in settings. Skipping event creation.');
      return;
    }

    const calendar = google.calendar({ version: 'v3', auth });

    // Parse start time
    const [hours, minutes] = appointment.hour.split(':').map(Number);
    const startDate = new Date(appointment.date);
    startDate.setHours(hours, minutes, 0, 0);
    
    // End time is 1 hour later
    const endDate = new Date(startDate.getTime() + 60 * 60000);

    const event = {
      summary: `Entrevista: ${appointment.fullName} (${appointment.appointmentType})`,
      location: 'NewSwindon Academia',
      description: `
        Nombre: ${appointment.fullName}
        Email: ${appointment.email}
        Teléfono: ${appointment.phone}
        Tipo: ${appointment.appointmentType}
        ID Cita: ${appointment.appointmentId || 'N/A'}
        
        Agendado desde la web.
      `,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'America/Argentina/Buenos_Aires',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'America/Argentina/Buenos_Aires',
      },
      attendees: [
        { email: adminEmail },
        { email: appointment.email }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    try {
      const result = await calendar.events.insert({
        calendarId: adminEmail,
        requestBody: event,
      });
      
      if (appointment.appointmentId && result.data.id) {
        this.eventIds.set(appointment.appointmentId, result.data.id);
        // Store the event ID in the database for future reference
        await db.updateAppointment(appointment.appointmentId, {
          googleCalendarEventId: result.data.id as any
        });
      }
      
      console.log(`[Calendar] Event created successfully for ${appointment.fullName}`);
      return result.data.id;
    } catch (error) {
      console.error('[Calendar] Failed to create event:', error);
      return null;
    }
  }

  /**
   * Delete a calendar event
   */
  static async deleteEvent(appointmentId: number, eventId?: string) {
    const auth = await this.getAuth();
    if (!auth) return;

    // Get the admin email from settings
    const adminEmail = await db.getSetting('google_admin_email');
    if (!adminEmail) {
      console.warn('[Calendar] Admin email not configured. Skipping event deletion.');
      return;
    }

    // Try to get event ID from memory or database
    let googleEventId = eventId || this.eventIds.get(appointmentId);
    
    if (!googleEventId) {
      // Try to get it from the appointment record
      const appointment = await db.getAppointmentById(appointmentId);
      if (appointment && (appointment as any).googleCalendarEventId) {
        googleEventId = (appointment as any).googleCalendarEventId;
      }
    }

    if (!googleEventId) {
      console.warn(`[Calendar] No event ID found for appointment ${appointmentId}`);
      return;
    }

    const calendar = google.calendar({ version: 'v3', auth });

    try {
      await calendar.events.delete({
        calendarId: adminEmail,
        eventId: googleEventId,
      });
      console.log(`[Calendar] Event deleted successfully for appointment ${appointmentId}`);
      this.eventIds.delete(appointmentId);
    } catch (error) {
      console.error(`[Calendar] Failed to delete event ${googleEventId}:`, error);
    }
  }
}
