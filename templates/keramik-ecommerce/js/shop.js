/* Laden: Raster, Produktseite, Warenkorb und Kasse.
   Der Warenkorb lebt im localStorage — kein Server, kein Konto, nichts, was
   diese Demo nicht halten könnte. */

const CART_KEY = 'atelier-lehm-cart';

/* ---------- Werkzeug ---------- */

function money(value) {
  return 'CHF ' + value.toLocaleString('de-CH');
}

function readCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY));
    if (!Array.isArray(raw)) return [];
    return raw.filter((line) => findProduct(line.id) && line.qty > 0);
  } catch (err) {
    return [];
  }
}

function writeCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (err) {
    /* Privates Fenster ohne Speicher: der Warenkorb hält dann nur diese Seite lang. */
  }
  paintCartCount();
}

function addToCart(id, qty) {
  const cart = readCart();
  const line = cart.find((item) => item.id === id);
  if (line) line.qty += qty;
  else cart.push({ id: id, qty: qty });
  writeCart(cart);
}

function setQty(id, qty) {
  let cart = readCart();
  if (qty <= 0) cart = cart.filter((line) => line.id !== id);
  else {
    const line = cart.find((item) => item.id === id);
    if (line) line.qty = qty;
  }
  writeCart(cart);
}

function cartLines() {
  return readCart().map((line) => ({
    product: findProduct(line.id),
    qty: line.qty,
    sum: findProduct(line.id).price * line.qty,
  }));
}

function cartTotals() {
  const lines = cartLines();
  const subtotal = lines.reduce((sum, line) => sum + line.sum, 0);
  const shipping = subtotal === 0 || subtotal >= SHOP.freeShippingFrom ? 0 : SHOP.shipping;
  return { lines: lines, subtotal: subtotal, shipping: shipping, total: subtotal + shipping };
}

function paintCartCount() {
  const count = readCart().reduce((sum, line) => sum + line.qty, 0);
  document.querySelectorAll('[data-cart-count]').forEach((node) => {
    node.textContent = count > 0 ? String(count) : '';
    node.hidden = count === 0;
  });
}

function picture(product, sizes, loading) {
  return (
    '<img src="img/' + product.image + '-sm.webp"' +
    ' srcset="img/' + product.image + '-sm.webp 688w, img/' + product.image + '-lg.webp 1376w"' +
    ' sizes="' + sizes + '" alt="' + product.alt + '"' +
    ' width="1376" height="768" loading="' + loading + '" decoding="async">'
  );
}

/* ---------- Raster auf der Startseite ---------- */

const GRID_SIZES = '(min-width: 1100px) 32vw, (min-width: 700px) 46vw, 92vw';

function renderGrid() {
  const host = document.querySelector('[data-grid]');
  if (!host) return;

  host.innerHTML = GRID.map(function (cell, index) {
    const product = findProduct(cell.id);
    const meta =
      '<span class="tile__name">' + product.name + '</span>' +
      '<span class="tile__cat">' + product.category + '</span>' +
      '<span class="tile__price">' + money(product.price) + '</span>';

    /* Die Videozelle trägt dieselbe Bildgrösse und dieselbe Bildunterschrift
       wie ihre Nachbarn. Erst die Bewegung verrät sie. */
    const media = cell.type === 'video'
      ? '<video class="tile__video" src="' + cell.src + '" autoplay muted loop playsinline ' +
        'preload="metadata" aria-label="Im Atelier: Wiesenblumen werden in die Knoten-Vase gestellt"></video>'
      : picture(product, GRID_SIZES, index < 3 ? 'eager' : 'lazy');

    return (
      '<a class="tile" href="product.html?p=' + product.id + '">' +
        '<span class="tile__media">' + media + '</span>' +
        '<span class="tile__meta">' + meta + '</span>' +
      '</a>'
    );
  }).join('');

  const counter = document.querySelector('[data-piece-count]');
  if (counter) counter.textContent = String(GRID.length);

  watchVideos();
}

/* Das Video laeuft nur, solange es zu sehen ist: das spart Daten und
   schont den Akku. Wer im System weniger Bewegung eingestellt hat, bekommt
   ein Standbild. */
function watchVideos() {
  const videos = document.querySelectorAll('video');
  if (!videos.length) return;

  const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calm) {
    videos.forEach(function (video) {
      video.autoplay = false;
      video.pause();
    });
    return;
  }

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      const video = entry.target;
      if (entry.isIntersecting) {
        const started = video.play();
        if (started && started.catch) started.catch(function () { /* Browser mag nicht, Standbild reicht auch. */ });
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.25 });

  videos.forEach((video) => observer.observe(video));
}

