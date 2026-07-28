document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.blog-filters');
  const entries = document.querySelectorAll('.blog-entry');

  if (!container || !entries.length) return;

  // Discover which tags actually have a post, straight from each entry's
  // own markup (data-tags + its matching blog_filter_* label span in the
  // meta line), so a new tag shows up on its own once a post using it is
  // published, no separate list to keep in sync here.
  const tags = new Map();
  entries.forEach(entry => {
    const slugs = (entry.dataset.tags || '').split(' ').filter(Boolean);
    const labels = entry.querySelectorAll('[data-i18n^="blog_filter_"]');
    slugs.forEach((slug, i) => {
      if (!tags.has(slug) && labels[i]) {
        tags.set(slug, labels[i].getAttribute('data-i18n'));
      }
    });
  });

  function applyFilter(filter) {
    entries.forEach(entry => {
      const entryTags = (entry.dataset.tags || '').split(' ');
      entry.style.display = (filter === 'all' || entryTags.includes(filter)) ? '' : 'none';
    });
  }

  function makeButton(filter, i18nKey, active) {
    const btn = document.createElement('button');
    btn.className = 'blog-filter-btn' + (active ? ' active' : '');
    btn.dataset.filter = filter;
    btn.setAttribute('data-i18n', i18nKey);
    btn.addEventListener('click', () => {
      container.querySelectorAll('.blog-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(filter);
    });
    return btn;
  }

  container.appendChild(makeButton('all', 'blog_filter_all', true));
  tags.forEach((i18nKey, slug) => {
    container.appendChild(makeButton(slug, i18nKey, false));
  });

  // These buttons were just created with their data-i18n attributes;
  // translations.js already ran its own updateContent() pass before this
  // listener (script load order), so it missed them. Run it again now
  // that they exist, in whatever language is already active.
  if (typeof updateContent === 'function') updateContent();
});
