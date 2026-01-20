/* global WebImporter */

/**
 * Cleanup transformer for Bangkok Bank pages
 * Removes navigation, footer, scripts, and other non-content elements
 *
 * Source: https://www.bangkokbank.com
 * Generated: 2026-01-19
 */

export default function transform(document) {
  // Remove navigation elements
  const navSelectors = [
    'header',
    'nav',
    '.header',
    '.main-nav',
    '.mega-menu',
    '.top-nav',
    '.navbar',
    '#header',
    '[class*="header"]',
    '[class*="navigation"]',
    '.breadcrumb',
    '.breadcrumbs'
  ];

  navSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.remove());
  });

  // Remove footer elements
  const footerSelectors = [
    'footer',
    '.footer',
    '#footer',
    '.footer-links',
    '.footer-nav',
    '[class*="footer"]'
  ];

  footerSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.remove());
  });

  // Remove scripts and styles
  document.querySelectorAll('script, style, noscript, link[rel="stylesheet"]').forEach(el => el.remove());

  // Remove Bangkok Bank specific non-content elements
  const bbSpecificSelectors = [
    '.cookie-consent',
    '.chat-widget',
    '.floating-menu',
    '.social-share',
    '.back-to-top',
    '.skip-link',
    '.sr-only',
    '[class*="cookie"]',
    '[class*="consent"]',
    '[class*="popup"]',
    '[class*="modal"]',
    '[class*="overlay"]',
    '[class*="chat"]',
    '[class*="widget"]'
  ];

  bbSpecificSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.remove());
  });

  // Remove hidden elements
  document.querySelectorAll('[aria-hidden="true"], .hidden, [style*="display: none"]').forEach(el => el.remove());

  // Clean up empty container divs (but keep structural ones)
  document.querySelectorAll('div:empty').forEach(el => {
    // Only remove if it has no class or only generic classes
    if (!el.className || el.className === '') {
      el.remove();
    }
  });

  // Fix relative URLs to absolute
  const baseUrl = 'https://www.bangkokbank.com';
  document.querySelectorAll('a[href^="/"]').forEach(a => {
    a.href = baseUrl + a.getAttribute('href');
  });

  document.querySelectorAll('img[src^="/"]').forEach(img => {
    img.src = baseUrl + img.getAttribute('src');
  });
}
