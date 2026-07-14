// Image lightbox for portfolio ficha pages — opt-in via the container
// classes already used for "Recorrido de pantallas" / "Arquitectura"
// (SPEC.md 5.2), so future fichas following that template get it for
// free without adding markup per image.
document.addEventListener('DOMContentLoaded', () => {
  const zoomableImages = document.querySelectorAll('.screen-walkthrough-item img, .architecture-block img');
  if (!zoomableImages.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.setAttribute('data-i18n-aria-label', 'lightbox_close');

  const overlayImg = document.createElement('img');

  overlay.appendChild(closeBtn);
  overlay.appendChild(overlayImg);
  document.body.appendChild(overlay);

  function openLightbox(img) {
    overlayImg.src = img.currentSrc || img.src;
    overlayImg.alt = img.alt || '';
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  zoomableImages.forEach((img) => {
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    img.addEventListener('click', () => openLightbox(img));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img);
      }
    });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  closeBtn.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('visible')) closeLightbox();
  });

  if (typeof updateContent === 'function') updateContent();
});
