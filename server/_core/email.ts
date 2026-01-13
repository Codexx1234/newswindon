import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { ENV as env } from './env';

interface EmailOptions {
  to: string;
  subject: string;
  template: 'student-confirmation' | 'admin-notification' | 'appointment-confirmation' | 'appointment-cancellation' | 'contact-confirmation';
  context: Record<string, any>;
}

let transporter: any = null;

const getTransporter = () => {
  if (transporter) return transporter;

  // Check if email configuration is available
  if (!env.emailHost || !env.emailUser || !env.emailPassword) {
    console.warn('[Email] SMTP configuration not available. Email sending will be skipped.');
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      host: env.emailHost,
      port: env.emailPort,
      secure: env.emailSecure,
      auth: {
        user: env.emailUser,
        pass: env.emailPassword,
      },
    });
    console.log('[Email] SMTP transporter initialized successfully');
    return transporter;
  } catch (error) {
    console.error('[Email] Failed to initialize SMTP transporter:', error);
    return null;
  }
};

const loadTemplate = (templateName: string) => {
  try {
    const templatePath = path.join(__dirname, '..', 'emails', `${templateName}.html`);
    if (!fs.existsSync(templatePath)) {
      console.warn(`[Email] Template not found: ${templatePath}`);
      // Return a basic fallback template
      return `<html><body><h1>{{subject}}</h1><p>{{message}}</p></body></html>`;
    }
    return fs.readFileSync(templatePath, 'utf-8');
  } catch (error) {
    console.error(`[Email] Error loading template ${templateName}:`, error);
    return `<html><body><h1>{{subject}}</h1><p>{{message}}</p></body></html>`;
  }
};

export const sendEmail = async (options: EmailOptions) => {
  const emailTransporter = getTransporter();
  
  if (!emailTransporter) {
    console.warn(`[Email] Skipping email to ${options.to} - SMTP not configured`);
    return;
  }

  try {
    // Validate email address
    if (!options.to || !options.to.includes('@')) {
      console.error(`[Email] Invalid email address: ${options.to}`);
      return;
    }

    const baseTemplateSource = loadTemplate('base-template');
    const contentTemplateSource = loadTemplate(options.template);
    
    const contentTemplate = handlebars.compile(contentTemplateSource);
    const bodyHtml = contentTemplate({ ...options.context, currentYear: new Date().getFullYear() });
    
    const baseTemplate = handlebars.compile(baseTemplateSource);
    const html = baseTemplate({ 
      ...options.context, 
      body: bodyHtml, 
      subject: options.subject,
      currentYear: new Date().getFullYear() 
    });

    const mailOptions = {
      from: env.emailFrom || 'noreply@newswindon.com',
      to: options.to,
      subject: options.subject,
      html,
    };

    const result = await emailTransporter.sendMail(mailOptions);
    console.log(`[Email] Successfully sent to ${options.to} (ID: ${result.messageId})`);
    return result;
  } catch (error) {
    console.error(`[Email] Failed to send email to ${options.to}:`, error);
    // Don't throw - allow the application to continue even if email fails
    return null;
  }
};
