document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.blog-filter-btn');
  const entries = document.querySelectorAll('.blog-entry');

  if (!buttons.length || !entries.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      entries.forEach(entry => {
        const tags = (entry.dataset.tags || '').split(' ');
        entry.style.display = (filter === 'all' || tags.includes(filter)) ? '' : 'none';
      });
    });
  });
});
