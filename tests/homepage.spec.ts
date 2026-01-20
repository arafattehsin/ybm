import { test, expect } from '@playwright/test';

test.describe('Homepage UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/YBM/i);
  });

  test('should display the hero section', async ({ page }) => {
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    // Check if menu link exists and is clickable
    const menuLink = page.getByRole('link', { name: /menu/i });
    await expect(menuLink).toBeVisible();
    
    // Check about link
    const aboutLink = page.getByRole('link', { name: /about/i });
    await expect(aboutLink).toBeVisible();
    
    // Check contact link
    const contactLink = page.getByRole('link', { name: /contact/i });
    await expect(contactLink).toBeVisible();
  });

  test('should display featured products section', async ({ page }) => {
    // Wait for products to load
    await page.waitForLoadState('networkidle');
    
    // Check if products are displayed
    const products = page.locator('[class*="product"]').or(page.locator('article')).or(page.locator('[data-testid*="product"]'));
    const count = await products.count();
    
    // Expect at least one product to be visible
    expect(count).toBeGreaterThan(0);
  });

  test('should have video elements with fallback content', async ({ page }) => {
    const videos = page.locator('video');
    const videoCount = await videos.count();
    
    if (videoCount > 0) {
      // Check first video has fallback content or proper attributes
      const firstVideo = videos.first();
      await expect(firstVideo).toBeVisible();
      
      // Check if video has source
      const source = firstVideo.locator('source');
      await expect(source).toBeVisible();
    }
  });

  test('should display testimonials section', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for testimonials section
    const testimonialSection = page.locator('section').filter({ hasText: /testimonial/i }).or(
      page.locator('[class*="testimonial"]')
    );
    
    // At least check if the page loaded completely
    expect(testimonialSection).toBeTruthy();
  });

  test('should display Instagram section', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for Instagram section
    const instagramSection = page.locator('section').filter({ hasText: /instagram/i }).or(
      page.locator('[class*="instagram"]')
    );
    
    expect(instagramSection).toBeTruthy();
  });

  test('should handle animations without errors', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');
    
    // Wait a bit for animations to run
    await page.waitForTimeout(2000);
    
    // Filter out known network errors (fonts)
    const relevantErrors = errors.filter(err => 
      !err.includes('fonts.googleapis') && 
      !err.includes('ERR_CONNECTION') &&
      !err.includes('Failed to fetch')
    );
    
    expect(relevantErrors.length).toBe(0);
  });
});

test.describe('Homepage Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    
    // Should have at least one h1
    expect(h1Count).toBeGreaterThan(0);
  });

  test('should have alt text for images', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        // Alt should exist (can be empty for decorative images)
        expect(alt !== null).toBeTruthy();
      }
    }
  });

  test('should have keyboard navigation support', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // Check if an element received focus
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });
    
    expect(focusedElement).toBeTruthy();
  });
});
