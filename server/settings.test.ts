import { describe, it, expect } from 'vitest';
import * as db from './db';

describe('Settings Functions', () => {
  it('should return default values when settings are not found', async () => {
    const phone = await db.getSetting('site_phone');
    expect(phone).toBeDefined();
    expect(phone).not.toBeNull();
    expect(typeof phone).toBe('string');
  });

  it('should return valid email setting', async () => {
    const email = await db.getSetting('site_email');
    expect(email).toBeDefined();
    expect(email).not.toBeNull();
    expect(typeof email).toBe('string');
  });

  it('should return valid hours setting', async () => {
    const hours = await db.getSetting('site_hours');
    expect(hours).toBeDefined();
    expect(hours).not.toBeNull();
    expect(typeof hours).toBe('string');
  });

  it('should return valid address setting', async () => {
    const address = await db.getSetting('site_address');
    expect(address).toBeDefined();
    expect(address).not.toBeNull();
    expect(typeof address).toBe('string');
  });

  it('should return valid feature flags', async () => {
    const inscriptions = await db.getSetting('feature_inscriptions');
    const chatbot = await db.getSetting('feature_chatbot');
    
    expect(inscriptions).toBeDefined();
    expect(chatbot).toBeDefined();
    expect(['true', 'false']).toContain(inscriptions);
    expect(['true', 'false']).toContain(chatbot);
  });

  it('should never return undefined', async () => {
    const settings = [
      'site_phone',
      'site_email',
      'site_address',
      'site_hours',
      'feature_inscriptions',
      'feature_chatbot',
    ];

    for (const key of settings) {
      const value = await db.getSetting(key);
      expect(value).toBeDefined();
      expect(value).not.toBeNull();
    }
  });
});
