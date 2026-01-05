/* global WebImporter */

/**
 * Parser for hero-video block
 *
 * Source: https://www.nvidia.com/en-us/industries/robotics/
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: Block name header
 * - Row 2: Background image/video + heading + description + CTAs
 *
 * Generated: 2026-01-05
 */

export default function parse(element, { document }) {
  // Extract heading
  const heading = element.querySelector('h1, h2, .title, [class*="title"]');

  // Extract description/paragraphs
  const descriptions = Array.from(element.querySelectorAll('.description p, .general-container-text p, p'));

  // Extract CTAs/buttons
  const ctas = Array.from(element.querySelectorAll('a.btn-content, a.btncta, .cmp-teaser__action-link, a[class*="btn"], a[class*="cta"]'));

  // Extract background image if present
  const bgImage = element.querySelector('img, picture img, [class*="background"] img');

  // Build content container
  const contentContainer = document.createElement('div');

  // Add heading
  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    contentContainer.appendChild(h1);
  }

  // Add descriptions
  descriptions.slice(0, 3).forEach(desc => {
    if (desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      contentContainer.appendChild(p);
    }
  });

  // Add CTAs
  ctas.slice(0, 2).forEach(cta => {
    if (cta.href && cta.textContent.trim()) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.textContent.trim();
      const strong = document.createElement('strong');
      strong.appendChild(a);
      p.appendChild(strong);
      contentContainer.appendChild(p);
    }
  });

  // Build cells array
  const cells = [];

  // Add background image row if present
  if (bgImage) {
    const img = document.createElement('img');
    img.src = bgImage.src;
    img.alt = bgImage.alt || 'Hero background';
    cells.push([img]);
  }

  // Add content row
  cells.push([contentContainer]);

  // Create block using WebImporter
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Hero-Video',
    cells
  });

  // Replace element with block
  element.replaceWith(block);
}
