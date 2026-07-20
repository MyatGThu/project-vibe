/* ============================================================
   Melina — store.js
   Quick-view overlay, variant + quantity, add-to-bag, cart drawer,
   lazy <model-viewer>. Works with real Shopify product JSON
   (/products/handle.js) or window.__PREVIEW_PRODUCTS__ for the static preview.
   ============================================================ */
(function () {
  'use strict';
  var T = window.Theme || { routes: {}, strings: {} };
  var S = T.strings || {};
  var dialog = document.getElementById('QuickView');

  /* ---------- helpers ---------- */
  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function money(cents) {
    var fmt = T.moneyFormat || '${{amount}}';
    var v = (cents || 0) / 100;
    function withDelims(num, dec, tsep, dsep) {
      var n = Math.abs(num).toFixed(dec).split('.');
      n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, tsep);
      return n.join(n[1] ? dsep : '');
    }
    return fmt.replace(/\{\{\s*(\w+)\s*\}\}/g, function (_, name) {
      switch (name) {
        case 'amount': return withDelims(v, 2, ',', '.');
        case 'amount_no_decimals': return withDelims(v, 0, ',', '.');
        case 'amount_with_comma_separator': return withDelims(v, 2, '.', ',');
        case 'amount_no_decimals_with_comma_separator': return withDelims(v, 0, '.', ',');
        case 'amount_with_space_separator': return withDelims(v, 2, ' ', ',');
        case 'amount_with_apostrophe_separator': return withDelims(v, 2, "'", '.');
        default: return withDelims(v, 2, ',', '.');
      }
    });
  }

  function lockScroll(on) {
    document.dispatchEvent(new CustomEvent('theme:scroll-lock', { detail: on }));
    document.documentElement.style.overflow = on ? 'hidden' : '';
  }

  /* ---------- lazy <model-viewer> ---------- */
  var mvLoading = false;
  function ensureModelViewer() {
    if (mvLoading || !T.modelViewerSrc || (window.customElements && customElements.get('model-viewer'))) return;
    mvLoading = true;
    var s = document.createElement('script'); s.type = 'module'; s.src = T.modelViewerSrc;
    document.head.appendChild(s);
  }
  if (document.querySelector('model-viewer, [data-model-src]')) ensureModelViewer();

  function modelViewerTag(src, poster, alt) {
    return '<model-viewer src="' + esc(src) + '"' + (poster ? ' poster="' + esc(poster) + '"' : '') +
      ' alt="' + esc(alt || '') + '" camera-controls auto-rotate touch-action="pan-y"' +
      ' shadow-intensity="1" exposure="1" interaction-prompt="none" reveal="auto" loading="eager"></model-viewer>';
  }

  /* ---------- product data ---------- */
  function getProduct(card) {
    var handle = card.getAttribute('data-handle');
    if (window.__PREVIEW_PRODUCTS__ && window.__PREVIEW_PRODUCTS__[handle]) {
      return Promise.resolve(window.__PREVIEW_PRODUCTS__[handle]);
    }
    var url = card.getAttribute('data-product-url') || ('/products/' + handle);
    return fetch(url + '.js', { headers: { 'Accept': 'application/json' } }).then(function (r) {
      if (!r.ok) throw new Error('product fetch failed'); return r.json();
    });
  }

  /* ---------- quick view ---------- */
  var qvState = null, navCards = [], navIndex = -1;

  function collectCards() {
    return Array.prototype.slice.call(document.querySelectorAll('[data-product]'))
      .filter(function (c) { return c.getAttribute('data-quick-view') !== 'false'; });
  }

  function updateArrows() {
    var show = navCards.length > 1;
    Array.prototype.slice.call(dialog.querySelectorAll('[data-quick-view-prev], [data-quick-view-next]'))
      .forEach(function (b) { b.hidden = !show; });
  }

  // Render a product into the (already open) dialog. Used for both open and prev/next.
  function loadCard(card) {
    var content = dialog.querySelector('[data-quick-view-content]');
    var skeleton = dialog.querySelector('[data-quick-view-skeleton]');
    Array.prototype.slice.call(content.querySelectorAll('.qv-body')).forEach(function (n) { n.remove(); });
    if (skeleton) skeleton.style.display = '';
    return getProduct(card).then(function (p) {
      if (skeleton) skeleton.style.display = 'none';
      renderQuickView(content, p, card);
    }).catch(function () {
      if (skeleton) skeleton.style.display = 'none';
      content.appendChild(el('<div class="qv-body" style="padding:2rem">Unable to load this product. <a class="link-underline" href="' + esc(card.getAttribute('data-product-url') || '#') + '">View full details</a></div>'));
    });
  }

  function navigate(dir) {
    if (navCards.length < 2) return;
    navIndex = (navIndex + dir + navCards.length) % navCards.length;
    loadCard(navCards[navIndex]);
  }

  function openQuickView(card) {
    if (!dialog) return;
    navCards = collectCards();
    navIndex = navCards.indexOf(card);
    updateArrows();
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
    lockScroll(true);
    loadCard(card);
  }

  function renderQuickView(content, p, card) {
    var images = (p.media && p.media.length ? p.media.filter(function (m) { return m.media_type === 'image'; }).map(function (m) { return (m.preview_image && m.preview_image.src) || m.src; }) : p.images) || [];
    var modelSrc = card && card.getAttribute('data-model-src');
    var mediaHtml = '<div class="qv-media"><div class="qv-media__track">';
    if (modelSrc) { mediaHtml += modelViewerTag(modelSrc, images[0], p.title); ensureModelViewer(); }
    images.forEach(function (src) { mediaHtml += '<div><img src="' + esc(src) + '" alt="' + esc(p.title) + '" loading="lazy"></div>'; });
    mediaHtml += '</div></div>';

    var body = el(
      '<div class="qv-body qv-info">' +
        '<p class="eyebrow qv-info__cat">' + esc(p.type || (p.tags && p.tags[0]) || 'Ready-to-wear') + '</p>' +
        '<h2 class="qv-info__title">' + esc(p.title) + '</h2>' +
        '<p class="qv-info__price" data-qv-price>' + money(p.price) + '</p>' +
        '<div class="qv-info__desc">' + (p.description || '') + '</div>' +
        '<div data-qv-options></div>' +
        '<div class="option"><span class="label">' + esc((S && S.quantity) || 'Quantity') + '</span>' +
          '<div class="qty"><button type="button" data-qty="-1" aria-label="Decrease">–</button>' +
          '<input type="number" min="1" value="1" data-qty-input aria-label="Quantity"><button type="button" data-qty="1" aria-label="Increase">+</button></div></div>' +
        '<div class="qv-actions">' +
          '<button class="btn btn--block btn--lg" data-add-to-bag data-magnetic="0.2">' + esc(S.addToCart || 'Add to bag') + '</button>' +
          '<a class="link-underline muted" style="text-align:center" href="' + esc(p.url || (card && card.getAttribute('data-product-url')) || '#') + '">View full details →</a>' +
        '</div>' +
      '</div>'
    );

    // insert media into a wrapper grid: media on the left, info body on the right
    var mediaWrap = el('<div class="qv-body">' + mediaHtml + '</div>');
    content.appendChild(mediaWrap);
    content.appendChild(body);

    qvState = { product: p, selected: {}, variant: null, qty: 1, priceEl: body.querySelector('[data-qv-price]'), addBtn: body.querySelector('[data-add-to-bag]') };
    buildOptions(body.querySelector('[data-qv-options]'));
    resolveVariant();
  }

  function buildOptions(host) {
    var p = qvState.product;
    var opts = p.options_with_values || (p.options || []).map(function (name, i) {
      var vals = []; p.variants.forEach(function (v) { var val = v['option' + (i + 1)]; if (val && vals.indexOf(val) < 0) vals.push(val); });
      return { name: typeof name === 'string' ? name : name.name, position: i + 1, values: vals };
    });
    opts.forEach(function (opt) {
      var name = opt.name, values = opt.values;
      qvState.selected[opt.position] = values[0];
      var group = el('<div class="option"><div class="option__label"><span class="label">' + esc(name) + '</span><span class="muted" data-opt-current>' + esc(values[0]) + '</span></div><div class="swatches" role="group" aria-label="' + esc(name) + '"></div></div>');
      var wrap = group.querySelector('.swatches');
      values.forEach(function (val, vi) {
        var b = el('<button type="button" class="swatch" aria-pressed="' + (vi === 0 ? 'true' : 'false') + '">' + esc(val) + '</button>');
        b.addEventListener('click', function () {
          qvState.selected[opt.position] = val;
          wrap.querySelectorAll('.swatch').forEach(function (s) { s.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          group.querySelector('[data-opt-current]').textContent = val;
          resolveVariant();
        });
        wrap.appendChild(b);
      });
      host.appendChild(group);
    });
  }

  function resolveVariant() {
    var p = qvState.product, sel = qvState.selected;
    var variant = p.variants.find(function (v) {
      return Object.keys(sel).every(function (pos) { return v['option' + pos] === sel[pos]; });
    }) || p.variants[0];
    qvState.variant = variant;
    if (qvState.priceEl) {
      var html = money(variant.price);
      if (variant.compare_at_price && variant.compare_at_price > variant.price) {
        html = '<span class="price--was">' + money(variant.compare_at_price) + '</span><span class="price--sale">' + money(variant.price) + '</span>';
      }
      qvState.priceEl.innerHTML = html;
    }
    if (qvState.addBtn) {
      var avail = variant && variant.available;
      qvState.addBtn.disabled = !avail;
      qvState.addBtn.textContent = avail ? (S.addToCart || 'Add to bag') : (S.soldOut || 'Sold out');
    }
  }

  function closeQuickView() {
    if (!dialog) return;
    dialog.classList.add('is-closing');
    var done = function () {
      dialog.classList.remove('is-closing');
      if (typeof dialog.close === 'function' && dialog.open) dialog.close(); else dialog.removeAttribute('open');
      lockScroll(false);
    };
    setTimeout(done, 280);
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    // open quick view
    var trigger = e.target.closest('[data-quick-view-trigger], [data-quick-add]');
    if (trigger && T && (window.__PREVIEW_PRODUCTS__ || true)) {
      var card = trigger.closest('[data-product]');
      if (card && (card.dataset.quickView !== 'false')) { e.preventDefault(); openQuickView(card); return; }
    }
    // 3D toggle on a card
    var toggle3d = e.target.closest('[data-toggle-3d]');
    if (toggle3d) {
      e.preventDefault(); e.stopPropagation();
      var c = toggle3d.closest('.card'); var src = toggle3d.getAttribute('data-model-src');
      if (c && src) {
        ensureModelViewer();
        if (!c.querySelector('model-viewer')) c.querySelector('.card__media').insertAdjacentHTML('beforeend', modelViewerTag(src, null, c.getAttribute('data-title') || ''));
        c.classList.toggle('show-3d');
      }
      return;
    }
    // quick-view prev / next
    if (e.target.closest('[data-quick-view-prev]')) { e.preventDefault(); navigate(-1); return; }
    if (e.target.closest('[data-quick-view-next]')) { e.preventDefault(); navigate(1); return; }
    // close
    if (e.target.closest('[data-quick-view-close]')) { e.preventDefault(); closeQuickView(); return; }
    // qty buttons
    var qbtn = e.target.closest('[data-qty]');
    if (qbtn) {
      var input = qbtn.parentElement.querySelector('[data-qty-input]');
      input.value = Math.max(1, (parseInt(input.value, 10) || 1) + parseInt(qbtn.getAttribute('data-qty'), 10));
      if (qvState) qvState.qty = parseInt(input.value, 10);
      return;
    }
    // add to bag
    var add = e.target.closest('[data-add-to-bag]');
    if (add && qvState && qvState.variant) { e.preventDefault(); addToBag(add); return; }
    // cart drawer open/close
    if (e.target.closest('[data-cart-toggle]')) { e.preventDefault(); toggleDrawer(true); return; }
    if (e.target.closest('[data-cart-close], [data-drawer-overlay]')) { e.preventDefault(); toggleDrawer(false); return; }
  });

  // click on dialog backdrop closes (native <dialog> click target is the dialog itself)
  if (dialog) dialog.addEventListener('click', function (e) { if (e.target === dialog) closeQuickView(); });
  document.addEventListener('cancel', function (e) { if (e.target === dialog) { e.preventDefault(); closeQuickView(); } });

  // Arrow keys move between products (ignore while typing in the quantity field)
  if (dialog) dialog.addEventListener('keydown', function (e) {
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); navigate(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); navigate(1); }
  });

  /* ---------- add to bag ---------- */
  function addToBag(btn) {
    var qty = qvState.qty || 1, id = qvState.variant.id;
    var original = btn.textContent; btn.disabled = true; btn.textContent = '…';

    if (window.__PREVIEW_PRODUCTS__) { // static preview: simulate
      previewCart.push({ title: qvState.product.title, variant: qvState.variant, qty: qty, image: (qvState.product.images || [])[0] });
      renderPreviewCart(); btn.textContent = '✓ Added'; setTimeout(function () { btn.textContent = original; btn.disabled = false; closeQuickView(); toggleDrawer(true); }, 650);
      return;
    }
    fetch(T.routes.cartAdd, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ items: [{ id: id, quantity: qty }] })
    }).then(function (r) { return r.json(); }).then(function () {
      return refreshCart();
    }).then(function () {
      btn.textContent = '✓ Added'; setTimeout(function () { btn.textContent = original; btn.disabled = false; closeQuickView(); toggleDrawer(true); }, 500);
    }).catch(function () { btn.textContent = original; btn.disabled = false; });
  }

  /* ---------- cart drawer ---------- */
  var previewCart = [];
  function drawer() { return document.getElementById('CartDrawer'); }
  function toggleDrawer(on) {
    var d = drawer(); if (!d) return;
    var overlay = document.querySelector('[data-drawer-overlay]');
    d.classList.toggle('is-open', on); if (overlay) overlay.classList.toggle('is-open', on);
    lockScroll(on);
    if (on && !window.__PREVIEW_PRODUCTS__) refreshCart();
  }
  function setCount(n) { document.querySelectorAll('.cart-count').forEach(function (c) { c.textContent = n; c.setAttribute('data-count', n); }); }

  function refreshCart() {
    return fetch(T.routes.cart, { headers: { 'Accept': 'application/json' } }).then(function (r) { return r.json(); }).then(function (cart) {
      setCount(cart.item_count);
      var host = document.querySelector('[data-cart-items]');
      var sub = document.querySelector('[data-cart-subtotal]');
      if (host) {
        host.innerHTML = cart.items.length ? cart.items.map(function (it) {
          return '<div class="line-item"><img src="' + esc(it.image) + '" alt="' + esc(it.product_title) + '"><div><div class="card__title" style="font-size:var(--step-0)">' + esc(it.product_title) + '</div><div class="muted">' + esc(it.variant_title || '') + ' × ' + it.quantity + '</div></div><div>' + money(it.final_line_price) + '</div></div>';
        }).join('') : '<p class="muted">' + '(empty)' + '</p>';
      }
      if (sub) sub.textContent = money(cart.total_price);
      return cart;
    });
  }
  function renderPreviewCart() {
    setCount(previewCart.reduce(function (a, i) { return a + i.qty; }, 0));
    var host = document.querySelector('[data-cart-items]'); var sub = document.querySelector('[data-cart-subtotal]');
    if (host) host.innerHTML = previewCart.map(function (it) {
      return '<div class="line-item"><img src="' + esc(it.image) + '" alt=""><div><div class="card__title" style="font-size:var(--step-0)">' + esc(it.title) + '</div><div class="muted">' + esc(it.variant.title) + ' × ' + it.qty + '</div></div><div>' + money(it.variant.price * it.qty) + '</div></div>';
    }).join('') || '<p class="muted">(empty)</p>';
    if (sub) sub.textContent = money(previewCart.reduce(function (a, i) { return a + i.variant.price * i.qty; }, 0));
  }

  if (!window.__PREVIEW_PRODUCTS__) { document.addEventListener('DOMContentLoaded', function () { if (T.routes && T.routes.cart) refreshCart(); }); }
})();
