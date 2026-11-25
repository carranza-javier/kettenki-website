// Demo-Aufnahme von KeepT (portfolio/keept.html und keept.html).
// Läuft stumm in Schleife, solange sie im Bild ist. Bei
// prefers-reduced-motion startet sie nicht von selbst und bekommt
// stattdessen Bedienelemente.
document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('video.keept-demo');
  if (!videos.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    videos.forEach(video => { video.controls = true; });
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play().catch(() => { entry.target.controls = true; });
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.25 });

  videos.forEach(video => observer.observe(video));
});
