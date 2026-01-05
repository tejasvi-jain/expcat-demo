/* global WebImporter */

/**
 * Parser for columns-two block
 *
 * Source: https://www.nvidia.com/en-us/industries/robotics/
 * Base Block: columns
 *
 * Block Structure:
 * - Row 1: Block name header
 * - Row 2: Column 1 | Column 2 content
 *
 * Generated: 2026-01-05
 */

export default function parse(element, { document }) {
  // Find column containers
  const columnSelectors = [
    '.aem-GridColumn',
    '[class*="col-"]',
    '.column',
    '> div > div'
  ];

  let columns = [];

  for (const selector of columnSelectors) {
    const found = Array.from(element.querySelectorAll(selector));
    if (found.length >= 2) {
      columns = found.slice(0, 2);
      break;
    }
  }

  // If no columns found, try direct children
  if (columns.length < 2) {
    const directDivs = Array.from(element.querySelectorAll(':scope > div > div'));
    if (directDivs.length >= 2) {
      columns = directDivs.slice(0, 2);
    }
  }

  // Build cells array
  const cells = [];
  const row = [];

  columns.forEach(col => {
    const cell = document.createElement('div');

    // Check if this column contains an image
    const img = col.querySelector('img');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      cell.appendChild(newImg);
    }

    // Extract heading
    const heading = col.querySelector('h2, h3, h4, .title, .cmp-teaser__title');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      cell.appendChild(h3);
    }

    // Extract paragraphs
    const paragraphs = col.querySelectorAll('p, .description');
    paragraphs.forEach(p => {
      if (p.textContent.trim()) {
        const newP = document.createElement('p');
        newP.textContent = p.textContent.trim();
        cell.appendChild(newP);
      }
    });

    // Extract links/CTAs
    const links = col.querySelectorAll('a[href]');
    links.forEach(link => {
      if (link.href && link.textContent.trim()) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent.trim();

        // Check if it's a primary CTA
        if (link.classList.contains('btn') || link.classList.contains('btncta') ||
            link.classList.contains('cta') || link.classList.toString().includes('button')) {
          const strong = document.createElement('strong');
          strong.appendChild(a);
          p.appendChild(strong);
        } else {
          p.appendChild(a);
        }
        cell.appendChild(p);
      }
    });

    row.push(cell);
  });

  if (row.length > 0) {
    cells.push(row);
  }

  // Create block using WebImporter
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns-Two',
    cells
  });

  // Replace element with block
  element.replaceWith(block);
}
