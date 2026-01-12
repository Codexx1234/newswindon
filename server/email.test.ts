import { describe, it, expect } from 'vitest';
import { sendEmail } from './_core/email';

describe('Email Configuration', () => {
  it('should have all required SMTP environment variables configured', () => {
    expect(process.env.EMAIL_HOST).toBeDefined();
    expect(process.env.EMAIL_PORT).toBeDefined();
    expect(process.env.EMAIL_USER).toBeDefined();
    expect(process.env.EMAIL_PASSWORD).toBeDefined();
    expect(process.env.EMAIL_FROM).toBeDefined();
    expect(process.env.ADMIN_EMAIL).toBeDefined();
  });

  it('should have valid SMTP configuration values', () => {
    expect(process.env.EMAIL_HOST).toBe('smtp.gmail.com');
    expect(process.env.EMAIL_PORT).toBe('587');
    expect(process.env.EMAIL_SECURE).toBe('false');
    expect(process.env.EMAIL_USER).toContain('@gmail.com');
    expect(process.env.EMAIL_FROM).toBeDefined();
    expect(process.env.ADMIN_EMAIL).toBeDefined();
  });

  it('should be able to send test email', async () => {
    const result = await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@newswindon.com',
      subject: 'Test Email - NewSwindon SMTP Configuration',
      template: 'admin-notification',
      context: {
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        contactType: 'Test',
        message: 'This is a test email to verify SMTP configuration',
      },
    });

    expect(result).toBeDefined();
  });
});
