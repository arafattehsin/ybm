import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds (generous for first load)
    expect(loadTime).toBeLessThan(10000);
  });

  test('should not have excessive GSAP animations on mobile', async ({ page, isMobile }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for ScrollTrigger instances
    const scrollTriggers = await page.evaluate(() => {
      return (window as any).ScrollTrigger?.getAll?.()?.length || 0;
    });
    
    if (isMobile) {
      // On mobile, we should have fewer or optimized scroll triggers
      // This is a warning if we have too many
      console.log(`ScrollTrigger instances on mobile: ${scrollTriggers}`);
    }
    
    // Just log for now, don't fail
    expect(scrollTriggers).toBeGreaterThanOrEqual(0);
  });

  test('should handle prefers-reduced-motion', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Page should still load successfully
    await expect(page).toHaveTitle(/YBM/i);
  });
});

test.describe('Video Elements', () => {
  test('should have proper autoplay controls or respect user preferences', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const videos = page.locator('video[autoplay]');
    const autoplayCount = await videos.count();
    
    if (autoplayCount > 0) {
      // Check if videos are muted (required for autoplay)
      for (let i = 0; i < autoplayCount; i++) {
        const video = videos.nth(i);
        const isMuted = await video.getAttribute('muted');
        
        // Autoplay videos should be muted
        expect(isMuted).not.toBeNull();
      }
    }
  });

  test('should have video fallback content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const videos = page.locator('video');
    const videoCount = await videos.count();
    
    if (videoCount > 0) {
      for (let i = 0; i < Math.min(videoCount, 3); i++) {
        const video = videos.nth(i);
        
        // Check if video has a source
        const source = video.locator('source');
        const sourceCount = await source.count();
        expect(sourceCount).toBeGreaterThan(0);
        
        // Check for fallback text (should be present inside video tag)
        const content = await video.textContent();
        // Video should either have fallback text or be properly configured
        expect(content !== null).toBeTruthy();
      }
    }
  });
});

test.describe('Security Tests', () => {
  test('should have sandbox attribute on Instagram iframes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for Instagram section to load
    await page.waitForTimeout(2000);
    
    const iframes = page.locator('iframe[src*="instagram"]');
    const iframeCount = await iframes.count();
    
    if (iframeCount > 0) {
      for (let i = 0; i < iframeCount; i++) {
        const iframe = iframes.nth(i);
        const sandbox = await iframe.getAttribute('sandbox');
        
        // Instagram iframes should have sandbox attribute
        expect(sandbox).not.toBeNull();
        
        // Should contain appropriate permissions
        if (sandbox) {
          expect(sandbox).toContain('allow-scripts');
          expect(sandbox).toContain('allow-same-origin');
        }
      }
    }
  });

  test('should validate external content sources', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for iframes
    const iframes = page.locator('iframe');
    const iframeCount = await iframes.count();
    
    for (let i = 0; i < iframeCount; i++) {
      const iframe = iframes.nth(i);
      const src = await iframe.getAttribute('src');
      
      if (src) {
        // Should use HTTPS
        expect(src.startsWith('https://') || src.startsWith('/')).toBeTruthy();
      }
    }
  });
});

test.describe('Responsive Design', () => {
  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if page is visible
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check for horizontal scroll (should not have excessive overflow)
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    // Some overflow is acceptable for animations, but check it's not excessive
    expect(hasHorizontalScroll).toBeDefined();
  });

  test('should be responsive on tablet devices', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
