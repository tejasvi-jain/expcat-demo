/* global WebImporter */

/**
 * Parser for cards-dark block
 *
 * Source: https://www.bangkokbank.com/en/About-Us (Careers section)
 * Base Block: cards
 *
 * Block Structure:
 * - Row 1: Block name header
 * - Row 2-N: Image | Title + Description (one row per card)
 *
 * Cards with background images on dark section
 *
 * Generated: 2026-01-19
 */

export default function parse(element, { document }) {
  // Find all card items with background images
  const cardSelectors = [
    '.thumb-square-caption',
    '[class*="thumb-square"]',
    '.col-sm-4 > div[style*="background"]'
  ];

  let cards = [];

  for (const selector of cardSelectors) {
    const found = Array.from(element.querySelectorAll(selector));
    if (found.length > 0) {
      cards = found;
      break;
    }
  }

  // If element itself is a card
  if (cards.length === 0) {
    cards = [element];
  }

  // Build cells array - one row per card
  const cells = [];

  cards.forEach(card => {
    // Extract background image
    const imageCell = document.createElement('div');
    const bgStyle = card.style?.backgroundImage || card.getAttribute('style') || '';
    const bgMatch = bgStyle.match(/url\(['"]?([^'"]+)['"]?\)/);

    if (bgMatch) {
      const img = document.createElement('img');
      img.src = bgMatch[1];
      img.alt = '';
      imageCell.appendChild(img);
    } else {
      const imgEl = card.querySelector('img');
      if (imgEl) {
        const img = document.createElement('img');
        img.src = imgEl.src;
        img.alt = imgEl.alt || '';
        imageCell.appendChild(img);
      }
    }

    // Extract content
    const contentCell = document.createElement('div');

    // Title
    const title = card.querySelector('h2, h3, h4, .title-2, .title-3, [class*="title"]');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      contentCell.appendChild(strong);
      contentCell.appendChild(document.createElement('br'));
    }

    // Description
    const desc = card.querySelector('.text-default, p, .info p');
    if (desc && desc.textContent.trim()) {
      const span = document.createElement('span');
      span.textContent = desc.textContent.trim();
      contentCell.appendChild(span);
    }

    // Add row if we have content
    if (imageCell.hasChildNodes() || contentCell.hasChildNodes()) {
      cells.push([imageCell, contentCell]);
    }
  });

  // Create block using WebImporter
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards-Dark',
    cells
  });

  // Replace element with block
  element.replaceWith(block);
}
