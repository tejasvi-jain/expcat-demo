/**
 * Cards Grid Block
 * Thumbnail cards with title overlay, hover effects, and scroll animation
 * Bangkok Bank Design System
 */

import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Sets up Intersection Observer for scroll-triggered animations
 * @param {HTMLElement} block - The cards-grid block element
 */
function setupScrollAnimation(block) {
  const cards = block.querySelectorAll('ul > li');

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // If reduced motion, show all cards immediately
    cards.forEach((card) => card.classList.add('animate-in'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  cards.forEach((card) => observer.observe(card));
}

/**
 * Makes the entire card clickable by finding the link
 * @param {HTMLElement} card - The card li element
 */
function setupCardClickHandler(card) {
  const link = card.querySelector('a');
  if (link) {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking directly on the link
      if (e.target.tagName !== 'A') {
        link.click();
      }
    });
  }
}

/**
 * Decorates the cards-grid block
 * @param {HTMLElement} block - The block element
 */
export default function decorate(block) {
  // Create ul/li structure
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    // Classify children
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-grid-card-image';
      } else {
        div.className = 'cards-grid-card-body';
      }
    });

    // Setup click handler for the entire card
    setupCardClickHandler(li);

    ul.append(li);
  });

  // Optimize images
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPicture);
  });

  block.replaceChildren(ul);

  // Setup scroll animation after a short delay to ensure DOM is ready
  requestAnimationFrame(() => {
    setupScrollAnimation(block);
  });
}