/* ---------- Produktseite ---------- */

function renderProduct() {
  const host = document.querySelector('[data-product]');
  if (!host) return;

  const id = new URLSearchParams(location.search).get('p');
  const product = findProduct(id);
  if (!product) {
    location.replace('index.html');
    return;
  }

  document.title = product.name + ' — ' + SHOP.brand;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', product.lead);

  const hasFilm = GRID.some((cell) => cell.type === 'video' && cell.id === product.id);
  const film = hasFilm
    ? '<figure class="shot shot--film">' +
        '<video src="vid/studio-wildflowers.mp4" autoplay muted loop playsinline preload="metadata" ' +
        'aria-label="Im Atelier: Wiesenblumen werden in die Vase gestellt"></video>' +
        '<figcaption>Im Atelier, Bern</figcaption>' +
      '</figure>'
    : '';

  host.innerHTML =
    '<div class="product__shots">' +
      '<figure class="shot">' + picture(product, '(min-width: 900px) 58vw, 92vw', 'eager') + '</figure>' +
      film +
    '</div>' +
    '<div class="product__panel">' +
      '<p class="eyebrow">' + product.category + '</p>' +
      '<h1 class="product__name">' + product.name + '</h1>' +
      '<p class="product__price">' + money(product.price) + '</p>' +
      '<p class="product__lead">' + product.lead + '</p>' +
      product.story.map((part) => '<p class="product__story">' + part + '</p>').join('') +
      '<form class="product__buy" data-buy>' +
        '<label class="qty">' +
          '<span class="qty__label">Anzahl</span>' +
          '<input class="qty__input" type="number" name="qty" value="1" min="1" max="9" inputmode="numeric">' +
        '</label>' +
        '<button class="btn btn--solid" type="submit">In den Warenkorb</button>' +
      '</form>' +
      '<p class="product__note" data-buy-note hidden>Im Warenkorb. <a href="cart.html">Warenkorb ansehen</a></p>' +
      '<ul class="product__details">' +
        product.details.map((line) => '<li>' + line + '</li>').join('') +
      '</ul>' +
      '<p class="product__ship">Versand CHF ' + SHOP.shipping +
        ', ab ' + money(SHOP.freeShippingFrom) + ' kostenlos. Jedes Stück wird von Hand verpackt.</p>' +
    '</div>';

  const form = host.querySelector('[data-buy]');
  const note = host.querySelector('[data-buy-note]');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const qty = Math.min(9, Math.max(1, Number(form.qty.value) || 1));
    addToCart(product.id, qty);
    note.hidden = false;
  });

  renderMore(product);
  watchVideos();
}

function renderMore(current) {
  const host = document.querySelector('[data-more]');
  if (!host) return;

  const others = PRODUCTS.filter((p) => p.id !== current.id);
  const sameFamily = others.filter((p) => p.category === current.category);
  const picks = sameFamily.concat(others.filter((p) => p.category !== current.category)).slice(0, 3);

  host.innerHTML = picks.map(function (product) {
    return (
      '<a class="tile" href="product.html?p=' + product.id + '">' +
        '<span class="tile__media">' + picture(product, '(min-width: 700px) 30vw, 92vw', 'lazy') + '</span>' +
        '<span class="tile__meta">' +
          '<span class="tile__name">' + product.name + '</span>' +
          '<span class="tile__cat">' + product.category + '</span>' +
          '<span class="tile__price">' + money(product.price) + '</span>' +
        '</span>' +
      '</a>'
    );
  }).join('');
}

/* ---------- Warenkorb ---------- */

