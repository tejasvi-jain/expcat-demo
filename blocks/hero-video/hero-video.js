export default function decorate(block) {
  // Hero video block - supports video background
  const picture = block.querySelector('picture');
  if (picture) {
    picture.classList.add('hero-video-bg');
  }
}
