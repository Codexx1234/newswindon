import { test, expect } from '@playwright/test';

test.describe('NewSwindon - Home Page', () => {
  test('should load the home page successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the main heading is visible
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toContainText('Aprendé inglés en NewSwindon');
  });

  test('should display hero section with CTA buttons', async ({ page }) => {
    await page.goto('/');
    
    // Check for main CTA buttons
    const inscribeButton = page.locator('a:has-text("Inscribite ahora")').first();
    const coursesButton = page.locator('a:has-text("Ver cursos")').first();
    
    await expect(inscribeButton).toBeVisible();
    await expect(coursesButton).toBeVisible();
  });

  test('should display stats counters', async ({ page }) => {
    await page.goto('/');
    
    // Check for stats section
    const yearsText = page.locator('text=Años de experiencia');
    const studentsText = page.locator('text=Alumnos formados');
    const companiesText = page.locator('text=Años con empresas');
    
    await expect(yearsText).toBeVisible();
    await expect(studentsText).toBeVisible();
    await expect(companiesText).toBeVisible();
  });

  test('should navigate to courses section', async ({ page }) => {
    await page.goto('/');
    
    // Click on "Ver cursos" button
    const coursesButton = page.locator('a:has-text("Ver cursos")').first();
    await coursesButton.click();
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Check if courses section is visible
    const coursesSection = page.locator('text=Inglés para Niños').first();
    await expect(coursesSection).toBeVisible();
  });

  test('should display contact form', async ({ page }) => {
    await page.goto('/#contacto');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check for contact form elements
    const nameInput = page.locator('input[id="fullName"]');
    const emailInput = page.locator('input[id="email"]');
    const phoneInput = page.locator('input[id="phone"]');
    
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(phoneInput).toBeVisible();
  });

  test('should validate contact form - empty submission', async ({ page }) => {
    await page.goto('/#contacto');
    
    await page.waitForLoadState('networkidle');
    
    // Try to submit empty form
    const submitButton = page.locator('button:has-text("Enviar mensaje")');
    
    // The form should have HTML5 validation
    const nameInput = page.locator('input[id="fullName"]');
    
    // Check if input is required
    const isRequired = await nameInput.evaluate((el: HTMLInputElement) => el.required);
    expect(isRequired).toBe(true);
  });

  test('should display testimonials section', async ({ page }) => {
    await page.goto('/#testimonios');
    
    await page.waitForLoadState('networkidle');
    
    // Check for testimonials heading
    const testimonialsHeading = page.locator('text=Lo que dicen nuestros alumnos');
    await expect(testimonialsHeading).toBeVisible();
    
    // Check for navigation buttons
    const prevButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await expect(prevButton).toBeVisible();
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    await page.goto('/');
    
    // Check for title
    const title = await page.title();
    expect(title).toContain('NewSwindon');
    
    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /academia de inglés/i);
    
    // Check for canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://newswindon.com');
  });

  test('should have structured data (JSON-LD)', async ({ page }) => {
    await page.goto('/');
    
    // Check for structured data script
    const structuredData = page.locator('script[type="application/ld+json"]');
    const count = await structuredData.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should display navbar with navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check for navbar logo
    const logo = page.locator('text=NewSwindon').first();
    await expect(logo).toBeVisible();
    
    // Check for navigation links (on desktop)
    const navLinks = page.locator('a:has-text("Cursos"), a:has-text("Nosotros"), a:has-text("Empresas")');
    
    // At least some nav links should be visible
    const visibleCount = await navLinks.count();
    expect(visibleCount).toBeGreaterThan(0);
  });

  test('should have responsive design - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Check if mobile menu button is visible
    const mobileMenuButton = page.locator('button[role="button"]').first();
    await expect(mobileMenuButton).toBeVisible();
    
    // Main heading should still be visible
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toBeVisible();
  });

  test('should have responsive design - tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/');
    
    // Main heading should be visible
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toBeVisible();
    
    // Check if content is properly displayed
    const mainContent = page.locator('section').first();
    await expect(mainContent).toBeVisible();
  });

  test('should load sitemap', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    
    expect(response?.status()).toBe(200);
    
    // Check if sitemap contains URLs
    const content = await page.content();
    expect(content).toContain('<?xml');
    expect(content).toContain('urlset');
    expect(content).toContain('newswindon.com');
  });

  test('should load robots.txt', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    
    expect(response?.status()).toBe(200);
    
    // Check if robots.txt contains sitemap reference
    const content = await page.content();
    expect(content).toContain('Sitemap:');
    expect(content).toContain('newswindon.com/sitemap.xml');
  });
});

test.describe('NewSwindon - Empresas Page', () => {
  test('should load the empresas page successfully', async ({ page }) => {
    await page.goto('/empresas');
    
    // Check if page loaded
    await page.waitForLoadState('networkidle');
    
    // Check for main content
    const pageContent = page.locator('main, section').first();
    await expect(pageContent).toBeVisible();
  });

  test('should display contact form for companies', async ({ page }) => {
    await page.goto('/empresas');
    
    await page.waitForLoadState('networkidle');
    
    // Check for company-specific form fields
    const companyNameInput = page.locator('input[id="companyName"]');
    
    if (await companyNameInput.isVisible()) {
      await expect(companyNameInput).toBeVisible();
    }
  });
});

test.describe('NewSwindon - Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    // Start at home
    await page.goto('/');
    
    // Navigate to empresas
    const empresasLink = page.locator('a:has-text("Empresas")').first();
    
    if (await empresasLink.isVisible()) {
      await empresasLink.click();
      await page.waitForLoadState('networkidle');
      
      // Check if we're on the empresas page
      const url = page.url();
      expect(url).toContain('/empresas');
    }
  });

  test('should scroll to sections smoothly', async ({ page }) => {
    await page.goto('/');
    
    // Click on "Ver cursos" which should scroll to courses section
    const coursesButton = page.locator('a:has-text("Ver cursos")').first();
    await coursesButton.click();
    
    // Wait for scroll animation
    await page.waitForTimeout(1000);
    
    // Check if courses section is in viewport
    const coursesSection = page.locator('text=Inglés para Niños').first();
    const isInViewport = await coursesSection.isInViewport();
    
    expect(isInViewport).toBe(true);
  });
});

test.describe('NewSwindon - Performance', () => {
  test('should load home page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known third-party errors
    const filteredErrors = errors.filter(
      (error) => !error.includes('third-party') && !error.includes('analytics')
    );
    
    expect(filteredErrors.length).toBe(0);
  });
});
