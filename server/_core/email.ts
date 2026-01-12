import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { ENV as env } from './env';

interface EmailOptions {
  to: string;
  subject: string;
  template: 'student-confirmation' | 'admin-notification';
  context: Record<string, any>;
}

const transporter = nodemailer.createTransport({
  host: env.emailHost,
  port: env.emailPort,
  secure: env.emailSecure,
  auth: {
    user: env.emailUser,
    pass: env.emailPassword,
  },
});

const loadTemplate = (templateName: string) => {
  const templatePath = path.join(__dirname, '..', 'emails', `${templateName}.html`);
  return fs.readFileSync(templatePath, 'utf-8');
};

export const sendEmail = async (options: EmailOptions) => {
  try {
    const templateSource = loadTemplate(options.template);
    const template = handlebars.compile(templateSource);
    const html = template({ ...options.context, currentYear: new Date().getFullYear() });

    const mailOptions = {
      from: env.emailFrom,
      to: options.to,
      subject: options.subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.to} with subject: ${options.subject}`);
  } catch (error) {
    console.error(`Error sending email to ${options.to}:`, error);
    throw new Error('Failed to send email');
  }
};
