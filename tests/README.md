# UI Testing Documentation

## Overview

This project uses [Playwright](https://playwright.dev/) for end-to-end UI testing. The test suite covers functionality, accessibility, performance, security, and visual regression testing.

## Test Structure

The tests are organized into the following files:

### 1. `homepage.spec.ts`
- **Homepage UI Tests**: Validates the core homepage functionality
  - Page loading and title verification
  - Hero section visibility
  - Navigation links functionality
  - Featured products display
  - Video elements with fallback content
  - Testimonials section
  - Instagram section
  - Animation error handling

- **Accessibility Tests**: Ensures the site is accessible
  - Proper heading hierarchy
  - Alt text for images
  - Keyboard navigation support

### 2. `performance-security.spec.ts`
- **Performance Tests**: Validates site performance
  - Page load time benchmarks
  - GSAP animation optimization on mobile
  - Prefers-reduced-motion support

- **Video Element Tests**: Validates video implementation
  - Autoplay controls and muted state
  - Video fallback content

- **Security Tests**: Validates security best practices
  - Instagram iframe sandbox attributes
  - External content source validation (HTTPS)

- **Responsive Design Tests**: Validates responsive behavior
  - Mobile viewport (375x667)
  - Tablet viewport (768x1024)
  - Desktop viewport (1920x1080)

### 3. `navigation-interaction.spec.ts`
- **Navigation Tests**: Validates site navigation
  - Menu page navigation
  - About page navigation
  - Contact page navigation
  - Homepage navigation from other pages

- **Cart Functionality**: Validates cart features
  - Cart link visibility
  - Cart page navigation

- **Product Interaction**: Validates product features
  - Product card display
  - Hover effects on product cards

- **Form Validation**: Validates form handling
  - Contact form validation

- **Visual Regression**: Captures visual snapshots
  - Homepage screenshot
  - Menu page screenshot

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install --with-deps
   ```

### Run All Tests

```bash
npm test
```

### Run Tests in UI Mode

Interactive mode with time-travel debugging:
```bash
npm run test:ui
```

### Run Tests in Headed Mode

See the browser while tests run:
```bash
npm run test:headed
```

### Run Specific Test File

```bash
npx playwright test tests/homepage.spec.ts
```

### Run Tests for Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests on Mobile

```bash
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

### View Test Report

After running tests, view the HTML report:
```bash
npm run test:report
```

## Test Configuration

The test configuration is defined in `playwright.config.ts`:

- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile Devices**: Pixel 5, iPhone 12
- **Reporters**: HTML report
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure only
- **Trace**: On first retry

## Continuous Integration

The tests are configured to run automatically in CI environments:

- Tests run in parallel mode on local, sequential on CI
- Failed tests are retried up to 2 times on CI
- Screenshots and traces are captured on failure
- The dev server is automatically started before tests

## Test Coverage

The test suite covers:

### ✅ Functionality
- Page loading and navigation
- Interactive elements (links, buttons, forms)
- Product displays and interactions
- Cart functionality
- Video and iframe elements

### ✅ Accessibility
- Heading hierarchy
- Image alt text
- Keyboard navigation
- Screen reader compatibility considerations

### ✅ Performance
- Page load times
- Animation performance
- Mobile optimization
- Reduced motion preferences

### ✅ Security
- Iframe sandbox attributes
- HTTPS validation
- External content safety
- XSS prevention checks

### ✅ Responsive Design
- Mobile (375px)
- Tablet (768px)
- Desktop (1920px)
- Cross-browser compatibility

### ✅ Visual Regression
- Homepage snapshots
- Menu page snapshots
- Pixel-perfect comparisons

## Addressing PR Review Comments

This test suite specifically addresses the following issues identified in the PR review:

1. **GSAP Animation Performance**: Tests validate that animations don't cause performance issues, especially on mobile devices.

2. **Video Fallback Content**: Tests ensure all video elements have proper fallback content for accessibility.

3. **Instagram Iframe Security**: Tests verify that Instagram iframes have proper sandbox attributes to prevent security issues.

4. **Autoplay Video Accessibility**: Tests check that autoplay videos are muted and respect user preferences (prefers-reduced-motion).

5. **Responsive Design**: Tests validate that the design works correctly across mobile, tablet, and desktop viewports.

## Debugging Failed Tests

### View Screenshots

Failed test screenshots are saved in `test-results/`:
```bash
ls test-results/
```

### View Trace

Playwright captures traces on first retry. View them with:
```bash
npx playwright show-trace test-results/.../trace.zip
```

### Debug Mode

Run tests in debug mode:
```bash
npx playwright test --debug
```

## Best Practices

1. **Keep Tests Independent**: Each test should be able to run independently
2. **Use Proper Selectors**: Prefer user-facing selectors (role, text) over CSS selectors
3. **Wait for Network**: Use `waitForLoadState('networkidle')` when appropriate
4. **Handle Flakiness**: Use proper waits and assertions
5. **Test Real User Flows**: Focus on what users actually do

## Future Improvements

Potential enhancements for the test suite:

- [ ] Add tests for checkout flow
- [ ] Add tests for user authentication (if implemented)
- [ ] Add performance budgets and Lighthouse integration
- [ ] Add API mocking for isolated testing
- [ ] Add more comprehensive accessibility tests (axe-core)
- [ ] Add load testing scenarios
- [ ] Add tests for error states and edge cases

## Troubleshooting

### Tests Fail with "Target closed"
- The dev server might not be running
- Try increasing the `webServer.timeout` in `playwright.config.ts`

### Tests Fail with Font Errors
- Font loading from Google Fonts might fail in sandboxed environments
- These errors are filtered out in the animation tests

### Visual Regression Tests Fail
- Visual tests may fail due to animation timing
- Adjust `maxDiffPixels` in visual regression tests
- Regenerate snapshots with `npx playwright test --update-snapshots`

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)
