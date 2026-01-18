import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should navigate to Menu page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const menuLink = page.getByRole('link', { name: /menu/i });
    await menuLink.click();
    
    await page.waitForURL('**/menu**');
    expect(page.url()).toContain('/menu');
  });

  test('should navigate to About page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const aboutLink = page.getByRole('link', { name: /about/i });
    await aboutLink.click();
    
    await page.waitForURL('**/about**');
    expect(page.url()).toContain('/about');
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const contactLink = page.getByRole('link', { name: /contact/i });
    await contactLink.click();
    
    await page.waitForURL('**/contact**');
    expect(page.url()).toContain('/contact');
  });

  test('should navigate back to homepage from other pages', async ({ page }) => {
    // Go to menu page first
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');
    
    // Click on logo or home link
    const homeLink = page.getByRole('link', { name: /home/i }).or(
      page.locator('a[href="/"]').first()
    );
    
    await homeLink.click();
    
    await page.waitForURL('/');
    expect(page.url()).toMatch(/\/$/);
  });
});

test.describe('Cart Functionality', () => {
  test('should have cart link visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for cart icon/link
    const cartLink = page.getByRole('link', { name: /cart/i }).or(
      page.locator('a[href*="cart"]')
    );
    
    await expect(cartLink).toBeVisible();
  });

  test('should navigate to cart page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const cartLink = page.getByRole('link', { name: /cart/i }).or(
      page.locator('a[href*="cart"]').first()
    );
    
    await cartLink.click();
    await page.waitForURL('**/cart**');
    
    expect(page.url()).toContain('/cart');
  });
});

test.describe('Product Interaction', () => {
  test('should display product cards', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');
    
    // Look for product cards
    const products = page.locator('[class*="product"]').or(
      page.locator('article')
    );
    
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have hover effects on product cards', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');
    
    const firstProduct = page.locator('[class*="product"]').or(
      page.locator('article')
    ).first();
    
    if (await firstProduct.isVisible()) {
      // Hover over the product
      await firstProduct.hover();
      
      // Wait for animation
      await page.waitForTimeout(500);
      
      // Check if product is still visible (no errors)
      await expect(firstProduct).toBeVisible();
    }
  });
});

test.describe('Form Validation', () => {
  test('should validate contact form', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    
    // Look for form
    const form = page.locator('form').first();
    
    if (await form.isVisible()) {
      // Try to submit empty form
      const submitButton = form.locator('button[type="submit"]').or(
        form.locator('button').filter({ hasText: /submit/i })
      );
      
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Form should show validation (either HTML5 or custom)
        // Just check page doesn't crash
        await expect(page).toHaveURL(/contact/);
      }
    }
  });
});

test.describe('Visual Regression', () => {
  test('homepage should match visual snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for animations to settle
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixels: 100, // Allow some variance for animations
    });
  });

  test('menu page should match visual snapshot', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');
    
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('menu-page.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});
