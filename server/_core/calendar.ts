import { google } from 'googleapis';
import { ENV } from './env';
import * as db from '../db';

/**
 * Google Calendar Service
 * Handles event creation for appointments
 */
export class CalendarService {
  private static auth: any = null;

  private static async getAuth() {
    if (this.auth) return this.auth;

    // Check if we have the necessary credentials in ENV
    if (!ENV.GOOGLE_CLIENT_EMAIL || !ENV.GOOGLE_PRIVATE_KEY) {
      console.warn('[Calendar] Google credentials not found in ENV. Skipping calendar integration.');
      return null;
    }

    try {
      this.auth = new google.auth.JWT(
        ENV.GOOGLE_CLIENT_EMAIL,
        undefined,
        ENV.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/calendar']
      );
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
    
    // End time is 30 minutes later
    const endDate = new Date(startDate.getTime() + 30 * 60000);

    const event = {
      summary: `Entrevista: ${appointment.fullName} (${appointment.appointmentType})`,
      location: 'NewSwindon Academia',
      description: `
        Nombre: ${appointment.fullName}
        Email: ${appointment.email}
        Teléfono: ${appointment.phone}
        Tipo: ${appointment.appointmentType}
        
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
      await calendar.events.insert({
        calendarId: adminEmail,
        requestBody: event,
      });
      console.log(`[Calendar] Event created successfully for ${appointment.fullName}`);
    } catch (error) {
      console.error('[Calendar] Failed to create event:', error);
    }
  }
}
