/* global WebImporter */

/**
 * Parser for cards-grid block
 *
 * Source: https://www.nvidia.com/en-us/industries/robotics/
 * Base Block: cards
 *
 * Block Structure:
 * - Row 1: Block name header
 * - Row 2-N: Image | Title + Description + Link (one row per card)
 *
 * Generated: 2026-01-05
 */

export default function parse(element, { document }) {
  // Find all card items
  const cardSelectors = [
    '.nv-usecase--card',
    '.nv-teaser--card',
    '.cmp-teaser',
    '[class*="card"]'
  ];

  let cards = [];

  for (const selector of cardSelectors) {
    const found = Array.from(element.querySelectorAll(selector));
    if (found.length > 0) {
      cards = found;
      break;
    }
  }

  // If no cards found, try to parse element itself as a card
  if (cards.length === 0) {
    cards = [element];
  }

  // Build cells array - one row per card
  const cells = [];

  cards.forEach(card => {
    // Extract image
    const img = card.querySelector('img');
    const imageCell = document.createElement('div');

    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      imageCell.appendChild(newImg);
    }

    // Extract content
    const contentCell = document.createElement('div');

    // Title
    const title = card.querySelector('h2, h3, h4, .title, .cmp-teaser__title, [class*="title"]');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      contentCell.appendChild(strong);
      contentCell.appendChild(document.createElement('br'));
    }

    // Subtitle or description
    const description = card.querySelector('.description, .cmp-teaser__description, p, [class*="subtitle"]');
    if (description) {
      const span = document.createElement('span');
      span.textContent = description.textContent.trim();
      contentCell.appendChild(span);
      contentCell.appendChild(document.createElement('br'));
    }

    // Link
    const link = card.querySelector('a[href], .cmp-teaser__action-link, [class*="btn"]');
    if (link && link.href) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim() || 'Learn More';
      contentCell.appendChild(a);
    }

    // Add row if we have content
    if (imageCell.hasChildNodes() || contentCell.hasChildNodes()) {
      cells.push([imageCell, contentCell]);
    }
  });

  // Create block using WebImporter
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards-Grid',
    cells
  });

  // Replace element with block
  element.replaceWith(block);
}
