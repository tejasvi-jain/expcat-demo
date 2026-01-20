/* global WebImporter */

/**
 * Parser for hero-banner block
 *
 * Source: https://www.bangkokbank.com/en/About-Us
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: Block name header
 * - Row 2: Background image
 * - Row 3: Title + Description + CTA
 *
 * Generated: 2026-01-19
 */

export default function parse(element, { document }) {
  const cells = [];

  // Extract background image
  const imageCell = document.createElement('div');

  // Check for background-image style
  const bgStyle = element.style?.backgroundImage || element.getAttribute('style') || '';
  const bgMatch = bgStyle.match(/url\(['"]?([^'"]+)['"]?\)/);

  if (bgMatch) {
    const img = document.createElement('img');
    img.src = bgMatch[1];
    img.alt = '';
    imageCell.appendChild(img);
  } else {
    // Look for img in .thumb, .desktop-banner
    const heroImg = element.querySelector('.thumb img, .desktop-banner img, img');
    if (heroImg) {
      const img = document.createElement('img');
      img.src = heroImg.src;
      img.alt = heroImg.alt || '';
      imageCell.appendChild(img);
    }
  }

  if (imageCell.hasChildNodes()) {
    cells.push([imageCell]);
  }

  // Extract content
  const contentCell = document.createElement('div');

  // Eyebrow/subtitle text
  const eyebrow = element.querySelector('.sub-title-medium, .sub-title-small, h4');
  if (eyebrow && eyebrow.textContent.trim()) {
    const span = document.createElement('span');
    span.textContent = eyebrow.textContent.trim();
    contentCell.appendChild(span);
    contentCell.appendChild(document.createElement('br'));
  }

  // Main heading
  const heading = element.querySelector('h1, h2, h3.title-1, .title-1, .caption h3');
  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    contentCell.appendChild(h1);
    contentCell.appendChild(document.createElement('br'));
  }

  // Description text
  const desc = element.querySelector('.caption p, .content p, .text-default, p');
  if (desc && desc.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = desc.textContent.trim();
    contentCell.appendChild(p);
    contentCell.appendChild(document.createElement('br'));
  }

  // CTA button
  const cta = element.querySelector('.button-group a, a.btn-primary, a[class*="btn"]');
  if (cta && cta.href) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    const a = document.createElement('a');
    a.href = cta.href;
    a.textContent = cta.textContent.trim() || 'Learn More';
    strong.appendChild(a);
    p.appendChild(strong);
    contentCell.appendChild(p);
  }

  if (contentCell.hasChildNodes()) {
    cells.push([contentCell]);
  }

  // Create block using WebImporter
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Hero-Banner',
    cells
  });

  // Replace element with block
  element.replaceWith(block);
}
