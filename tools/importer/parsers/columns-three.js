/* global WebImporter */

/**
 * Parser for columns-three block
 *
 * Source: https://www.nvidia.com/en-us/industries/robotics/
 * Base Block: columns
 *
 * Block Structure:
 * - Row 1: Block name header
 * - Row 2: Column 1 | Column 2 | Column 3 content
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
    if (found.length >= 3) {
      columns = found.slice(0, 3);
      break;
    }
  }

  // If no columns found, try direct children
  if (columns.length < 3) {
    const directDivs = Array.from(element.querySelectorAll(':scope > div > div'));
    if (directDivs.length >= 3) {
      columns = directDivs.slice(0, 3);
    }
  }

  // Build cells array
  const cells = [];
  const row = [];

  columns.forEach(col => {
    const cell = document.createElement('div');

    // Extract heading
    const heading = col.querySelector('h2, h3, h4, .title');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      cell.appendChild(h3);
    }

    // Extract list items
    const listItems = col.querySelectorAll('li, .list-item');
    if (listItems.length > 0) {
      const ul = document.createElement('ul');
      listItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.textContent.trim();
        ul.appendChild(li);
      });
      cell.appendChild(ul);
    }

    // Extract paragraphs
    const paragraphs = col.querySelectorAll('p');
    paragraphs.forEach(p => {
      if (p.textContent.trim() && !p.closest('li')) {
        const newP = document.createElement('p');
        newP.textContent = p.textContent.trim();
        cell.appendChild(newP);
      }
    });

    // Extract link
    const link = col.querySelector('a[href]');
    if (link && link.href) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim() || 'Learn More';
      cell.appendChild(a);
    }

    row.push(cell);
  });

  if (row.length > 0) {
    cells.push(row);
  }

  // Create block using WebImporter
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns-Three',
    cells
  });

  // Replace element with block
  element.replaceWith(block);
}
