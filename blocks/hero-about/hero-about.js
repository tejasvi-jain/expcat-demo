/**
 * Hero About Block
 * Full-width corporate hero with scroll cue animation
 * Bangkok Bank Design System
 */

/**
 * Creates the scroll cue element with mouse icon animation
 * @returns {HTMLElement} The scroll cue anchor element
 */
function createScrollCue() {
  const scrollCue = document.createElement('a');
  scrollCue.href = '#main-content';
  scrollCue.className = 'scroll-cue';
  scrollCue.setAttribute('aria-label', 'Scroll to main content');

  scrollCue.innerHTML = `
    <span class="scroll-cue-icon" aria-hidden="true"></span>
    <span class="scroll-cue-text">Scroll</span>
  `;

  return scrollCue;
}

/**
 * Handles smooth scrolling when scroll cue is clicked
 * @param {Event} event - Click event
 */
function handleScrollCueClick(event) {
  event.preventDefault();

  // Find the next section after the hero
  const heroContainer = event.currentTarget.closest('.hero-about-container');
  const nextSection = heroContainer?.nextElementSibling;

  if (nextSection) {
    const headerHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '64',
      10,
    );

    const targetPosition = nextSection.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  }
}

/**
 * Decorates the hero-about block
 * @param {HTMLElement} block - The block element
 */
export default function decorate(block) {
  // Check if block has an image anywhere (EDS structure: div > div > picture)
  const hasImage = block.querySelector('picture');

  if (!hasImage) {
    block.classList.add('no-image');
  }

  // Add scroll cue element
  const scrollCue = createScrollCue();
  scrollCue.addEventListener('click', handleScrollCueClick);
  block.appendChild(scrollCue);

  // Add ID to next section for accessibility skip-link
  const heroContainer = block.closest('.hero-about-container');
  const nextSection = heroContainer?.nextElementSibling;
  if (nextSection && !nextSection.id) {
    nextSection.id = 'main-content';
  }

  // Optional: Fade in animation on load
  block.style.opacity = '0';
  block.style.transform = 'translateY(10px)';
  block.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

  requestAnimationFrame(() => {
    block.style.opacity = '1';
    block.style.transform = 'translateY(0)';
  });
}
