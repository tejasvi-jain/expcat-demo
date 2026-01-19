/* global WebImporter */

/**
 * Parser for cards-news block
 *
 * Source: https://www.bangkokbank.com/en/About-Us (Bank News section)
 * Base Block: cards
 *
 * Block Structure:
 * - Row 1: Block name header
 * - Row 2-N: Image | Description + Date + CTA (one row per news item)
 *
 * News cards with publication dates
 *
 * Generated: 2026-01-19
 */

export default function parse(element, { document }) {
  // Find all news card items
  const cardSelectors = [
    '.thumb-default:has(.promotion-valid)',
    '.stories .thumb-default',
    '.col-md-4 .thumb-default'
  ];

  let cards = [];

  for (const selector of cardSelectors) {
    try {
      const found = Array.from(element.querySelectorAll(selector));
      if (found.length > 0) {
        cards = found;
        break;
      }
    } catch (e) {
      // :has() selector may not be supported, try alternatives
      continue;
    }
  }

  // Fallback - find thumb-default items that have promotion-valid
  if (cards.length === 0) {
    const allCards = Array.from(element.querySelectorAll('.thumb-default'));
    cards = allCards.filter(card => card.querySelector('.promotion-valid'));
  }

  // If element itself is a card
  if (cards.length === 0) {
    cards = [element];
  }

  // Build cells array - one row per card
  const cells = [];

  cards.forEach(card => {
    // Extract image
    const imageCell = document.createElement('div');
    const imgEl = card.querySelector('.inner img, img');

    if (imgEl) {
      const img = document.createElement('img');
      img.src = imgEl.src;
      img.alt = imgEl.alt || '';
      imageCell.appendChild(img);
    }

    // Extract content
    const contentCell = document.createElement('div');

    // Description text (news headline)
    const desc = card.querySelector('.caption .desc, .caption p, .desc');
    if (desc && desc.textContent.trim()) {
      const span = document.createElement('span');
      span.textContent = desc.textContent.trim();
      contentCell.appendChild(span);
      contentCell.appendChild(document.createElement('br'));
      contentCell.appendChild(document.createElement('br'));
    }

    // Publication date
    const date = card.querySelector('.promotion-valid, .date, time');
    if (date && date.textContent.trim()) {
      const em = document.createElement('em');
      em.textContent = date.textContent.trim();
      contentCell.appendChild(em);
      contentCell.appendChild(document.createElement('br'));
      contentCell.appendChild(document.createElement('br'));
    }

    // CTA link
    const cta = card.querySelector('.button-group a, a.btn-primary, a[href*="News-Detail"]');
    if (cta && cta.href) {
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.textContent.trim() || 'Read more';
      contentCell.appendChild(a);
    }

    // Add row if we have content
    if (imageCell.hasChildNodes() || contentCell.hasChildNodes()) {
      cells.push([imageCell, contentCell]);
    }
  });

  // Create block using WebImporter
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards-News',
    cells
  });

  // Replace element with block
  element.replaceWith(block);
}
