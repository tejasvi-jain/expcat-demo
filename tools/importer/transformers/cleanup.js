/* global WebImporter */

/**
 * Cleanup transformer for NVIDIA pages
 * Removes navigation, footer, scripts, and other non-content elements
 *
 * Generated: 2026-01-05
 */

export default function transform(document) {
  // Remove navigation elements
  const navSelectors = [
    'header',
    'nav',
    '.nv-header',
    '.nv-navigation',
    '.nv-nav',
    '#main-nav',
    '[class*="header"]',
    '[class*="navigation"]'
  ];

  navSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.remove());
  });

  // Remove footer elements
  const footerSelectors = [
    'footer',
    '.nv-footer',
    '#footer',
    '[class*="footer"]'
  ];

  footerSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.remove());
  });

  // Remove scripts and styles
  document.querySelectorAll('script, style, noscript').forEach(el => el.remove());

  // Remove cookie banners and popups
  const popupSelectors = [
    '.cookie-banner',
    '.consent-banner',
    '[class*="cookie"]',
    '[class*="consent"]',
    '[class*="popup"]',
    '[class*="modal"]'
  ];

  popupSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.remove());
  });

  // Remove hidden elements
  document.querySelectorAll('[aria-hidden="true"], .hidden, .sr-only').forEach(el => el.remove());

  // Remove empty divs
  document.querySelectorAll('div:empty').forEach(el => el.remove());
}