function renderCart() {
  const host = document.querySelector('[data-cart]');
  if (!host) return;

  const totals = cartTotals();

  if (totals.lines.length === 0) {
    host.innerHTML =
      '<div class="empty">' +
        '<p class="empty__line">Der Warenkorb ist noch leer.</p>' +
        '<a class="btn btn--line" href="index.html">Zurück zur Kollektion</a>' +
      '</div>';
    paintCartCount();
    return;
  }

  host.innerHTML =
    '<ul class="lines">' +
      totals.lines.map(function (line) {
        return (
          '<li class="line">' +
            '<a class="line__media" href="product.html?p=' + line.product.id + '">' +
              picture(line.product, '160px', 'lazy') +
            '</a>' +
            '<div class="line__body">' +
              '<p class="line__cat">' + line.product.category + '</p>' +
              '<a class="line__name" href="product.html?p=' + line.product.id + '">' + line.product.name + '</a>' +
              '<p class="line__single">' + money(line.product.price) + ' pro Stück</p>' +
            '</div>' +
            '<div class="line__qty">' +
              '<button type="button" class="step" data-step="-1" data-id="' + line.product.id + '" aria-label="Eines weniger">−</button>' +
              '<span class="step__value">' + line.qty + '</span>' +
              '<button type="button" class="step" data-step="1" data-id="' + line.product.id + '" aria-label="Eines mehr">+</button>' +
            '</div>' +
            '<p class="line__sum">' + money(line.sum) + '</p>' +
            '<button type="button" class="line__drop" data-drop="' + line.product.id + '">Entfernen</button>' +
          '</li>'
        );
      }).join('') +
    '</ul>' +
    summaryBlock(totals, '<a class="btn btn--solid" href="checkout.html">Zur Kasse</a>' +
      '<a class="btn btn--quiet" href="index.html">Weiter schauen</a>');

  host.querySelectorAll('[data-step]').forEach(function (button) {
    button.addEventListener('click', function () {
      const line = readCart().find((item) => item.id === button.dataset.id);
      setQty(button.dataset.id, (line ? line.qty : 0) + Number(button.dataset.step));
      renderCart();
    });
  });

  host.querySelectorAll('[data-drop]').forEach(function (button) {
    button.addEventListener('click', function () {
      setQty(button.dataset.drop, 0);
      renderCart();
    });
  });
}

function summaryBlock(totals, actions) {
  const shipping = totals.shipping === 0 ? 'kostenlos' : money(totals.shipping);
  return (
    '<aside class="summary">' +
      '<h2 class="summary__title">Übersicht</h2>' +
      '<dl class="summary__rows">' +
        '<div><dt>Zwischensumme</dt><dd>' + money(totals.subtotal) + '</dd></div>' +
        '<div><dt>Versand</dt><dd>' + shipping + '</dd></div>' +
        '<div class="summary__total"><dt>Total</dt><dd>' + money(totals.total) + '</dd></div>' +
      '</dl>' +
      (totals.shipping === 0
        ? '<p class="summary__hint">Versand ist inbegriffen.</p>'
        : '<p class="summary__hint">Noch ' + money(SHOP.freeShippingFrom - totals.subtotal) + ' bis zum kostenlosen Versand.</p>') +
      '<div class="summary__actions">' + actions + '</div>' +
    '</aside>'
  );
}

/* ---------- Kasse (Attrappe) ---------- */

function renderCheckout() {
  const host = document.querySelector('[data-checkout-summary]');
  if (!host) return;

  const totals = cartTotals();
  host.innerHTML =
    (totals.lines.length
      ? '<ul class="mini">' +
          totals.lines.map(function (line) {
            return (
              '<li class="mini__line">' +
                '<span class="mini__media">' + picture(line.product, '96px', 'lazy') + '</span>' +
                '<span class="mini__body"><span class="mini__name">' + line.product.name + '</span>' +
                '<span class="mini__qty">' + line.qty + ' × ' + money(line.product.price) + '</span></span>' +
                '<span class="mini__sum">' + money(line.sum) + '</span>' +
              '</li>'
            );
          }).join('') +
        '</ul>'
      : '<p class="summary__hint">Der Warenkorb ist leer — die Kasse zeigt hier trotzdem, wie sie aussieht.</p>') +
    summaryBlock(totals, '');

  const form = document.querySelector('[data-checkout-form]');
  const done = document.querySelector('[data-checkout-done]');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    form.hidden = true;
    done.hidden = false;
    done.querySelector('[data-order-total]').textContent = money(totals.total);
    localStorage.removeItem(CART_KEY);
    paintCartCount();
    done.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });
}

/* ---------- Auftauchen und Kopfzeile ---------- */

function watchReveals() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });

  document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));

  /* Die Kacheln blenden einzeln ein. Die Klasse kommt erst hier dazu, damit
     ohne Skript nichts unsichtbar bleibt. */
  document.querySelectorAll('.grid, .more__grid').forEach(function (host) {
    host.classList.add('is-watched');
    host.querySelectorAll('.tile').forEach((tile) => observer.observe(tile));
  });
}

function watchMasthead() {
  const masthead = document.querySelector('.masthead');
  if (!masthead) return;
  const onScroll = function () {
    if (window.scrollY > 8) masthead.setAttribute('data-stuck', '');
    else masthead.removeAttribute('data-stuck');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Start ---------- */

document.addEventListener('DOMContentLoaded', function () {
  paintCartCount();
  renderGrid();
  renderProduct();
  renderCart();
  renderCheckout();
  watchReveals();
  watchMasthead();
});
